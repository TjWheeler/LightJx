import { ValidatorBase } from "./ValidatorBase";
export declare class RequiredValidator extends ValidatorBase {
    constructor(fieldName?: string, fieldDisplayName?: string);
    validate(input?: any): boolean;
}
