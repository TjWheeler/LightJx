export declare class Validate {
    static field(name?: string, displayName?: string): ValidatorFluent;
}
export declare class ValidatorFluent {
    fieldName?: string;
    fieldDisplayName?: string;
    input: any;
    isValid: boolean;
    errorMessage: string;
    errorMessages: string[];
    private _validators;
    private add;
    required(): ValidatorFluent;
    validate(input: any): boolean;
}
