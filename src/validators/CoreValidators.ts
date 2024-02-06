import { Validator } from "../Validator";
import { ValidatorBase } from "./ValidatorBase";
import { DateHelper } from "../helpers/DateHelper";
export class LogOptions {
    enabled: boolean = true;
}
export const logOptions = new LogOptions();
class log {
    public static warn(input: string) {
        if (logOptions.enabled) {
            console.warn(input);
        }
    }
}

export class RequiredValidator extends ValidatorBase {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "RequiredValidator";
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.fail("is required");
        }
        return this.succeed();
    }
}

export class AggregatedValidator extends ValidatorBase {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "AggregatedValidator";
    private validators: Validator[] = [];
    add(validator: Validator) {
        this.validators.push(validator);
    }
    clear() {
        this.validators = [];
        this.isValid = false;
        this.errorMessage = "";
    }
    validate(input?: any): boolean {
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
    constructor(fieldName?: string, fieldDisplayName?: string, errorMessage: string="does not match the required format") {
        super(fieldName, fieldDisplayName);
        this.customMessage = errorMessage;
    }
    name = "RegexValidator";
    customMessage: string;
    expression?: string | RegExp;
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        if (this.isString(input)) {
            return this.test(input) ? this.succeed() : this.fail(this.customMessage);
        } else if (this.isNumber(input)) {
            return this.test(input.toString()) ? this.succeed() : this.fail(this.customMessage);
        }
        else {
            log.warn(`The input for field ${this.fieldName} must be a string or a number to use this Validator`);
        }
        return this.fail("is not a valid string");
    }
}
export class AlphaTextValidator extends RegexValidator {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "AlphaTextValidator";
    override expression?: string = "^([a-zA-Z\\s]{1,})$";
}
export class AlphaNumericTextValidator extends RegexValidator {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "AlphaNumericTextValidator";
    override expression?: string = "^([a-zA-Z0-9]{1,})$";
}
export class AlphaNumericHyphenValidator extends RegexValidator {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "AlphaNumericHyphenValidator";
    override expression?: string = "^([a-zA-Z0-9\\s\\-]{1,})$";
}
export class EmailValidator extends RegexValidator {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "EmailValidator";
    override expression?: string = "^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$";
}

export class GuidValidator extends RegexValidator {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName, "must be a valid GUID");
    }
    name = "GuidValidator";
    override expression?: string = "^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$";
}
export class HexColorValidator extends RegexValidator {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "HexColorValidator";
    override expression?: string = "^\#{1}[A-Fa-f0-9]{3}([A-Fa-f0-9]{3})?$";
}
export class UrlValidator extends RegexValidator {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName,"must be a valid URL");
    }
    name = "UrlValidator";
    override expression?: string = "^((((https?|http?)://)|(mailto:|news:))(%[0-9A-Fa-f]{2}|" +
        "[-()_.!~*';/?:@&=+$,A-Za-z0-9])+)([).!';/?:,]blank:)?$";
}
export class HttpsUrlValidator extends RegexValidator {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName, "must be a valid URL and start with https");
    }
    name = "HttpsUrlValidator";
    override expression?: string = "^(((https)://)(%[0-9A-Fa-f]{2}|" +
        "[-()_.!~*';/?:@&=+$,A-Za-z0-9])+)([).!';/?:,]blank:)?$";
}
export class PhoneNumberValidator extends RegexValidator {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "PhoneNumberValidator";
    override expression?: string | RegExp = /^[\+{0,1}]?([\d*\s?|\-?|\)?|\(?]{3,})$/;
}
/** 
 * Alpha, space, hyphen and aprostrophe 
 * */
