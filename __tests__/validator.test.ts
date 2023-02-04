import { DateHelper } from '../src/helpers/DateHelper';
import { Validator} from '../src/Validator';
import * as v from '../src/validators/CoreValidators';
v.logOptions.enabled = false;
const fieldName = "abcfield";
const fieldDisplayName = "ABC Field";
const applyFieldNames = (validator:Validator) => {
  validator.fieldName = fieldName;
  validator.fieldDisplayName = fieldDisplayName;
};
const testAllForSuccess = (validator:Validator, input:Array<any>) => {
  applyFieldNames(validator);
  input.forEach((item:any)=>{
    var result = validator.validate(item);
    if(!result) {
      debugger;
      console.warn("Failed on input", item);
    }
    expect(result).toBe(true);
  });
};
const testForFailure = (validator:Validator, input:any) => {
  applyFieldNames(validator);
  expect(validator.validate(input)).toBe(false);
};
const testAllForFailure = (validator:Validator, input:Array<any>) => {
  applyFieldNames(validator);
  input.forEach((item:any)=>{
    var result = validator.validate(item);
    if(result) {
      debugger;
      console.warn("Failed on input", item);
    }
    expect(result).toBe(false);
  });
};
const testEmptySucceeds = (getValidator: ()=> Validator) => {
  //Most validators should succeed if not input (except the required validator)
  testAllForSuccess(getValidator(), [null, "", undefined]);
};
describe('required validator', ()=>{
  let getValidator = () => new v.RequiredValidator();
  test('success cases', () => {
    testAllForSuccess(getValidator(), [false, "1",1,true,{},1.1]);
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
    testAllForSuccess(getValidator(), ["abc","abcABC","aBc"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["abc1","123",123,"ab-c","abc@$"]);
  });
});
describe('AlphaNumericText validator', ()=>{
  let getValidator = () => new v.AlphaNumericTextValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["abc","abcABC","aBc1234567890",123]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["abc-","@123","ab-c"]);
  });
});
describe('AlphaText validator', ()=>{
  let getValidator = () => new v.AlphaTextValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["abc","abcABC","abc ABC","aBc"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["abc1","123","ab-c","abc@$"] );
  });
});
describe('AlphaNumericHyphen validator', ()=>{
  let getValidator = () => new v.AlphaNumericHyphenValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["1", 1, "abc","abcABC","abc ABC","aBc","aBc123","aBC12 3DE-f099"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["abc1!","123$%","\\abc","abc@$"] );
  });
});
describe('Date validator', ()=>{
  let getValidator = () => new v.DateValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), [ new Date().toISOString(), new Date(), DateHelper.addHours(new Date(), 24)]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["baddata", 1234, {}, []]);
  });
});
describe('MinDate validator', ()=>{
  const minDate = DateHelper.subtractSeconds(new Date(), 1);
  let getValidator = () => new v.MinDateValidator(minDate);
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), [ minDate.toISOString(), minDate, new Date(),DateHelper.addHours(new Date(), 24)]);
    testAllForSuccess(new v.MinDateValidator(() => minDate), [ minDate.toISOString(), minDate, new Date(),DateHelper.addHours(new Date(), 24)]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["baddata", DateHelper.subtractSeconds(minDate,1).toISOString(), DateHelper.subtractSeconds(minDate,1), DateHelper.subtractHours(new Date(), 24)]);
  });
});
describe('MaxDate validator', ()=>{
  const maxDate = DateHelper.addSeconds(new Date(), 10);
  let getValidator = () => new v.MaxDateValidator(maxDate);
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), [maxDate.toISOString(), maxDate,new Date(), DateHelper.subtractHours(new Date(),24)]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["baddata", DateHelper.addSeconds(maxDate,1).toISOString(), DateHelper.addSeconds(maxDate,1), DateHelper.addHours(new Date(), 24)]);
  });
});
describe('ContainsText validator', ()=>{
  const searchText = "abc@#$";
  let getCaseSensitiveValidator = () => new v.ContainsTextValidator(searchText, false);
  let getCaseInSensitiveValidator = () => new v.ContainsTextValidator(searchText, true);
  test('success cases', () => {
    testEmptySucceeds(getCaseSensitiveValidator);
    testEmptySucceeds(getCaseInSensitiveValidator);
    testAllForSuccess(getCaseInSensitiveValidator(), [`asdfa adsf as${searchText}dfsdf`,searchText,`${searchText}-asdfa`,`asdf-${searchText}`]);
    testAllForSuccess(getCaseSensitiveValidator(), [`asdfa adsf as${searchText}dfsdf`,searchText,`${searchText}-asdfa`,`asdf-${searchText}`]);
  });
  test('failure cases', () => {
    testAllForFailure(getCaseInSensitiveValidator(), [`asdfa adsf asdfsdf`,searchText.substring(1),`-asdfa`,`asdf-`]);
    testAllForFailure(getCaseSensitiveValidator(), [`asdfa adsf as${searchText.toUpperCase()}dfsdf`,searchText.substring(1),`${searchText.toUpperCase()}-asdfa`,`asdf-${searchText.toUpperCase()}`]);
  });
});
describe('NotContainsText validator', ()=>{
  const searchText = "abc@#$";
  let getCaseSensitiveValidator = () => new v.NotContainsTextValidator(searchText, false);
  let getCaseInSensitiveValidator = () => new v.NotContainsTextValidator(searchText, true);
  test('success cases', () => {
    testEmptySucceeds(getCaseSensitiveValidator);
    testEmptySucceeds(getCaseInSensitiveValidator);
    testAllForSuccess(getCaseInSensitiveValidator(), [`asdfa adsf asdfsdf`,searchText.substring(1),`-asdfa`,`asdf-`]);
    testAllForSuccess(getCaseSensitiveValidator(), [`asdfa adsf as${searchText.toUpperCase()}dfsdf`,searchText.substring(1),`${searchText.toUpperCase()}-asdfa`,`asdf-${searchText.toUpperCase()}`]);
  });
  test('failure cases', () => {
    testAllForFailure(getCaseInSensitiveValidator(), [`asdfa adsf as${searchText}dfsdf`,searchText,`${searchText}-asdfa`,`asdf-${searchText}`]);
    testAllForFailure(getCaseSensitiveValidator(), [`asdfa adsf as${searchText}dfsdf`,searchText,`${searchText}-asdfa`,`asdf-${searchText}`]);

    
  });
});
describe('Int validator', ()=>{
  let getValidator = () => new v.IntValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), [1,123,4000,"1","0","10001",1.0]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), [1.1,1.01,"123.0","abc", {}, false, true]);
  });
});
describe('Number validator', ()=>{
  let getValidator = () => new v.NumberValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), [1,123,4000,"1","0","10001",1.0,"1.0"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["abc123.0","abc", {}, false, true]);
  });
});
describe('Float validator', ()=>{
  let getValidator = () => new v.FloatValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), [0.1234,1.1,123,4000,"1","0","10001",1.1220]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["abc", {}, false, true]);
  });
});
describe('Email validator', ()=>{
  let getValidator = () => new v.EmailValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["abc@mail.com", "a@b.com", "a.x'x@m.biz"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["abc",1,true, false, {}, "@mail.com"]);
  });
});
describe('GUID validator', ()=>{
  let getValidator = () => new v.GuidValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["{027FE16E-70FE-41B1-B2E7-6E3818564F23}","027FE16E-70FE-41B1-B2E7-6E3818564F23"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["{027FE16E-70FE-41B1-B2E7-6E3818564F3}","027FE16Ea70FE-41B1-B2E7-6E3818564F23"]);
  });
});
describe('HexColor validator', ()=>{
  let getValidator = () => new v.HexColorValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["#ffffff","#fff"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["fff",3004085616, true, false, 0, 1,"0","1"]);
  });
});
describe('InArray validator', ()=>{
  let getValidator = () => new v.InArrayValidator(["a","b","c",100]);
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["a","b","c", 100]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["x",1,10,1000]);
  });
});
describe('NotInArray validator', ()=>{
  let getValidator = () => new v.NotInArrayValidator(["a","b","c",100]);
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["x",1,10,1000]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["a","b","c", 100]);
  });
});
describe('Length validator', ()=>{
  let getValidator = () => new v.LengthValidator(1,3);
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["a","abc",[1,2,3],[1]]);
    testAllForSuccess(new v.LengthValidator(3,undefined),[123,"abc","abcd",[1,2,3,4]]);
    
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["abcd",1234,[1,2,3,4],[]]);
    testAllForFailure(new v.LengthValidator(3,undefined), [12,"a","bc",[1],[]]);
  });
});
describe('Min validator', ()=>{
  let getValidator = () => new v.MinValidator(5);
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), [5,6,100,"5","6",5.100,"5.234"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), [1,2,3,"1","2","abc",true, false, {}]);
  });
});
describe('Max validator', ()=>{
  let getValidator = () => new v.MaxValidator(5);
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), [1,5,"1","5",]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), [6,100,"6",5.100,"5.234",true, false, {}]);
  });
});
describe('NameText validator', ()=>{
  let getValidator = () => new v.NameTextValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["Joe Smith", "Larry O'Hanigan", "Sally Smith-Hill"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["J@o", "Ted$", true, false, 0, "0","ASDF12" ]);
  });
});
describe('Url validator', ()=>{
  let getValidator = () => new v.UrlValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["https://www.secure.com/default.htm", "http://www.abc.net.au", "https://otg.technology"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["htts://www.secure.com/default.htm","J@o", "Ted$", true, false, 0, "0","ASDF12" ]);
  });
});
describe('Secure Url validator', ()=>{
  let getValidator = () => new v.HttpsUrlValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["https://www.secure.com/default.htm", "https://otg.technology"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["http://www.abc.net.au","htts://www.secure.com/default.htm","J@o", "Ted$", true, false, 0, "0","ASDF12" ]);
  });
});
describe('boolean validator', ()=>{
  let getValidator = () => new v.BooleanValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), [true, false]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["yes","no",123,"1",1,0,{}]);
  });
});

describe('PhoneNumber validator', ()=>{
  let getValidator = () => new v.PhoneNumberValidator();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), ["+61 (4) 345 12345","123-12324","(04) 1234 5678", "+61 4 31 207 307"]);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), ["abc","(04) ABC 2134", {}, true, false]);
  });
});



/*  Template

describe(' validator', ()=>{
  let getValidator = () => new v();
  test('success cases', () => {
    testEmptySucceeds(getValidator);
    testAllForSuccess(getValidator(), []);
  });
  test('failure cases', () => {
    testAllForFailure(getValidator(), []);
  });
});

*/