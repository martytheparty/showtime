import { Injectable, inject } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidationService } from '../../services/utils/validation.service';
import { ValidationTokenTypes } from '../../interfaces/showtime/validation-interface';

@Injectable({
  providedIn: 'root'
})
export class FcValidatorsService {
  /*
    This only purpose of this service is to convert validation functions
    into Angular Forms validators.
  */

  validationService: ValidationService = inject(ValidationService);

  getValidatorForToken(token: ValidationTokenTypes): ((control: AbstractControl<any, any>) => ValidationErrors | null) | null {
    let validator: ((control: AbstractControl<any, any>) => ValidationErrors | null) | null = null
    if (token === 'invalidPositiveFloat')
    {
      validator = this.getPositiveFloatingPointValidator();
    }

    return validator;
  } 

  getPositiveFloatingPointValidator(): (control: AbstractControl<any, any>) => ValidationErrors | null {
    const validationFunction = this.validationService.getPositiveFloatingPointValidator;

    return function positiveFloatingPointValidator(control: AbstractControl): ValidationErrors | null {
      const value = control.value;
      if (value === null || value === '') {
        return { invalidPositiveFloat: true };
      }

      return validationFunction(value) ? null : { invalidPositiveFloat: true };
    }
  }
}
