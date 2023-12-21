import { Validate } from '../src/Validate';
import { ValidatorFluent } from '../src/ValidatorFluent';
import { DateHelper } from '../src/helpers/DateHelper';
import { RequiredValidator } from '../src/validators/CoreValidators';
import { logOptions } from '../src/validators/CoreValidators';
logOptions.enabled = false;
const fieldName = "MyField";
const displayName = "My Field";
const validate = (): ValidatorFluent => {
    return Validate.field(fieldName, displayName);
};

describe('general implementation', () => {
    test('setting custom field name and display name', () => {
        let validator = validate().required().hasLengthRange(0, 5).asAlphaNumericHyphenText();
        expect(validator.fieldName).toBe("MyField");
        expect(validator.validate("123456").errorMessage.indexOf("My Field") > -1).toBe(true);
        validator = Validate.define().isDateOnOrAfter(new Date());
        validator.setName("MyTestField","My Test Field");
        validator.validate(DateHelper.addHours(new Date(), -48));
        expect(validator.isValid).toBe(false);
        expect(validator.errorMessage.indexOf("My Test Field") > -1).toBe(true);
    });
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