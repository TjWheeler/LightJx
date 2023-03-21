import { Validate } from '../src/Validate';
import { ValidatorFluent } from '../src/ValidatorFluent';
import { RequiredValidator } from '../src/validators/CoreValidators';
import { logOptions } from '../src/validators/CoreValidators';
logOptions.enabled = false;
const fieldName = "MyField";
const displayName = "My Field";
const validate = (): ValidatorFluent => {
    return Validate.field(fieldName, displayName);
};

describe('general implementation', () => {
    test('required and length', () => {
        let validator = validate().required().hasLengthRange(0, 5).asAlphaNumericHyphenText();
        expect(validator.validate("1234").isValid).toBe(true);
        expect(validator.validate("12345").isValid).toBe(true);
        expect(validator.validate("123456").isValid).toBe(false);
    });
    test('negative numbers', () => {
        let validator = validate().required().asNumber();
        expect(validator.validate("1234").isValid).toBe(true);
        expect(validator.validate("-1234").isValid).toBe(true);
    });
    test('min and negative numbers', () => {
        let validator = validate().required().asNumber().min(()=>"-100");
        expect(validator.validate("1234").isValid).toBe(true);
        expect(validator.validate("-1234").isValid).toBe(false);
        expect(validator.validate("-100").isValid).toBe(true);
    });
    test('max and negative numbers', () => {
        let validator = validate().required().asNumber().max(()=>"-100");
        expect(validator.validate("1234").isValid).toBe(false);
        expect(validator.validate("-1234").isValid).toBe(true);
        expect(validator.validate("-100").isValid).toBe(true);
    });
    test('numbers', () => {
        let validator = validate().required().asNumber();
        expect(validator.validate("1").isValid).toBe(true);
    });
    test('xss', () => {
        let validator = validate().required().hasNoBrackets();
        expect(validator.validate("This is a good string! With 123-456, and '.").isValid).toBe(true);
        expect(validator.validate("This is a bad string - <img src=''/>").isValid).toBe(false);
    });
});