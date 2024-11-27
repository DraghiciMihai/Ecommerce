import { FormControl, ValidationErrors } from "@angular/forms";

export class FormValidators {
    static onlyWhiteSpace(control: FormControl): ValidationErrors | null {
        if(control.value && control.value.trim().length < 2) {
            return {"onlyWhiteSpace": true}
        }
         return null;
        
    }

    static cardNumberValidator(control: FormControl): ValidationErrors | null {
        if (control.value){
        const value = control.value?.replace(/\s+/g, '');
        const isValid = /^[0-9]{16}$/.test(value);
        return isValid ? null : { "cardNumberValidator": true };
        }
        return null;
      }
}
