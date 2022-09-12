import { ValidationOptions, ValidatorFluent } from "./ValidatorFluent";

export const validationOptions = new ValidationOptions();
export class Validate {
    public static field(name?: string, displayName?: string): ValidatorFluent {
        var validator = new ValidatorFluent(validationOptions);
        validator.fieldName = name;
        validator.displayName = displayName;
        return validator;
    }
}
