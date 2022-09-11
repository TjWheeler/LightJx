import { RequiredValidator } from "./validators/RequiredValidator";
export class Validate {
    static field(name, displayName) {
        var validator = new ValidatorFluent();
        validator.fieldName = name;
        validator.fieldDisplayName = displayName;
        return validator;
    }
}
export class ValidatorFluent {
    constructor() {
        this.isValid = false;
        this.errorMessage = "";
        this.errorMessages = [];
        this._validators = [];
    }
    add(validator) {
        this._validators.push(validator);
    }
    required() {
        this.add(new RequiredValidator(this.fieldName, this.fieldDisplayName));
        return this;
    }
    validate(input) {
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
            }
            catch (e) {
                console.error(e);
                this.errorMessages.push(`Error in validator ${typeof (validator)}`);
            }
        }
        if (this.errorMessages.length)
            this.errorMessage = this.errorMessages.join(". ");
        return isValid;
    }
}
//# sourceMappingURL=Validate.js.map