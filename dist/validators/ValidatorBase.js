export class ValidatorBase {
    constructor(fieldName, fieldDisplayName) {
        this.defaultFieldName = "The Field";
        this.isValid = false;
        this.errorMessage = "";
        this.expression = undefined;
        this.fieldName = fieldName;
        this.fieldDisplayName = fieldDisplayName;
    }
    fail(message) {
        this.isValid = false;
        this.errorMessage = `${this.fieldDisplayName || this.fieldName} ${message}`;
        return false;
    }
    succeed() {
        this.isValid = true;
        this.errorMessage = "";
        return true;
    }
}
//# sourceMappingURL=ValidatorBase.js.map