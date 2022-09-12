import { Validator} from '../src/Validator';
import * as v from '../src/validators/CoreValidators';

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
const testEmptySucceeds = (getValidator: ()=> Validator) => {
  //Most validators should succeed if not input (except the required validator)
  testForSuccess(getValidator(), null);
  testForSuccess(getValidator(), "");
  testForSuccess(getValidator(), undefined);
};
describe('required validator', ()=>{
  let getValidator = () => new v.RequiredValidator();
  test('success cases', () => {
    testForSuccess(getValidator(), false);
    testForSuccess(getValidator(), "1");
    testForSuccess(getValidator(), 1);
    testForSuccess(getValidator(), true);
    testForSuccess(getValidator(), {});
    testForSuccess(getValidator(), 1.1);
  });
  test('failure cases', () => {
    testForFailure(getValidator(), null);
    testForFailure(getValidator(), '');
    testForFailure(getValidator(), undefined);
  });
});
  
describe('AlphaText validator', ()=>{
  let getValidator = () => new v.AlphaTextValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testForSuccess(getValidator(), "abc");
    testForSuccess(getValidator(), "abcABC");
    testForSuccess(getValidator(), "aBc");
  });
  test(' cases', () => {
    testForFailure(getValidator(), "abc1" );
    testForFailure(getValidator(), "123" );
    testForFailure(getValidator(), "ab-c" );
    testForFailure(getValidator(), "abc@$" );
  });
});
describe('AlphaText validator', ()=>{
  let getValidator = () => new v.AlphaTextValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testForSuccess(getValidator(), "abc");
    testForSuccess(getValidator(), "abcABC");
    testForSuccess(getValidator(), "abc ABC");
    testForSuccess(getValidator(), "aBc");
  });
  test(' cases', () => {
    testForFailure(getValidator(), "abc1" );
    testForFailure(getValidator(), "123" );
    testForFailure(getValidator(), "ab-c" );
    testForFailure(getValidator(), "abc@$" );
  });
});
describe('AlphaNumericHyphen validator', ()=>{
  let getValidator = () => new v.AlphaNumericHyphenValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testForSuccess(getValidator(), "abc");
    testForSuccess(getValidator(), "abcABC");
    testForSuccess(getValidator(), "aBc123");
    testForSuccess(getValidator(), "aBC12 3DE-f099");
    testForSuccess(getValidator(), "1");
    testForSuccess(getValidator(), 1);
  });
  test(' cases', () => {
    testForFailure(getValidator(), "abc1!" );
    testForFailure(getValidator(), "123$%" );
    testForFailure(getValidator(), "\\abc" );
    testForFailure(getValidator(), "abc@$" );
  });
});

/*  Template
describe(' validator', ()=>{
  let getValidator = () => new RequiredValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testForSuccess(getValidator(), );
  });
  test(' cases', () => {
    testForFailure(getValidator(), );
  });
});
*/