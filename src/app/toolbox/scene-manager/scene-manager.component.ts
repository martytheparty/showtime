import { Component, inject, effect, OnDestroy } from '@angular/core';
import { ColorPickerComponent } from '../common-components/color-picker/color-picker.component';
import { ThreejsService } from '../../services/threejs.service';
import { SceneInterface } from '../../interfaces/three/scene-interface';
import { RendererInterface } from '../../interfaces/three/renderer-interface';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FcValidatorsService } from '../services/fc-validators.service';
import { ValidationTokenTypes } from '../../interfaces/showtime/validation-interface';
import { ValidationErrorMsgComponent } from '../common-components/validation-error-msg/validation-error-msg.component';
import { ValidationService } from '../../services/utils/validation.service';
import { MatIconModule } from '@angular/material/icon';
import { InfoMsgComponent } from '../common-components/info-msg/info-msg.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'app-scene-manager',
    imports: [
        ValidationErrorMsgComponent,
        ColorPickerComponent,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule
    ],
    templateUrl: './scene-manager.component.html',
    styleUrl: './scene-manager.component.scss'
})
export class SceneManagerComponent implements OnDestroy {

  dialog = inject(MatDialog);

  threejsService: ThreejsService = inject(ThreejsService);
  fcValidationService: FcValidatorsService = inject(FcValidatorsService);
  validationService: ValidationService = inject(ValidationService);

  scene: SceneInterface | undefined;
  renderer: RendererInterface | undefined;

  formInitialized = false;
  form: FormGroup = new FormGroup({
    castShadows: new FormControl(false),
    animated: new FormControl(false),
    fog: new FormControl('')
  });

  hadFogError = false;
  hadNearError = false;
  hadFarError = false;

  red = 0;
  green = 0;
  blue = 0;

  fogRed = 0;
  fogGreen = 0;
  fogBlue = 0;

  animated = false;

  previousFogDensity = '';
  previousFogNear = '';
  previousFogFar = '';

  subs: Subscription[] = [];

