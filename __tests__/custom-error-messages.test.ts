import { Validate } from '../src/Validate';
import * as v from '../src/validators/CoreValidators';

v.logOptions.enabled = false;

const fieldName = "testField";
const fieldDisplayName = "Test Field";

describe('Custom Error Messages - Core Validators', () => {
    test('RequiredValidator with custom error message', () => {
        const customMessage = "This field cannot be empty";
        const validator = new v.RequiredValidator(fieldName, fieldDisplayName, customMessage);
        
        validator.validate("");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('RequiredValidator without custom error message uses default', () => {
        const validator = new v.RequiredValidator(fieldName, fieldDisplayName);
        
        validator.validate("");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} is required`);
    });

    test('BooleanValidator with custom error message', () => {
        const customMessage = "must be true or false only";
        const validator = new v.BooleanValidator(fieldName, fieldDisplayName, customMessage);
        
        validator.validate("invalid");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('BooleanValidator without custom error message uses default', () => {
        const validator = new v.BooleanValidator(fieldName, fieldDisplayName);
        
        validator.validate("invalid");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} must be a valid boolean (true or false)`);
    });

    test('AlphaTextValidator with custom error message', () => {
        const customMessage = "only alphabetic characters allowed";
        const validator = new v.AlphaTextValidator(fieldName, fieldDisplayName, customMessage);
        
        validator.validate("abc123");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('AlphaTextValidator without custom error message uses default', () => {
        const validator = new v.AlphaTextValidator(fieldName, fieldDisplayName);
        
        validator.validate("abc123");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} must contain only letters and spaces`);
    });

    test('EmailValidator with custom error message', () => {
        const customMessage = "please enter a valid email format";
        const validator = new v.EmailValidator(fieldName, fieldDisplayName, customMessage);
        
        validator.validate("invalid-email");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('PhoneNumberValidator with custom error message', () => {
        const customMessage = "enter a valid phone number format";
        const validator = new v.PhoneNumberValidator(fieldName, fieldDisplayName, customMessage);
        
        validator.validate("abc");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });
});

describe('Custom Error Messages - Number Validators', () => {
    test('NumberValidator with custom error message', () => {
        const customMessage = "must be a numeric value";
        const validator = new v.NumberValidator(fieldName, fieldDisplayName, customMessage);
        
        validator.validate("abc");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('IntValidator with custom error message', () => {
        const customMessage = "must be a whole number";
        const validator = new v.IntValidator(fieldName, fieldDisplayName, customMessage);
        
        validator.validate("12.5");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('FloatValidator with custom error message', () => {
        const customMessage = "must be a decimal number";
        const validator = new v.FloatValidator(fieldName, fieldDisplayName, customMessage);
        
        validator.validate("abc");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('MinValidator with custom error message', () => {
        const customMessage = "value is too small";
        const validator = new v.MinValidator(10, fieldName, fieldDisplayName, customMessage);
        
        validator.validate(5);
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('MaxValidator with custom error message', () => {
        const customMessage = "value is too large";
        const validator = new v.MaxValidator(10, fieldName, fieldDisplayName, customMessage);
        
        validator.validate(15);
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });
});

describe('Custom Error Messages - Array Validators', () => {
    test('InArrayValidator with custom error message', () => {
        const customMessage = "please select a valid option";
        const validator = new v.InArrayValidator(["red", "green", "blue"], fieldName, fieldDisplayName, customMessage);
        
        validator.validate("yellow");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('InArrayValidator without custom error message shows allowed values', () => {
        const validator = new v.InArrayValidator(["red", "green", "blue"], fieldName, fieldDisplayName);
        
        validator.validate("yellow");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} must be one of the allowed values: "red", "green", "blue"`);
    });

    test('NotInArrayValidator with custom error message', () => {
        const customMessage = "this value is not allowed";
        const validator = new v.NotInArrayValidator(["admin", "root"], fieldName, fieldDisplayName, customMessage);
        
        validator.validate("admin");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('NotInArrayValidator without custom error message shows forbidden values', () => {
        const validator = new v.NotInArrayValidator(["admin", "root"], fieldName, fieldDisplayName);
        
        validator.validate("admin");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} cannot be one of these values: "admin", "root"`);
    });
});

describe('Custom Error Messages - Text Validators', () => {
    test('ContainsTextValidator with custom error message', () => {
        const customMessage = "required text is missing";
        const validator = new v.ContainsTextValidator("password", false, fieldName, fieldDisplayName, customMessage);
        
        validator.validate("abc123");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('ContainsTextValidator without custom error message shows required text', () => {
        const validator = new v.ContainsTextValidator("password", false, fieldName, fieldDisplayName);
        
        validator.validate("abc123");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} must contain the text "password"`);
    });

    test('NotContainsTextValidator with custom error message', () => {
        const customMessage = "forbidden text detected";
        const validator = new v.NotContainsTextValidator("spam", false, fieldName, fieldDisplayName, customMessage);
        
        validator.validate("this is spam");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('NotContainsTextValidator without custom error message shows forbidden text', () => {
        const validator = new v.NotContainsTextValidator("spam", false, fieldName, fieldDisplayName);
        
        validator.validate("this is spam");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} must not contain the text "spam"`);
    });
});

describe('Custom Error Messages - Length Validators', () => {
    test('LengthValidator with custom error message', () => {
        const customMessage = "length requirement not met";
        const validator = new v.LengthValidator(5, 10, fieldName, fieldDisplayName, customMessage);
        
        validator.validate("abc");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('LengthValidator without custom error message shows specific requirement', () => {
        const validator = new v.LengthValidator(5, undefined, fieldName, fieldDisplayName);
        
        validator.validate("abc");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} must have a minimum length of 5`);
    });
});

describe('Custom Error Messages - Date Validators', () => {
    test('DateValidator with custom error message', () => {
        const customMessage = "please enter a valid date";
        const validator = new v.DateValidator(fieldName, fieldDisplayName, customMessage);
        
        validator.validate("invalid-date");
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('MinDateValidator with custom error message', () => {
        const customMessage = "date is too early";
        const minDate = new Date('2023-01-01');
        const validator = new v.MinDateValidator(minDate, fieldName, fieldDisplayName, customMessage);
        
        validator.validate(new Date('2022-12-31'));
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });

    test('MaxDateValidator with custom error message', () => {
        const customMessage = "date is too late";
        const maxDate = new Date('2023-12-31');
        const validator = new v.MaxDateValidator(maxDate, fieldName, fieldDisplayName, customMessage);
        
        validator.validate(new Date('2024-01-01'));
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage).toBe(`${fieldDisplayName} ${customMessage}`);
    });
});