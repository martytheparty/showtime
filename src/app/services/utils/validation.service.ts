import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  getPositiveFloatingPointValidator(value: string): boolean {
    const POSITIVE_FLOATING_POINT_REGEX = /^\d+(\.\d+)?$/;
    return POSITIVE_FLOATING_POINT_REGEX.test(value);
  }
}
