import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

export interface FormLuInterface { 
    [key: number]: {form: FormGroup , sub: Subscription} 
}