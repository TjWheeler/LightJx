export interface Validator {
    fieldName?: string;
    fieldDisplayName?: string;
    input?: any;
    isValid: boolean;
    errorMessage: string;
    validate(input?: any): boolean;
}
