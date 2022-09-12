import { Validator } from "./Validator";
import * as Validators from "./validators/CoreValidators";

export class ValidationOptions {
    public errorMessageSeperator = ". ";
}
export class ValidatorFluent {
    constructor(options: ValidationOptions) {
        this.options = options;
    }
    private options: ValidationOptions;
    public fieldName?: string;
    public displayName?: string;
    public input: any;
    public isValid: boolean = false;
    public errorMessage: string = "";
    public errorMessages: string[] = [];
    private validators: Validator[] = [];
    private add(validator: Validator) {
        this.validators.push(validator);
    }
    public required(): ValidatorFluent {
        this.add(new Validators.RequiredValidator(this.fieldName, this.displayName))
        return this;
    }
    public with(validator:Validator): ValidatorFluent {
        validator.fieldName = this.fieldName;
        validator.fieldDisplayName = this.displayName;
        this.add(validator);
        return this;
    }

    public validate(input: any): ValidatorFluent {
        this.input = input;
        this.errorMessages = [];
        this.errorMessage = "";
        var isValid = true;
        for (var i = 0; i < this.validators.length; i++) {
            var validator = this.validators[i];
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
        if (this.errorMessages.length) this.errorMessage = this.errorMessages.join(this.options.errorMessageSeperator || ". ");
        return this;
    }
}