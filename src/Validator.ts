export interface Validator {
    fieldName?: string;
    fieldDisplayName?: string;
    input?: any;
    isValid: boolean;
    errorMessage: string;
    reset():void;
    validate(input?:any): boolean;
}