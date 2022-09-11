import { Validator} from '../src/Validator';
import { RequiredValidator } from '../src/validators/RequiredValidator';

const fieldName = "abcfield";
const fieldDisplayName = "ABC Field";
const applyFieldNames = (validator:Validator) => {
  validator.fieldName = fieldName;
  validator.fieldDisplayName = fieldDisplayName;
};
const testForSuccess = (validator:Validator, input:any) => {
  applyFieldNames(validator);
  expect(validator.validate(input)).toBe(true);
};
const testForFailure = (validator:Validator, input:any) => {
  applyFieldNames(validator);
  expect(validator.validate(input)).toBe(false);
};
describe('required validator', ()=>{
  test('success cases', () => {
    testForSuccess(new RequiredValidator(), false);
    testForSuccess(new RequiredValidator(), "1");
    testForSuccess(new RequiredValidator(), 1);
    testForSuccess(new RequiredValidator(), true);
    testForSuccess(new RequiredValidator(), {});
    testForSuccess(new RequiredValidator(), 1.1);
  });
  test('failure cases', () => {
    testForFailure(new RequiredValidator(), null);
    testForFailure(new RequiredValidator(), '');
    testForFailure(new RequiredValidator(), undefined);
  });
});
  

