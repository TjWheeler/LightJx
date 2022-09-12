import { Validator } from "../Validator";
import { ValidatorBase } from "./ValidatorBase";

export class RequiredValidator extends ValidatorBase {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    validate(input?:any): boolean {
        if(!this.hasValue(input)) {
            return this.fail("is required");
        }
        return this.succeed();
    }
}

export class AggregatedValidator extends ValidatorBase {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    private validators: Validator[] = [];
    add(validator: Validator) {
        this.validators.push(validator);
    }
    clear() {
        this.validators = [];
        this.isValid = false;
        this.errorMessage = "";
    }
    validate(input?:any): boolean {
        let errorMessages = [];
        this.errorMessage = "";
        this.isValid = true;
        for (var i = 0; i < this.validators.length; i++) {
            var validator = this.validators[i];
            try {
                var result = validator.validate(input);
                if (!result) {
                    this.isValid = false;
                    errorMessages.push(validator.errorMessage);
                }
            } catch (e) {
                console.error(e);
                errorMessages.push(`Error in validator ${typeof (validator)}`);
            }
        }
        if (errorMessages.length) this.errorMessage = errorMessages.join(". ");
        return this.isValid;
    }
}

export abstract class RegexValidator extends ValidatorBase {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    abstract expression?: string;
    validate(input?:any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        if(this.isString(input)) {
            return this.test(input);
        } else if(this.isNumber(input)) {
            return this.test(input.toString());
        }
        else {
            console.warn(`The input for field ${this.fieldName} must be a string or a number to use this Validator`);
        }
        return false;
    }
}
export class AlphaTextValidator extends RegexValidator {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    override expression?: string = "^([a-zA-Z\\s]{1,})$";
}
export class AlphaNumericHyphenValidator extends RegexValidator {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    override expression?: string = "^([a-zA-Z0-9\\s\\-]{1,})$";
}