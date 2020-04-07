import { ValidatorFn, AbstractControl, Validators, Validator } from '@angular/forms';

export const isValidGad = (gad: string): boolean => {
    const gadPattern = /^\d+\/\d+\/\d+$/;
    return gadPattern.test(gad);
};

export const gadValidator = (): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return isValidGad(control.value) ? null : { invalidGad: true };
    };
};

export const validOption = (options: string[]): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const valid = options.some(option => control.value === option);
        return valid ? null : { invalidOption: true };
    };
};

export const uniqueValidator = (existing: string[]): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const exists = existing.includes(control.value);
        return exists ? { notUnique: true } : null;
    };
};

export const getErrorMessage = (control: AbstractControl): string | null => {
    if (control.hasError('required')) {
        return 'This field is required.';
    } else if (control.hasError('invalidGad')) {
        return 'Invalid Group Address.';
    } else if (control.hasError('invalidOption')) {
        return 'Invalid Option';
    }
};
