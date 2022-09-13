import { Validator } from "../Validator";


export abstract class ValidatorBase implements Validator {
    constructor(fieldName?:string, fieldDisplayName?:string) {
        this.fieldName = fieldName;
        this.fieldDisplayName = fieldDisplayName;
    }
    defaultFieldName: string = "The Field";
    isValid: boolean = false;
    errorMessage: string = "";
    fieldName?: string;
    fieldDisplayName?: string;
    expression?: string | RegExp = undefined;
    abstract validate(input?:any): boolean;
    protected hasValue(input:any) : boolean {
        return !(input === null || input === "" || typeof(input) === typeof(undefined));
    }
    protected fail(message:string = "is not valid") : boolean {
        this.isValid = false;
        this.errorMessage = `${this.fieldDisplayName || this.fieldName} ${message}`;
        return false;
    }
    protected succeed() : boolean {
        this.isValid = true;
        this.errorMessage = "";
        return true;
    }
    protected test(input:string) : boolean {
        let regEx = new RegExp(this.expression as string);
        return regEx.test(input);
    }
    protected hasMatch(input:string) : boolean {
        let regEx = new RegExp(this.expression as string);
        var result = input.match(regEx);
        if(result) return result.length > 0;
        return false;
    }
    protected matchCount(input:string) : number {
        let regEx = new RegExp(this.expression as string);
        var result = input.match(regEx);
        if(result) return result.length;
        return 0;
    }
    protected isString(input:any) : boolean {
        return typeof(input) === "string";
    }
    protected isNumber(input:any) : boolean {
        return typeof(input) === "number";
    }
    protected isArray(input:any) : boolean {
        return Array.isArray(input);
    }
}
