import { Injectable, inject } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidationService } from '../../services/utils/validation.service';

@Injectable({
  providedIn: 'root'
})
export class UiValidationService {

  validationService: ValidationService = inject(ValidationService);

  constructor() { }

  getPositiveFloatingPointValidator(): (control: AbstractControl<any, any>) => ValidationErrors | null {
    const validation = this.validationService.getPositiveFloatingPointValidator;

    return function positiveFloatingPointValidator(control: AbstractControl): ValidationErrors | null {
      const value = control.value;
      if (value === null || value === '') {
        return { invalidPositiveFloat: true };
      }

      return validation(value) ? null : { invalidPositiveFloat: true };
    }
  }
}
