import { Validate } from '../src/Validate';

describe('Fluent API Custom Error Messages', () => {
    const fieldName = "testField";
    const displayName = "Test Field";

    describe('Core Validators with Custom Messages', () => {
        test('required() with custom error message', () => {
            const customMessage = "This field is mandatory";
            const result = Validate.field(fieldName, displayName)
                .required(customMessage)
                .validate("");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asBoolean() with custom error message', () => {
            const customMessage = "must be true or false";
            const result = Validate.field(fieldName, displayName)
                .asBoolean(customMessage)
                .validate("invalid");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asEmail() with custom error message', () => {
            const customMessage = "enter a valid email address";
            const result = Validate.field(fieldName, displayName)
                .asEmail(customMessage)
                .validate("invalid-email");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asPhoneNumber() with custom error message', () => {
            const customMessage = "phone number format is incorrect";
            const result = Validate.field(fieldName, displayName)
                .asPhoneNumber(customMessage)
                .validate("abc");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asAlphaText() with custom error message', () => {
            const customMessage = "only letters and spaces allowed";
            const result = Validate.field(fieldName, displayName)
                .asAlphaText(customMessage)
                .validate("abc123");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asAlphaNumericText() with custom error message', () => {
            const customMessage = "only letters and numbers allowed";
            const result = Validate.field(fieldName, displayName)
                .asAlphaNumericText(customMessage)
                .validate("abc-123");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asAlphaNumericHyphenText() with custom error message', () => {
            const customMessage = "only letters, numbers, spaces and hyphens allowed";
            const result = Validate.field(fieldName, displayName)
                .asAlphaNumericHyphenText(customMessage)
                .validate("abc@123");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asName() with custom error message', () => {
            const customMessage = "enter a valid name";
            const result = Validate.field(fieldName, displayName)
                .asName(customMessage)
                .validate("Name123");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });
    });

    describe('Number Validators with Custom Messages', () => {
        test('asNumber() with custom error message', () => {
            const customMessage = "must be a numeric value";
            const result = Validate.field(fieldName, displayName)
                .asNumber(customMessage)
                .validate("abc");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asInt() with custom error message', () => {
            const customMessage = "must be a whole number";
            const result = Validate.field(fieldName, displayName)
                .asInt(customMessage)
                .validate("12.5");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asFloat() with custom error message', () => {
            const customMessage = "must be a decimal number";
            const result = Validate.field(fieldName, displayName)
                .asFloat(customMessage)
                .validate("abc");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('min() with custom error message', () => {
            const customMessage = "value is below minimum";
            const result = Validate.field(fieldName, displayName)
                .min(10, customMessage)
                .validate(5);

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('max() with custom error message', () => {
            const customMessage = "value exceeds maximum";
            const result = Validate.field(fieldName, displayName)
                .max(10, customMessage)
                .validate(15);

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });
    });

    describe('Value Validators with Custom Messages', () => {
        test('is() with custom error message', () => {
            const customMessage = "must match expected value";
            const result = Validate.field(fieldName, displayName)
                .is("expected", customMessage)
                .validate("actual");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('isNot() with custom error message', () => {
            const customMessage = "this value is not allowed";
            const result = Validate.field(fieldName, displayName)
                .isNot("forbidden", customMessage)
                .validate("forbidden");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('in() with custom error message', () => {
            const customMessage = "please select a valid option";
            const result = Validate.field(fieldName, displayName)
                .in(["red", "green", "blue"], customMessage)
                .validate("yellow");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('notIn() with custom error message', () => {
            const customMessage = "this option is not allowed";
            const result = Validate.field(fieldName, displayName)
                .notIn(["admin", "root"], customMessage)
                .validate("admin");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('isNull() with custom error message', () => {
            const customMessage = "must be null";
            const result = Validate.field(fieldName, displayName)
                .isNull(customMessage)
                .validate("not null");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('isEmptyString() with custom error message', () => {
            const customMessage = "must be empty";
            const result = Validate.field(fieldName, displayName)
                .isEmptyString(customMessage)
                .validate("not empty");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });
    });

    describe('Length Validators with Custom Messages', () => {
        test('hasMinLength() with custom error message', () => {
            const customMessage = "too short";
            const result = Validate.field(fieldName, displayName)
                .hasMinLength(5, customMessage)
                .validate("abc");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('hasMaxLength() with custom error message', () => {
            const customMessage = "too long";
            const result = Validate.field(fieldName, displayName)
                .hasMaxLength(5, customMessage)
                .validate("abcdefgh");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('hasLength() with custom error message', () => {
            const customMessage = "wrong length";
            const result = Validate.field(fieldName, displayName)
                .hasLength(5, customMessage)
                .validate("abc");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('hasLengthRange() with custom error message', () => {
            const customMessage = "length out of range";
            const result = Validate.field(fieldName, displayName)
                .hasLengthRange(5, 10, customMessage)
                .validate("abc");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });
    });

    describe('Text Content Validators with Custom Messages', () => {
        test('containsText() with custom error message', () => {
            const customMessage = "required text missing";
            const result = Validate.field(fieldName, displayName)
                .containsText("password", false, customMessage)
                .validate("abc123");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('doesNotContainText() with custom error message', () => {
            const customMessage = "forbidden text found";
            const result = Validate.field(fieldName, displayName)
                .doesNotContainText("spam", false, customMessage)
                .validate("this is spam");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });
    });

    describe('Date Validators with Custom Messages', () => {
        test('asDate() with custom error message', () => {
            const customMessage = "invalid date format";
            const result = Validate.field(fieldName, displayName)
                .asDate(customMessage)
                .validate("invalid-date");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('isDateOnOrAfter() with custom error message', () => {
            const customMessage = "date too early";
            const minDate = new Date('2023-01-01');
            const result = Validate.field(fieldName, displayName)
                .isDateOnOrAfter(minDate, customMessage)
                .validate(new Date('2022-12-31'));

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('isDateOnOrBefore() with custom error message', () => {
            const customMessage = "date too late";
            const maxDate = new Date('2023-12-31');
            const result = Validate.field(fieldName, displayName)
                .isDateOnOrBefore(maxDate, customMessage)
                .validate(new Date('2024-01-01'));

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('isDateBetween() with custom error message', () => {
            const customMessage = "date out of range";
            const minDate = new Date('2023-01-01');
            const maxDate = new Date('2023-12-31');
            const result = Validate.field(fieldName, displayName)
                .isDateBetween(minDate, maxDate, customMessage)
                .validate(new Date('2024-01-01'));

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });
    });

    describe('Format Validators with Custom Messages', () => {
        test('asGuid() with custom error message', () => {
            const customMessage = "invalid GUID format";
            const result = Validate.field(fieldName, displayName)
                .asGuid(customMessage)
                .validate("invalid-guid");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asHexColor() with custom error message', () => {
            const customMessage = "invalid color code";
            const result = Validate.field(fieldName, displayName)
                .asHexColor(customMessage)
                .validate("invalid-color");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asUrl() with custom error message', () => {
            const customMessage = "invalid URL format";
            const result = Validate.field(fieldName, displayName)
                .asUrl(customMessage)
                .validate("invalid-url");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });

        test('asSecureUrl() with custom error message', () => {
            const customMessage = "must be a secure HTTPS URL";
            const result = Validate.field(fieldName, displayName)
                .asSecureUrl(customMessage)
                .validate("http://example.com");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} ${customMessage}`);
        });
    });

    describe('Chained Validators with Custom Messages', () => {
        test('multiple validators with custom messages', () => {
            const result = Validate.field(fieldName, displayName)
                .required("is mandatory")
                .asEmail("must be valid email")
                .validate("");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} is mandatory`);
        });

        test('multiple validators - first passes, second fails with custom message', () => {
            const result = Validate.field(fieldName, displayName)
                .required("is mandatory")
                .asEmail("must be valid email")
                .validate("invalid-email");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} must be valid email`);
        });

        test('mix of custom and default error messages', () => {
            const result = Validate.field(fieldName, displayName)
                .required("is mandatory")
                .asAlphaText() // uses default message
                .hasMinLength(10, "too short")
                .validate("abc123");

            expect(result.isValid).toBe(false); 
            // Should show both error messages since both validators fail
            expect(result.errorMessage).toBe(`${displayName} must contain only letters and spaces. ${displayName} too short`);
        });
    });

    describe('Backward Compatibility - No Custom Messages', () => {
        test('all methods work without custom error message parameter', () => {
            const result = Validate.field(fieldName, displayName)
                .required()
                .asEmail()
                .hasMinLength(5)
                .validate("");

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe(`${displayName} is required`);
        });

        test('mixed usage - some with custom messages, some without', () => {
            const result = Validate.field(fieldName, displayName)
                .required("this field is required")
                .asEmail() // no custom message
                .validate("invalid");

            expect(result.isValid).toBe(false);
            // The required validator passes because "invalid" has content, so only email validator fails
            expect(result.errorMessage).toBe(`${displayName} must be a valid email address`);
        });
    });
});