import { Validator } from "../Validator";


export abstract class ValidatorBase implements Validator {
    constructor(fieldName?:string, fieldDisplayName?:string) {
        this.fieldName = fieldName;
        this.fieldDisplayName = fieldDisplayName;
    }
    defaultFieldName: string = "The Field";
   // input: any;
    isValid: boolean = false;
    errorMessage: string = "";
    fieldName?: string;
    fieldDisplayName?: string;
    expression?: string = undefined;
    protected fail(message:string) : boolean {
        this.isValid = false;
        this.errorMessage = `${this.fieldDisplayName || this.fieldName} ${message}`;
        return false;
    }
    protected succeed() : boolean {
        this.isValid = true;
        this.errorMessage = "";
        return true;
    }
    // protected beforeValidate(input?:any, fieldName?:string, fieldDisplayName?:string) {
    //     //this.input = input;
    //     this.fieldName = fieldName;
    //     this.fieldDisplayName = fieldDisplayName;
    // }
    abstract validate(input?:any): boolean;
}
