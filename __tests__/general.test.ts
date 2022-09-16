import { Validate } from '../src/Validate';
import { ValidatorFluent } from '../src/ValidatorFluent';
import { RequiredValidator } from '../src/validators/CoreValidators';
import { logOptions } from '../src/validators/CoreValidators';
import moment from 'moment';
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
});