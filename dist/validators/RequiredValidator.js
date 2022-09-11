import { ValidatorBase } from "./ValidatorBase";
export class RequiredValidator extends ValidatorBase {
    constructor(fieldName, fieldDisplayName) {
        super(fieldName, fieldDisplayName);
    }
    validate(input) {
        if (input == null || input == "" || typeof (input) === typeof (undefined)) {
            return this.fail("is required");
        }
        return this.succeed();
    }
}
//# sourceMappingURL=RequiredValidator.js.map