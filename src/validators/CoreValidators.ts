import { Validator } from "../Validator";
import { ValidatorBase } from "./ValidatorBase";
import moment from 'moment';

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

export class RegexValidator extends ValidatorBase {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    expression?: string;
    validate(input?:any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        if(this.isString(input)) {
            return this.test(input) ? this.succeed() : this.fail("does not match the required format");
        } else if(this.isNumber(input)) {
            return this.test(input.toString()) ? this.succeed() : this.fail("does not match the required format");
        }
        else {
            console.warn(`The input for field ${this.fieldName} must be a string or a number to use this Validator`);
        }
        return this.fail("is not a valid string");
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
export class EmailValidator extends RegexValidator {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    override expression?: string = "^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$";
}
export class GuidValidator extends RegexValidator {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    override expression?: string = "^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$";
}
export class HexColorValidator extends RegexValidator {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    override expression?: string = "^\#{1}[A-Fa-f0-9]{3}([A-Fa-f0-9]{3})?$";
}
export class MinDateValidator extends ValidatorBase {
    constructor(minDate:Date, fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
        this.minDate = minDate;
    }
    private minDate:Date;
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        if(typeof(input) === "string") {
            if(!moment(input as string).isValid()) return this.fail("is not a valid date");
        } else if(!moment.isDate(input)) return this.fail("is not a valid date");
        return moment(input).isSameOrAfter(moment(this.minDate)) ? this.succeed() : this.fail("must be the same or after the required date");
    }
}
export class MaxDateValidator extends ValidatorBase {
    constructor(maxDate:Date, fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
        this.maxDate = maxDate;
    }
    private maxDate:Date;
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        if(typeof(input) === "string") {
            if(!moment(input as string).isValid()) return this.fail("is not a valid date");
        } else if(!moment.isDate(input)) return this.fail("is not a valid date");
        return moment(input).isSameOrBefore(moment(this.maxDate)) ? this.succeed() : this.fail("must be the same or before the required date");
    }
}
export class BetweenDateValidator extends AggregatedValidator {
    constructor(minDate:Date, maxDate:Date, fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
        this.add(new MinDateValidator(minDate, fieldName, fieldDisplayName));
        this.add(new MaxDateValidator(maxDate, fieldName, fieldDisplayName));
    }
}
export class BooleanValidator extends ValidatorBase {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        if(typeof(input) == "string") {
            return (input.toLocaleLowerCase() == "true" || input.toLocaleLowerCase() == "false");
        } else if(typeof(input) == "boolean") {
            return true;
        } 
        return false;
    }
}

export class ContainsTextValidator extends ValidatorBase {
    constructor(searchText:string, ignoreCase:boolean = false, fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
        this.searchText = searchText;
        this.ignoreCase = ignoreCase;
    }
    private ignoreCase:boolean;
    private searchText:string;
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        if(typeof(input) === "string") {
            if(this.ignoreCase) {
                return input.toLowerCase().includes(this.searchText.toLowerCase()) ? this.succeed() : this.fail("does not contain the required text");
            }
            return input.includes(this.searchText) ? this.succeed() : this.fail("does not contain the required text");
        } 
        return this.fail("is not a string");
    }
}
export class FloatValidator extends ValidatorBase {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        if(this.isNumber(input)) return this.succeed();
        if(this.isString(input)) {
            return isNaN(parseFloat(input as string)) ? this.fail("is not a valid number") : this.succeed();
        }
        return this.fail();
    }
}
export class IntValidator extends ValidatorBase {
    constructor(fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
    }
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        const errorMessage = "is not a valid number";
        if(this.isNumber(input)) return Number.isInteger(input as number) ? this.succeed() : this.fail(errorMessage);
        if(this.isString(input)) {
            return (input as string).indexOf(".") !== -1 || isNaN(parseInt(input as string)) ? this.fail(errorMessage) : Number.isInteger(parseFloat(input as string)) ? this.succeed() : this.fail(errorMessage);
        }
        return this.fail();
    }
}
export class InArrayValidator extends ValidatorBase {
    constructor(items:Array<any>, fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
        this.items = items;
    }
    private items:Array<any>;
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i] === input) return this.succeed();
        }
        return this.fail();
    }
}
export class NotInArrayValidator extends ValidatorBase {
    constructor(items:Array<any>, fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
        this.items = items;
    }
    private items:Array<any>;
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i] === input) return this.fail();
        }
        return this.succeed();
    }
}
export class LengthValidator extends ValidatorBase {
    constructor(min?:number, max?:number, fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
        this.min = min;
        this.max = max;
    }
    private min?:number;
    private max?:number;
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        const min = this.min || 0;
        if(this.isString(input)) {
            const length = (input as string).length;
            if(length < min) return this.fail();
            if(this.max && length > this.max) return this.fail();
            return this.succeed();
        }
        else if(this.isArray(input)) {
            const length = (input as Array<any>).length;
            if(length < min) return this.fail();
            if(this.max && length > this.max) return this.fail();
            return this.succeed();
        }
        return this.fail();
    }
}
export class MinValidator extends ValidatorBase {
    constructor(min:number, fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
        this.min = min;
    }
    private min:number;
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        const errorMessage = "is not a valid number";
        if(this.isNumber(input))  {
            return input >= this.min ? this.succeed() : this.fail();
        } else if (this.isString(input)) {
            if(!isNaN(parseFloat(input as string))) {
                return parseFloat(input) >= this.min ? this.succeed() : this.fail();
            }
        }
        return this.fail();
    }
}
export class MaxValidator extends ValidatorBase {
    constructor(max:number, fieldName?:string, fieldDisplayName?:string)
    {
        super(fieldName, fieldDisplayName);
        this.max = max;
    }
    private max:number;
    validate(input?: any): boolean {
        if(!this.hasValue(input)) {
            return this.succeed();
        }
        const errorMessage = "is not a valid number";
        if(this.isNumber(input))  {
            return input <= this.max ? this.succeed() : this.fail();
        } else if (this.isString(input)) {
            if(!isNaN(parseFloat(input as string))) {
                return parseFloat(input) <= this.max ? this.succeed() : this.fail();
            }
        }
        return this.fail();
    }
}