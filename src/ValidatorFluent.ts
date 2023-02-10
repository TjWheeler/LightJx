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
    public setName(name:string, displayName?:string): ValidatorFluent {
        this.validators.forEach((validator:Validator)=>{
            validator.fieldName = name;
            if(displayName) validator.fieldDisplayName = displayName;
        });
        return this.reset();
    }
    public reset() : ValidatorFluent {
        this.errorMessage = "";
        this.errorMessages = [];
        this.isValid = false;
        this.validators.forEach((validator:Validator)=>{
            validator.reset();
        });
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
        this.isValid = isValid;
        if (this.errorMessages.length) this.errorMessage = this.errorMessages.join(this.options.errorMessageSeperator || ". ");
        return this;
    }
    public required(): ValidatorFluent {
        this.add(new Validators.RequiredValidator(this.fieldName, this.displayName))
        return this;
    }
    /**
     * Validate with a custom validator
     * @param validator 
     * @returns 
     */
    public with(validator:Validator): ValidatorFluent {
        validator.fieldName = this.fieldName;
        validator.fieldDisplayName = this.displayName;
        this.add(validator);
        return this;
    }
    /**
     * Validate with a custom regular expression
     * @param expression Regular Expression as a String
     * @returns 
     */
    public withExpression(expression:string | RegExp): ValidatorFluent {
        let validator = new Validators.RegexValidator(this.fieldName, this.displayName);
        validator.expression = expression;
        this.add(validator);
        return this;
    }
    /**
     * Validate as Alpha or spaces.
     * @returns 
     */
    public asAlphaText(): ValidatorFluent {
        this.add(new Validators.AlphaTextValidator(this.fieldName, this.displayName))
        return this;
    }
    public asAlphaNumericText(): ValidatorFluent {
        this.add(new Validators.AlphaNumericTextValidator(this.fieldName, this.displayName))
        return this;
    }
    /**
     * Validate as Alpha, spaces, numbers and hyphen
     * @returns 
     */
    public asAlphaNumericHyphenText(): ValidatorFluent {
        this.add(new Validators.AlphaNumericHyphenValidator(this.fieldName, this.displayName));
        return this;
    }
    
    public asDate(): ValidatorFluent {
        this.add(new Validators.DateValidator(this.fieldName, this.displayName));
        return this;
    }
    public asName(): ValidatorFluent {
        this.add(new Validators.NameTextValidator(this.fieldName, this.displayName));
        return this;
    }
    public asPhoneNumber(): ValidatorFluent {
        this.add(new Validators.PhoneNumberValidator(this.fieldName, this.displayName));
        return this;
    }
    public asNumber(): ValidatorFluent {
        this.add(new Validators.NumberValidator(this.fieldName, this.displayName));
        return this;
    }
    public asEmail(): ValidatorFluent {
        this.add(new Validators.EmailValidator(this.fieldName, this.displayName));
        return this;
    }
    public isDateOnOrAfter(minDate:Date | Function): ValidatorFluent {
        this.add(new Validators.MinDateValidator(minDate, this.fieldName, this.displayName));
        return this;
    }
    public isDateOnOrBefore(maxDate:Date | Function): ValidatorFluent {
        this.add(new Validators.MaxDateValidator(maxDate, this.fieldName, this.displayName));
        return this;
    }
    public isDateBetween(minDate:Date, maxDate:Date): ValidatorFluent {
        this.add(new Validators.BetweenDateValidator(minDate, maxDate, this.fieldName, this.displayName));
        return this;
    }
    public asBoolean(): ValidatorFluent {
        this.add(new Validators.BooleanValidator(this.fieldName, this.displayName));
        return this;
    }
    public containsText(searchText:string | Function, ignoreCase:boolean = false): ValidatorFluent {
        this.add(new Validators.ContainsTextValidator(searchText, ignoreCase, this.fieldName, this.displayName));
        return this;
    }
    public asInt(): ValidatorFluent {
        this.add(new Validators.IntValidator(this.fieldName, this.displayName));
        return this;
    }
    public asFloat(): ValidatorFluent {
        this.add(new Validators.FloatValidator(this.fieldName, this.displayName));
        return this;
    }
    public asGuid(): ValidatorFluent {
        this.add(new Validators.GuidValidator(this.fieldName, this.displayName));
        return this;
    }
    public asHexColor(): ValidatorFluent {
        this.add(new Validators.HexColorValidator(this.fieldName, this.displayName));
        return this;
    }
    public asUrl(): ValidatorFluent {
        this.add(new Validators.UrlValidator(this.fieldName, this.displayName));
        return this;
    }
    public asSecureUrl(): ValidatorFluent {
        this.add(new Validators.HttpsUrlValidator(this.fieldName, this.displayName));
        return this;
    }
    public in(items:Array<any>): ValidatorFluent {
        this.add(new Validators.InArrayValidator(items, this.fieldName, this.displayName));
        return this;
    }
    public notIn(items:Array<any>): ValidatorFluent {
        this.add(new Validators.NotInArrayValidator(items, this.fieldName, this.displayName));
        return this;
    }
    public isNull(): ValidatorFluent {
        this.add(new Validators.InArrayValidator([null], this.fieldName, this.displayName));
        return this;
    }
    public isEmptyString(): ValidatorFluent {
        this.add(new Validators.InArrayValidator([""], this.fieldName, this.displayName));
        return this;
    }
    public is(value:any): ValidatorFluent {
        this.add(new Validators.InArrayValidator([value], this.fieldName, this.displayName));
        return this;
    }
    public isNot(value:any): ValidatorFluent {
        this.add(new Validators.NotInArrayValidator([value], this.fieldName, this.displayName));
        return this;
    }
    public hasLengthRange(min?:number | Function, max?:number | Function): ValidatorFluent {
        this.add(new Validators.LengthValidator(min, max, this.fieldName, this.displayName));
        return this;
    }
    public hasMaxLength(maxLength:number | Function): ValidatorFluent {
        this.add(new Validators.LengthValidator(undefined, maxLength, this.fieldName, this.displayName));
        return this;
    }
    public hasMinLength(minLength:number | Function): ValidatorFluent {
        this.add(new Validators.LengthValidator(minLength, undefined, this.fieldName, this.displayName));
        return this;
    }
    public min(min:number | Function): ValidatorFluent {
        this.add(new Validators.MinValidator(min, this.fieldName, this.displayName));
        return this;
    }
    public max(max:number | Function): ValidatorFluent {
        this.add(new Validators.MaxValidator(max, this.fieldName, this.displayName));
        return this;
    }
    
}