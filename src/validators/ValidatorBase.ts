import { DateHelper } from "../helpers/DateHelper";
import { Validator } from "../Validator";


export abstract class ValidatorBase implements Validator {
    constructor(fieldName?: string, fieldDisplayName?: string, customErrorMessage?: string) {
        this.fieldName = fieldName;
        this.fieldDisplayName = fieldDisplayName;
        this.customErrorMessage = customErrorMessage;
    }
    public abstract name:string;
    defaultFieldName: string = "The Field";
    isValid: boolean = false;
    errorMessage: string = "";
    fieldName?: string;
    fieldDisplayName?: string;
    expression?: string | RegExp = undefined;
    protected customErrorMessage?: string;
    public reset() {
        this.errorMessage = "";
        this.isValid = false;
    }
    abstract validate(input?: any): boolean;
    protected hasValue(input: any): boolean {
        return !(input === null || input === "" || typeof (input) === typeof (undefined) || (typeof (input) === "number" && isNaN(input)));
    }
    protected fail(message: string = "is not valid"): boolean {
        this.isValid = false;
        if (this.customErrorMessage) {
            // Use custom error message as-is, without prefixing field name
            this.errorMessage = this.customErrorMessage;
        } else {
            // Use default behavior with field name prefix
            this.errorMessage = `${this.fieldDisplayName || this.fieldName || this.defaultFieldName} ${message}`;
        }
        return false;
    }
    protected succeed(): boolean {
        this.isValid = true;
        this.errorMessage = "";
        return true;
    }
    protected test(input: string): boolean {
        let regEx = new RegExp(this.expression as string);
        return regEx.test(input);
    }
    protected hasMatch(input: string): boolean {
        let regEx = new RegExp(this.expression as string);
        var result = input.match(regEx);
        if (result) return result.length > 0;
        return false;
    }
    protected matchCount(input: string): number {
        let regEx = new RegExp(this.expression as string);
        var result = input.match(regEx);
        if (result) return result.length;
        return 0;
    }
    protected isString(input: any): boolean {
        return typeof (input) === "string";
    }
    protected isNumber(input: any): boolean {
        return typeof (input) === "number";
    }
    protected isNumberString(input: any): boolean {
        return this.isString(input) && !isNaN(input);
    }

    protected isIntString(input: any): boolean {
        if (this.isString(input)) {
            let regEx = new RegExp(/^(([\-]{0,1})[0-9]{1,})$/);
            return regEx.test(input);
        }
        return false;
    }
    protected isFloatString(input: any): boolean {
        if (this.isString(input)) {
            return !isNaN(parseFloat(input as string));
        }
        return false;
    }
    protected isArray(input: any): boolean {
        return Array.isArray(input);
    }
    protected getAsNumber(input: string | number | Function | undefined): number | undefined {
        let value = input instanceof Function ? input() : input;
        if (this.isIntString(value)) {
            return parseInt(value);
        } else if (this.isNumber(value)) {
            return value;
        } else if (this.isFloatString(value)) {
            return parseFloat(value);
        }
        return undefined;
    }
    protected getAsString(input: string | number | Function): string {
        let value = input instanceof Function ? input() : input;
        if (this.isNumber(value)) {
            return value.toString();
        } else if (this.isString(value)) {
            return value;
        }
        return "";
    }
    protected getAsDate(input: string | Date | Function): Date | undefined {
        let value = input instanceof Function ? input() : input;
        if (DateHelper.isDateObject(value)) {
            return value;
        } else if (DateHelper.isDateString(value)) {
            return DateHelper.parseISODate(value);
        }
        return undefined;
    }
}