  constructor() {
    this.setupFormFields();

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
                if (this.form.valid)
                {
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

                    if (this.form?.value.near) {
                      let fNear = 0;
                      if (typeof this.form.value.near === "string") {
                        const fNearNum = parseFloat(this.form.value.near);
                        if (!isNaN(fNearNum))
                        {
                          fNear = fNearNum;
                        }
                      } 

                      if (this.scene.near !== fNear) {
                        this.scene.near = fNear;
                        this.threejsService.updateScene(this.scene);
                      }
                    }

                    if (this.form?.value.far) {
                      let fFar = parseFloat(this.form.value.far);
                      if (this.scene.far != fFar) {
                        this.scene.far = fFar;
                        this.threejsService.updateScene(this.scene);
                      }
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

  ngOnDestroy(): void
  {
    this.subs.forEach(
      (sub) =>  sub.unsubscribe()
    );
  }

  setupFormFields(): void
  {
    // Fog Density
    let fogDensityValidators: ((control: AbstractControl<any, any>) => ValidationErrors | null)[] = [];
    
    let validationTokens: ValidationTokenTypes[] = this.validationService.getValidationTokensForPath(["scene", "fog", "fogDensity"]);

    validationTokens.forEach(
      (validationToken: ValidationTokenTypes) => {
        const validatorFunction = this.fcValidationService.getValidatorForToken(validationToken);
        if (validatorFunction !== null) {
          fogDensityValidators.push(validatorFunction);
        }
      }
    );
   
    const fogDensityFormControl =  new FormControl(
      '1', 
      {
        validators: fogDensityValidators
      }
    )
    this.form.addControl("fogDensity", fogDensityFormControl);

    this.form.controls['fogDensity'].markAsDirty();
    this.form.controls['fogDensity'].markAsTouched();

    // Fog Near

    let nearValidators: ((control: AbstractControl<any, any>) => ValidationErrors | null)[] = [];
    
    let nearTokens: ValidationTokenTypes[] = this.validationService.getValidationTokensForPath(["scene", "fog", "near"]);

    nearTokens.forEach(
      (validationToken: ValidationTokenTypes) => {
        const validatorFunction = this.fcValidationService.getValidatorForToken(validationToken);
        if (validatorFunction !== null) {
          nearValidators.push(validatorFunction);
        }
      }
    );
   
    const nearFormControl =  new FormControl(
      '1', 
      {
        validators: nearValidators
      }
    )
    this.form.addControl('near', nearFormControl);

    this.form.controls['near'].markAsDirty();
    this.form.controls['near'].markAsTouched();

    // Fog Far

    let farValidators: ((control: AbstractControl<any, any>) => ValidationErrors | null)[] = [];
    
    let farTokens: ValidationTokenTypes[] = this.validationService.getValidationTokensForPath(["scene", "fog", "far"]);

    farTokens.forEach(
      (validationToken: ValidationTokenTypes) => {
        const validatorFunction = this.fcValidationService.getValidatorForToken(validationToken);
        if (validatorFunction !== null) {
          farValidators.push(validatorFunction);
        }
      }
    );
   
    const farFormControl =  new FormControl(
      '10', 
      {
        validators: farValidators
      }
    )
    this.form.addControl("far", farFormControl);

    this.form.controls['far'].markAsDirty();
    this.form.controls['far'].markAsTouched();

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

  savePreviousFogDensity() {
    const control: AbstractControl<string, string> = this.form.controls['fogDensity'];
    this.previousFogDensity = control.value;
  }

  validateFogDensity(event: KeyboardEvent, validationTokens: ValidationTokenTypes[]): void {
    // first check to see if new value is legal
    const control: AbstractControl<string, string> = this.form.controls['fogDensity'];
    const currentValue = control.value;
    const previousValue = this.previousFogDensity;
    const currentValueValidationToken = this.validateValueForTokens(validationTokens, currentValue);
    
    let isValueOverwriteException = this.checkForOverwriteException(currentValue, validationTokens);

    // If it is legal do nothing or and exception value. 
    if(currentValueValidationToken !== 'none' && !isValueOverwriteException) {
     const previousValueValidationToken = this.validateValueForTokens(validationTokens, previousValue);
     // if it is not legal and the previous overwrite with previous:
     if (previousValueValidationToken === "none")
     {
        // 1. It was legal but not legal now - go back to original value
        control.setValue(previousValue);
        // 2. show help text with information icon
     }
     // the fog value WAS invalid to set hadFogError to false
     this.hadFogError = true;
    }
  }

  checkForOverwriteException(value: string, validationTokens: ValidationTokenTypes[]): boolean
  {
    let isValueOverwriteException = false;
    validationTokens.forEach(
      (validationToken: ValidationTokenTypes) => {
        const exceptionValues = this.validationService.getOverwriteExceptionsForToken(validationToken);

        exceptionValues.forEach(
          (exceptionValue: string) => {
            if(exceptionValue === value){
              isValueOverwriteException = true;
            }
          } 
        );
      }
    );
    return isValueOverwriteException;
  }

  savePreviousFogNear() {
    const control: AbstractControl<string, string> = this.form.controls['near'];
    this.previousFogNear = control.value;
  }

  validateFogNear(event: KeyboardEvent, validationTokens: ValidationTokenTypes[]): void {
    // first check to see if new value is legal
    const control: AbstractControl<string, string> = this.form.controls['near'];
    const currentValue = control.value;
    const previousValue = this.previousFogNear;
    const currentValueValidationToken = this.validateValueForTokens(validationTokens, currentValue); 

    let isValueOverwriteException = this.checkForOverwriteException(currentValue, validationTokens);

    if(currentValueValidationToken !== 'none' && !isValueOverwriteException) {
     const previousValueValidationToken = this.validateValueForTokens(validationTokens, previousValue);
     // if it is not legal:
     if (previousValueValidationToken === "none")
     {
        // 1. It was legal but not legal now - go back to original value
        control.setValue(previousValue);
        // 2. show help text with information icon
     }
     // the fog value WAS invalid to set hadFogError to false
     this.hadNearError = true;
    }
  }

  savePreviousFogFar() {
    const control: AbstractControl<string, string> = this.form.controls['far'];
    this.previousFogFar = control.value;
  }

  validateFogFar(event: KeyboardEvent, validationTokens: ValidationTokenTypes[]): void {
    // first check to see if new value is legal
    const control: AbstractControl<string, string> = this.form.controls['far'];
    const currentValue = control.value;
    const previousValue = this.previousFogFar;
    const currentValueValidationToken = this.validateValueForTokens(validationTokens, currentValue); 

    let isValueOverwriteException = this.checkForOverwriteException(currentValue, validationTokens);

    if(currentValueValidationToken !== 'none' && !isValueOverwriteException) {
     const previousValueValidationToken = this.validateValueForTokens(validationTokens, previousValue);
     // if it is not legal:
     if (previousValueValidationToken === "none")
     {
        // 1. It was legal but not legal now - go back to original value
        control.setValue(previousValue);
        // 2. show help text with information icon
     }
     // the fog value WAS invalid to set hadFogError to false
     this.hadFarError = true;
    }
  }

  validateValueForTokens(validationTokens: ValidationTokenTypes[], value: string): ValidationTokenTypes {
    let failedTokenType: ValidationTokenTypes = 'none';

    // sets return value based of first failed token
    for(let i = 0; i < validationTokens.length; i++) {
      const validationToken = validationTokens[i];
      const validationFunction = this.validationService.getValidationFunctionForToken(validationToken);
      if (validationFunction !== null) {
        const result = validationFunction(value);
        if (result === false)
        {
          failedTokenType = validationToken;
          break;
        }
      }
    }

    return failedTokenType;

  }

  launchInfoDialog(validationToken: ValidationTokenTypes): void
  {
    this.dialog.open(InfoMsgComponent, {
      data: { validationTokens: [validationToken] }
    });
  }
}
