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
    //private validatorNames: string[] = [];
    private add(validator: Validator) {
        this.validators.push(validator);
        //this.validatorNames.push(validator.constructor.name);
    }
    /**
     * Check to see if a specific Validator has already been added.
     * @param type A validator eg; typeof MaxValidator
     * @returns 
     */
    public hasValidator(typeName: string) : boolean {
        if(typeName) {
            for(let i =0; i < this.validators.length; i++) {
                if(this.validators[i].constructor.name == typeName) return true;
            }
        }
        return false;
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
    public required(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.RequiredValidator(this.fieldName, this.displayName, errorMessage))
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
     * @param errorMessage Optional custom error message
     * @returns 
     */
    public withExpression(expression:string | RegExp, errorMessage?: string): ValidatorFluent {
        let validator = new Validators.RegexValidator(this.fieldName, this.displayName, errorMessage);
        validator.expression = expression;
        this.add(validator);
        return this;
    }
    /**
     * Validate as Alpha or spaces.
     * @returns 
     */
    public asAlphaText(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.AlphaTextValidator(this.fieldName, this.displayName, errorMessage))
        return this;
    }
    public asAlphaNumericText(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.AlphaNumericTextValidator(this.fieldName, this.displayName, errorMessage))
        return this;
    }
    /**
     * Validate as Alpha, spaces, numbers and hyphen
     * @returns 
     */
    public asAlphaNumericHyphenText(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.AlphaNumericHyphenValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    
    public asDate(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.DateValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public asName(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.NameTextValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public asPhoneNumber(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.PhoneNumberValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public asNumber(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.NumberValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public asEmail(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.EmailValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public isDateOnOrAfter(minDate:Date | Function, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.MinDateValidator(minDate, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public isDateOnOrBefore(maxDate:Date | Function, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.MaxDateValidator(maxDate, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public isDateBetween(minDate:Date, maxDate:Date, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.BetweenDateValidator(minDate, maxDate, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    /**
    * This should not be replied upon.  Server validation should check for XSS.
    * Blacklists angle brackets and encoded representation only.
    * This method is for improved user experience only.
    */
    public hasNoBrackets(): ValidatorFluent {
        this.add(new Validators.NotContainsTextValidator("<", true, this.fieldName, this.displayName));
        this.add(new Validators.NotContainsTextValidator(">", true, this.fieldName, this.displayName));
        this.add(new Validators.NotContainsTextValidator("\\%3C", true, this.fieldName, this.displayName));
        this.add(new Validators.NotContainsTextValidator("\\%3E", true, this.fieldName, this.displayName));
        return this;
    }
    public asBoolean(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.BooleanValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public containsText(searchText:string | Function, ignoreCase:boolean = false, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.ContainsTextValidator(searchText, ignoreCase, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public doesNotContainText(searchText:string | Function, ignoreCase:boolean = false, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.NotContainsTextValidator(searchText, ignoreCase, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public asInt(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.IntValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public asFloat(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.FloatValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public asGuid(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.GuidValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public asHexColor(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.HexColorValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public asUrl(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.UrlValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public asSecureUrl(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.HttpsUrlValidator(this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public in(items:Array<any>, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.InArrayValidator(items, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public notIn(items:Array<any>, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.NotInArrayValidator(items, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public isNull(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.InArrayValidator([null], this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public isEmptyString(errorMessage?: string): ValidatorFluent {
        this.add(new Validators.InArrayValidator([""], this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public is(value:any, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.InArrayValidator([value], this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public isNot(value:any, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.NotInArrayValidator([value], this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public hasLengthRange(min?:number | Function, max?:number | Function, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.LengthValidator(min, max, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public hasMaxLength(maxLength:number | Function, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.LengthValidator(undefined, maxLength, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public hasMinLength(minLength:number | Function, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.LengthValidator(minLength, undefined, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public hasLength(length:number | Function, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.LengthValidator(length, length, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public min(min:number | Function, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.MinValidator(min, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    public max(max:number | Function, errorMessage?: string): ValidatorFluent {
        this.add(new Validators.MaxValidator(max, this.fieldName, this.displayName, errorMessage));
        return this;
    }
    
}