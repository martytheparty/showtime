import { Component, inject, effect, OnDestroy } from '@angular/core';
import { ColorPickerComponent } from '../common-components/color-picker/color-picker.component';
import { ThreejsService } from '../../threejs.service';
import { SceneInterface } from '../../interfaces/scene-interface';
import { RendererInterface } from '../../interfaces/renderer-interface';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scene-manager',
  standalone: true,
  imports: [
    ColorPickerComponent,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './scene-manager.component.html',
  styleUrl: './scene-manager.component.scss'
})
export class SceneManagerComponent implements OnDestroy {

  threejsService: ThreejsService = inject(ThreejsService);

  scene: SceneInterface | undefined;
  renderer: RendererInterface | undefined;

  formInitialized = false;
  form: FormGroup = new FormGroup({
    castShadows: new FormControl(false),
    animated: new FormControl(false)
  });

  red = 0;
  green = 0;
  blue = 0;
  animated = false;

  subs: Subscription[] = [];

  constructor() {
    effect(
      () => {
        this.scene  = this.threejsService.sceneItemValues();
        
        this.red = this.scene.redColor.startValue;
        this.green = this.scene.greenColor.startValue;
        this.blue = this.scene.bgBlueColor;
        this.animated = this.scene.animated;

        this.renderer = this.threejsService.rendererItemValues();
        this.form.controls['animated'].setValue(this.scene.animated);

        if (this.renderer) {
          this.form.controls['castShadows'].setValue(this.renderer.castShadows);
          this.formInitialized = true;
        }

      }
    );

    const sub: Subscription = this.form.valueChanges.subscribe(
      () => {
        if (this.scene && this.scene.animated !== this.form.value.animated)
        {
          this.scene.animated = this.form.value.animated;
          this.threejsService.updateScene(this.scene);
        }

        if (this.formInitialized && this.renderer) {
          this.renderer.castShadows = this.form.value.castShadows;
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
      this.scene.bgBlueColor = newColor;
      this.threejsService.updateScene(this.scene);
    }
  }
}
