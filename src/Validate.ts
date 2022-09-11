import { RequiredValidator } from "./validators/RequiredValidator";
import { Validator } from "./Validator";
export class Validate {
    public static field(name?: string, displayName?: string): ValidatorFluent {
        var validator = new ValidatorFluent();
        validator.fieldName = name;
        validator.fieldDisplayName = displayName;
        return validator;
    }
}
export class ValidatorFluent {
    public fieldName?: string;
    public fieldDisplayName?: string;
    public input: any;
    public isValid: boolean = false;
    public errorMessage: string = "";
    public errorMessages: string[] = [];
    private _validators: Validator[] = [];
    private add(validator: Validator) {
        this._validators.push(validator);
    }
    public required(): ValidatorFluent {
        this.add(new RequiredValidator(this.fieldName, this.fieldDisplayName))
        return this;
    }
    public validate(input: any): boolean {
        this.input = input;
        this.errorMessages = [];
        this.errorMessage = "";
        var isValid = true;
        for (var i = 0; i < this._validators.length; i++) {
            var validator = this._validators[i];
            try {
                var result = validator.validate(this.input);
                if (!result) {
                    isValid = false;
                    this.errorMessages.push(validator.errorMessage);
                }
            } catch (e) {
                console.error(e);
                this.errorMessages.push(`Error in validator ${typeof (validator)}`);
            }
        }
        if (this.errorMessages.length) this.errorMessage = this.errorMessages.join(". ");
        return isValid;
    }
}