export class NameTextValidator extends RegexValidator {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "NameTextValidator";
    override expression?: string = "^([a-zA-Z\\s\\-']{1,})$";
}
export class NumberValidator extends ValidatorBase {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "NumberValidator";
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        return this.isNumber(input) || this.isNumberString(input) ? this.succeed() : this.fail("is not a valid number");
    }
}
export class DateValidator extends ValidatorBase {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "DateValidator";
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        if (typeof (input) === "string") {
            if (!DateHelper.isDateString(input as string)) return this.fail("is not a valid date");
            return this.succeed();
        } else if (!DateHelper.isDateObject(input)) return this.fail("is not a valid date");
        return this.succeed();
    }
}
export class MinDateValidator extends ValidatorBase {
    constructor(minDate: Date | Function, fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
        this.minDate = minDate;
    }
    name = "MinDateValidator";
    private minDate: Date | Function;
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        const minDate = this.getAsDate(this.minDate) as Date;
        if (!this.hasValue(minDate)) return this.fail("is not able to be validated");
        if (typeof (input) === "string") {
            if (!DateHelper.isDateString(input as string)) return this.fail("is not a valid date");
            return DateHelper.isSameOrAfter(DateHelper.parseISODate(input), minDate) ? this.succeed() : this.fail("must be the same or after " + minDate.toDateString());
        } else if (!DateHelper.isDateObject(input)) return this.fail("is not a valid date");
        return DateHelper.isSameOrAfter(input, minDate) ? this.succeed() : this.fail("must be the same or after " + minDate.toDateString());
    }
}
export class MaxDateValidator extends ValidatorBase {
    constructor(maxDate: Date | Function, fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
        this.maxDate = maxDate;
    }
    name = "MaxDateValidator";
    private maxDate: Date | Function;
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        const maxDate = this.getAsDate(this.maxDate) as Date;
        if (!this.hasValue(maxDate)) return this.fail("is not able to be validated");
        if (typeof (input) === "string") {
            if (!DateHelper.isDateString(input as string)) return this.fail("is not a valid date");
            return DateHelper.isSameOrBefore(DateHelper.parseISODate(input), maxDate) ? this.succeed() : this.fail("must be the same or before " + maxDate.toDateString());
        } else if (!DateHelper.isDateObject(input)) return this.fail("is not a valid date");
        return DateHelper.isSameOrBefore(input, maxDate) ? this.succeed() : this.fail("must be the same or before " + maxDate.toDateString());
    }
}
export class BetweenDateValidator extends AggregatedValidator {
    constructor(minDate: Date | Function, maxDate: Date | Function, fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
        this.add(new MinDateValidator(minDate, fieldName, fieldDisplayName));
        this.add(new MaxDateValidator(maxDate, fieldName, fieldDisplayName));
    }
    name = "BetweenDateValidator";
}
export class BooleanValidator extends ValidatorBase {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "BooleanValidator";
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        if (typeof (input) == "string") {
            return (input.toLocaleLowerCase() == "true" || input.toLocaleLowerCase() == "false") ? this.succeed() : this.fail();
        } else if (typeof (input) == "boolean") {
            return this.succeed();
        }
        return this.fail();
    }
}
export class ContainsTextValidator extends ValidatorBase {
    constructor(searchText: string | Function, ignoreCase: boolean = false, fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
        this.searchText = searchText;
        this.ignoreCase = ignoreCase;
    }
    name = "ContainsTextValidator";
    private ignoreCase: boolean;
    private searchText: string | Function;
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        if (typeof (input) === "string") {
            const searchText = this.getAsString(this.searchText);
            if (this.ignoreCase) {
                return input.toLowerCase().includes(searchText.toLowerCase()) ? this.succeed() : this.fail("does not contain the required text");
            }
            return input.includes(searchText) ? this.succeed() : this.fail("does not contain the required text");
        }
        return this.fail("is not a string");
    }
}
export class NotContainsTextValidator extends ValidatorBase {
    constructor(searchText: string | Function, ignoreCase: boolean = false, fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
        this.searchText = searchText;
        this.ignoreCase = ignoreCase;
    }
    name = "NotContainsTextValidator";
    private ignoreCase: boolean;
    private searchText: string | Function;
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        const searchText = this.getAsString(this.searchText);
        if (typeof (input) === "string") {
            if (this.ignoreCase) {
                return input.toLowerCase().includes(searchText.toLowerCase()) ? this.fail("contains invalid text") : this.succeed();
            }
            return input.includes(searchText) ? this.fail("contains invalid text") : this.succeed();
        }
        return this.fail("is not a string");
    }
}
export class FloatValidator extends ValidatorBase {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "FloatValidator";
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        if (this.isNumber(input)) return this.succeed();
        if (this.isString(input)) {
            if (/^[0-9.]{1,}$/.test(input) === false) {
                return this.fail();
            }
            return isNaN(parseFloat(input as string)) ? this.fail("is not a valid floating point number") : this.succeed();
        }
        return this.fail();
    }
}
export class IntValidator extends ValidatorBase {
    constructor(fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
    }
    name = "IntValidator";
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        const errorMessage = "is not a valid whole number";
        if (this.isNumber(input)) return Number.isInteger(input as number) ? this.succeed() : this.fail(errorMessage);
        if (this.isString(input)) {
            return (input as string).indexOf(".") !== -1 || isNaN(parseInt(input as string)) ? this.fail(errorMessage) : Number.isInteger(parseFloat(input as string)) ? this.succeed() : this.fail(errorMessage);
        }
        return this.fail();
    }
}
export class InArrayValidator extends ValidatorBase {
    constructor(items: Array<any>, fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
        this.items = items;
    }
    name = "InArrayValidator";
    private items: Array<any>;
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === input) return this.succeed();
        }
        return this.fail();
    }
}
export class NotInArrayValidator extends ValidatorBase {
    constructor(items: Array<any>, fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
        this.items = items;
    }
    name = "NotInArrayValidator";
    private items: Array<any>;
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === input) return this.fail();
        }
        return this.succeed();
    }
}
export class LengthValidator extends ValidatorBase {
    constructor(min?: number | Function, max?: number | Function, fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
        this.min = min;
        this.max = max;
    }
    name = "LengthValidator";
    private min?: number | Function | undefined;
    private max?: number | Function | undefined;
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        const min = this.getAsNumber(this.min) as number || 0;
        const max = this.getAsNumber(this.max) as number || 0;
        if (this.isString(input)) {
            const length = (input as string).length;
            if (min && length < min) return this.fail(`must have a minimum length of ${min}`);
            if (max && length > max) return this.fail(`must have a maximum length of ${max}`);
            return this.succeed();
        }
        else if (this.isArray(input)) {
            const length = (input as Array<any>).length;
            if (length < min) return this.fail();
            if (max && length > max) return this.fail();
            return this.succeed();
        } else if (this.isNumber(input)) {
            const length = input.toString().length;
            if (min && length < min) return this.fail(`must have a minimum length of ${min}`);
            if (max && length > max) return this.fail(`must have a maximum length of ${max}`);
            return this.succeed();
        }
        return this.fail();
    }
}
export class MinValidator extends ValidatorBase {
    constructor(min: number | Function, fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
        this.min = min;
    }
    name = "MinValidator";
    private min: number | Function;
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        let min = this.getAsNumber(this.min) as number;
        if (!this.hasValue(min)) {
            return this.fail("is not able to be validated");
        }
        if (this.isNumber(input)) {
            return input >= min ? this.succeed() : this.fail(`must be at least ${min}`);
        } else if (this.isIntString(input)) {
            return parseInt(input) >= min ? this.succeed() : this.fail(`must be at least ${min}`);
        } else if (this.isFloatString(input)) {
            return parseFloat(input) >= min ? this.succeed() : this.fail(`must be at least ${min}`);
        }
        return this.fail("is not the correct datatype for MinValidation (did you mean MinLength?)");
    }
}
export class MaxValidator extends ValidatorBase {
    constructor(max: number | Function, fieldName?: string, fieldDisplayName?: string) {
        super(fieldName, fieldDisplayName);
        this.max = max;
    }
    name = "MaxValidator";
    private max: number | Function;
    validate(input?: any): boolean {
        if (!this.hasValue(input)) {
            return this.succeed();
        }
        const max = this.getAsNumber(this.max) as number;
        if (this.isNumber(input)) {
            return input <= max ? this.succeed() : this.fail(`must not be more than ${max}`);
        } else if (this.isIntString(input)) {
            return parseInt(input) <= max ? this.succeed() : this.fail(`must not be more than ${max}`);
        } else if (this.isFloatString(input)) {
            return parseFloat(input) <= max ? this.succeed() : this.fail(`must not be more than ${max}`);
        }
        return this.fail();
    }
}