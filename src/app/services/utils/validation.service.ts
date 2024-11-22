import { Injectable } from '@angular/core';
import { ValidationTokenTypes } from '../../interfaces/showtime/validation-interface';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  validationTokenForPathMap: any = {
    scene: {
      fog: 
      { 
        fogDensity: [ this.ensureValidationTokenType('invalidPositiveFloat') ],
        near: [ this.ensureValidationTokenType('invalidPositiveFloat') ]
      }
    }
  };

  validationValueTextForTokenDictionary: any = {
    invalidPositiveFloat: "Invalid positive floating-point number"
  };

  validationValueHelpTextForTokenDictionary: any = {
    invalidPositiveFloat: "Positive float-point numbers can only have 0-9 characters and a single decimal point."
  };

  validationValueFunctionForTokenDictionary: any = {
    invalidPositiveFloat: this.getPositiveFloatingPointValidator
  };

  constructor() { }

  // the only reason this function exists it to ensure the validation type
  ensureValidationTokenType(validationToken: ValidationTokenTypes): ValidationTokenTypes
  {
    return validationToken;
  }

  getValidationTokensForPath(path: string[]): ValidationTokenTypes[]
  {
    let validationType: ValidationTokenTypes[] = ["none"];

    if (this.isOneDeep(path))
    {
      if(
        this.validationTokenForPathMap[path[0]] && 
        this.validationTokenForPathMap[path[0]][path[1]]
      )
      {
        validationType = this.validationTokenForPathMap[path[0]][path[1]];
      }
    } else if (this.isTwoDeep(path)) {
      if(
        this.validationTokenForPathMap[path[0]] && 
        this.validationTokenForPathMap[path[0]][path[1]] &&
        this.validationTokenForPathMap[path[0]][path[1]][path[2]]
      )
      {
        validationType = this.validationTokenForPathMap[path[0]][path[1]][path[2]];
      }
    }

    return validationType
  }

  getValidationTextForToken(token: ValidationTokenTypes): string 
  {
    let text = "";
    if (this.validationValueTextForTokenDictionary[token]){
      text = this.validationValueTextForTokenDictionary[token];
    }
    return text;
  }

  getValidationHelpTextForToken(token: ValidationTokenTypes): string 
  {
    let helpText = "";
    if (this.validationValueHelpTextForTokenDictionary[token]){
      helpText = this.validationValueHelpTextForTokenDictionary[token];
    }
    return helpText;
  }

  getValidationFunctionForToken(token: ValidationTokenTypes): ((value: string) => boolean) | null
  {
    let fun = null;
    if (this.validationValueFunctionForTokenDictionary[token]){
      fun = this.validationValueFunctionForTokenDictionary[token];
    }
    return fun;
  }

  isOneDeep(path: string[]): boolean {
    let result = false;
    if (path && path.length === 2)
    {
      result = true;
    }

    return result;
  }

  isTwoDeep(path: string[]): boolean {
    let result = false;
    if (path && path.length === 3)
    {
      result = true;
    }

    return result;
  }

  getPositiveFloatingPointValidator(value: string): boolean {
    const POSITIVE_FLOATING_POINT_REGEX = /^\d+(\.\d+)?$/;
    return POSITIVE_FLOATING_POINT_REGEX.test(value);
  }

}
