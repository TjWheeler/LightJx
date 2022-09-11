import { Validator } from "../Validator";
export declare abstract class ValidatorBase implements Validator {
    constructor(fieldName?: string, fieldDisplayName?: string);
    defaultFieldName: string;
    isValid: boolean;
    errorMessage: string;
    fieldName?: string;
    fieldDisplayName?: string;
    expression?: string;
    protected fail(message: string): boolean;
    protected succeed(): boolean;
    abstract validate(input?: any): boolean;
}
