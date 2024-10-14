import { Component, inject, effect, OnDestroy } from '@angular/core';
import { ColorPickerComponent } from '../common-components/color-picker/color-picker.component';
import { ThreejsService } from '../../services/threejs.service';
import { SceneInterface } from '../../interfaces/scene-interface';
import { RendererInterface } from '../../interfaces/renderer-interface';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { UiValidationService } from '../services/ui-validation.service';
@Component({
  selector: 'app-scene-manager',
  standalone: true,
  imports: [
    ColorPickerComponent,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './scene-manager.component.html',
  styleUrl: './scene-manager.component.scss'
})
export class SceneManagerComponent implements OnDestroy {

  threejsService: ThreejsService = inject(ThreejsService);
  uiValidationService: UiValidationService = inject(UiValidationService);

  scene: SceneInterface | undefined;
  renderer: RendererInterface | undefined;

  formInitialized = false;
  form: FormGroup = new FormGroup({
    castShadows: new FormControl(false),
    animated: new FormControl(false),
    fog: new FormControl('')
  });

  red = 0;
  green = 0;
  blue = 0;

  fogRed = 0;
  fogGreen = 0;
  fogBlue = 0;

  animated = false;

  subs: Subscription[] = [];

  constructor() {

    const fogDensityValidators: ((control: AbstractControl<any, any>) => ValidationErrors | null)[] = [];
    fogDensityValidators.push(this.uiValidationService.getPositiveFloatingPointValidator());
    const fogDensityFormControl =  new FormControl(
      '.1', 
      {
        validators: fogDensityValidators
      }
    )
    this.form.addControl("fogDensity", fogDensityFormControl);

    this.form.controls['fogDensity'].markAsDirty();
    this.form.controls['fogDensity'].markAsTouched();
    effect(
      () => {
        this.scene  = this.threejsService.sceneItemValues();
        this.renderer = this.threejsService.rendererItemValues();

        if (this.renderer && this.scene) { // there are two signals don't set form values or the change sub until both are ready
          this.red = this.scene.redColor.startValue;
          this.green = this.scene.greenColor.startValue;
          this.blue = this.scene.blueColor.startValue;

          this.fogRed = this.scene.redFogColor;
          this.fogGreen = this.scene.greenFogColor;
          this.fogBlue = this.scene.blueFogColor;


          this.animated = this.scene.animated;
          this.form.controls['fog'].setValue(this.scene.fog);
          this.form.controls['animated'].setValue(this.scene.animated);
          this.form.controls['castShadows'].setValue(this.renderer.castShadows);
          this.form.controls['fogDensity'].setValue(this.scene.fogDensity.toString());

          if (!this.formInitialized) {
            this.formInitialized = true;
            const sub: Subscription = this.form.valueChanges.subscribe(
              () => {
                if (this.scene && this.scene.animated !== this.form.value.animated)
                {
        
                  this.scene.animated = this.form.value.animated;
                  this.threejsService.updateScene(this.scene);
                } 
                
                if (this.scene) {
                  
                  if (this.scene.fog !== this.form.value.fog) {
                    this.scene.fog = this.form.value.fog;
                    this.threejsService.updateScene(this.scene);
                  }

                  if (this.form?.value.fogDensity) {
                    let fDensity = 0;
                    if (typeof this.form.value.fogDensity === "string") {
                      const fDensityNum = parseFloat(this.form.value.fogDensity);
                      if (!isNaN(fDensityNum))
                      {
                        fDensity = fDensityNum;
                      }
                    } 

                    if (this.scene.fogDensity !== fDensity) {
                      this.scene.fogDensity = fDensity;
                      this.threejsService.updateScene(this.scene);
                    }
                    

                  }
                }
        
                if (this.formInitialized && this.renderer) {
                  this.renderer.castShadows = this.form.value.castShadows;
                }
              }
            );
            this.subs.push(sub); 
          }
        }

      }
    );


  }

  ngOnDestroy(): void {
    this.subs.forEach(
      (sub) =>  sub.unsubscribe()
    );
  }

  redColorChange(newColor: number): void
  {
    if (this.scene)
    {
      this.scene.redColor.startValue = newColor;
      this.threejsService.updateScene(this.scene);
    }
  }

  greenColorChange(newColor: number): void
  {
    if (this.scene)
    {
      this.scene.greenColor.startValue = newColor;
      this.threejsService.updateScene(this.scene);
    }
  }

  blueColorChange(newColor: number): void
  {
    if (this.scene)
    {
      this.scene.blueColor.startValue = newColor;
      this.threejsService.updateScene(this.scene);
    }
  }

  redFogColorChange(newColor: number): void
  {
    if (this.scene)
    {
      this.scene.redFogColor = newColor;
      this.threejsService.updateScene(this.scene);
    }
  }

  greenFogColorChange(newColor: number): void
  {
    if (this.scene)
    {
      this.scene.greenFogColor = newColor;
      this.threejsService.updateScene(this.scene);
    }
  }

  blueFogColorChange(newColor: number): void
  {
    if (this.scene)
    {
      this.scene.blueFogColor = newColor;
      this.threejsService.updateScene(this.scene);
    }
  }
}
