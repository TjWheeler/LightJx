import { DateHelper } from '../src/helpers/DateHelper';
import {Validate} from '../src/Validate';
import { ValidatorFluent } from '../src/ValidatorFluent';
import { MaxValidator, MinValidator, RequiredValidator } from '../src/validators/CoreValidators';
import { logOptions } from '../src/validators/CoreValidators';

logOptions.enabled = false;
const fieldName = "MyField";
const displayName = "My Field";
const validate =() : ValidatorFluent=>{
    return Validate.field(fieldName, displayName);
};
const validateAllForSuccess = (fluent:ValidatorFluent, inputSet:Array<any>) => {
    inputSet.forEach(input => {
        let result = fluent.validate(input).isValid;
        if(!result) debugger;
        expect(result).toBe(true);
        expect(fluent.errorMessage).toBe("");
        expect(fluent.errorMessages.length).toBe(0);
    });
};
const validateAllForFailure = (fluent:ValidatorFluent, inputSet:Array<any>) => {
    inputSet.forEach(input => {
        let result = fluent.validate(input).isValid;
        if(result) debugger;
        expect(result).toBe(false);
        expect(fluent.errorMessage).not.toBe("");
        expect(fluent.errorMessages.length).not.toBe(0);
    });
};
describe('fluent api', ()=>{
    test('required', () => {
        let fluent = validate().required();
        validateAllForSuccess(fluent, ["1",1,{},true,1.1]);
        validateAllForFailure(fluent, ["",null,NaN,undefined]);
    });
    test('with', () => {
        let fluent = validate().with(new RequiredValidator());
        validateAllForSuccess(fluent, ["1",1,{},true,1.1]);
        validateAllForFailure(fluent, ["",null,NaN,undefined]);
    });
    test('withExpression', () => {
        let fluent = validate().withExpression(/^[a-zA-Z0-9]{1,}$/);
        validateAllForSuccess(fluent, ["1",1,"abcABC123"]);
        validateAllForFailure(fluent, ["#$@",{},"'"]);
    });
    test('asAlphaText', () => {
        let fluent = validate().asAlphaText();
        validateAllForSuccess(fluent, ["a","abc ABC"]);
        validateAllForFailure(fluent, ["#$@",{},"'",1,"1"]);
    });
    test('asAlphaNumericText', () => {
        let fluent = validate().asAlphaNumericText();
        validateAllForSuccess(fluent, ["a","abcABC",123,"abc1","1"]);
        validateAllForFailure(fluent, ["#$@",{},"'","#1a"]);
    });
    test('asAlphaNumericHyphenText', () => {
        let fluent = validate().asAlphaNumericHyphenText();
        validateAllForSuccess(fluent, ["a","abc ABC","abc 123",123,"a-b"]);
        validateAllForFailure(fluent, ["#$@",{},"'",true,false]);
    });
    test('isDateOnOrAfter', () => {
        const theDate = DateHelper.subtractHours(new Date(), 1);
        let fluent = validate().isDateOnOrAfter(theDate);
        validateAllForSuccess(fluent, [new Date(),DateHelper.subtractMinutes(new Date(), 1), theDate]);
        validateAllForFailure(fluent, [DateHelper.subtractHours(new Date(), 2),DateHelper.subtractSeconds(theDate, 1)]);
        validateAllForSuccess(validate().isDateOnOrAfter(()=>theDate), [new Date(),DateHelper.subtractMinutes(new Date(), 1), theDate]);
    });
    test('isDateOnOrBefore', () => {
        const theDate = DateHelper.addHours(new Date(), 1);
        let fluent = validate().isDateOnOrBefore(theDate);
        validateAllForSuccess(fluent, [new Date(),DateHelper.addMinutes(new Date(),1),theDate]);
        validateAllForFailure(fluent, [DateHelper.addHours(new Date(),2), DateHelper.addSeconds(theDate, 1)]);
        validateAllForSuccess(validate().isDateOnOrBefore(()=>theDate), [new Date(),DateHelper.addMinutes(new Date(),1),theDate]);
    });
    test('isDateBetween', () => {
        const minDate = new Date();
        const maxDate = DateHelper.addHours(minDate, 1);
        let fluent = validate().isDateBetween(minDate,maxDate);
        validateAllForSuccess(fluent, [minDate,maxDate, DateHelper.addMinutes(minDate, 1)]);
        validateAllForFailure(fluent, [DateHelper.addSeconds(maxDate, 1), DateHelper.subtractSeconds(minDate, 1)]);
        expect(fluent.validate(DateHelper.addSeconds(maxDate, 1)).isValid).toBe(false);
        expect(fluent.validate(DateHelper.addSeconds(maxDate, 1)).errorMessage.indexOf('My Field') > -1).toBe(true);
    });
    test('isBoolean', () => {
        let fluent = validate().asBoolean();
        validateAllForSuccess(fluent, [true,false,"true","false"]);
        validateAllForFailure(fluent, ["#$@",{},1,0,"yes","no"]);
    });
    test('containsText', () => {
        const searchText = "aBc123";
        let fluent = validate().containsText(searchText, false);
        validateAllForSuccess(fluent, [`----${searchText}`,`abc${searchText}abc`, searchText]);
        validateAllForFailure(fluent, [`abc${searchText.toUpperCase()}abc`,true,false,"true","false","#$@",{},1,0,"yes","no"]);
        fluent = validate().containsText(()=>searchText, false);
        validateAllForSuccess(fluent, [`----${searchText}`,`abc${searchText}abc`, searchText]);
        validateAllForFailure(fluent, [`abc${searchText.toUpperCase()}abc`,true,false,"true","false","#$@",{},1,0,"yes","no"]);
        fluent = validate().containsText(searchText, true);
        validateAllForSuccess(fluent, [`abc${searchText}abc`,`----${searchText.toUpperCase()}`,`abc${searchText.toUpperCase()}abc`, searchText.toUpperCase()]);
        validateAllForFailure(fluent, [`abcabc`,true,false,"true","false","#$@",{},1,0,"yes","no"]);
        
    });
    test('doesNotContainText', () => {
        const searchText = "aBc123";
        let fluent = validate().doesNotContainText(searchText, false);
        validateAllForFailure(fluent, [`----${searchText}`,`abc${searchText}abc`, searchText]);
        validateAllForSuccess(fluent, [`abc${searchText.toUpperCase()}abc`,"true","false","#$@","yes","no"]);
        fluent = validate().doesNotContainText(()=>searchText, false);
        validateAllForFailure(fluent, [`----${searchText}`,`abc${searchText}abc`, searchText]);
        validateAllForSuccess(fluent, [`abc${searchText.toUpperCase()}abc`,"true","false","#$@","yes","no"]);
        fluent = validate().doesNotContainText(searchText, true);
        validateAllForFailure(fluent, [`abc${searchText}abc`,`----${searchText.toUpperCase()}`,`abc${searchText.toUpperCase()}abc`, searchText.toUpperCase()]);
        validateAllForSuccess(fluent, [`abcabc`,"true","false","#$@","yes","no"]);
        
    });
    test('isInt', () => {
        let fluent = validate().asInt();
        validateAllForSuccess(fluent, [1,123,"1","123"]);
        validateAllForFailure(fluent, [1.1,"1.2","#$@",{},"yes","no", parseInt("abc")]);
    });
    test('isFloat', () => {
        let fluent = validate().asFloat();
        validateAllForSuccess(fluent, [1.1,"1.2",1,123,"1","123"]);
        validateAllForFailure(fluent, ["1.1abc","#$@",{},"yes","no",parseInt("abc")]);
    });
    test('asNumber', () => {
        let fluent = validate().asNumber();
        validateAllForSuccess(fluent, [1, 123, "1", "123", 1.5, "1.5", -10, "-10", 0, "0"]);
        validateAllForFailure(fluent, ["abc", "#$@", {}, "yes", "no", true, false, NaN, parseInt("abc"), "12.34.56", "123abc"]);
    });
    test('isEmail', () => {
        let fluent = validate().asEmail();
        validateAllForSuccess(fluent, ["abc@mail.com", "a@b.com", "a.x'x@m.biz"]);
        validateAllForFailure(fluent, ["1.1abc","#$@",{},"yes","no","@mail.com",true,false,0,123]);
    });
    test('isGuid', () => {
        let fluent = validate().asGuid();
        validateAllForSuccess(fluent, ["{027FE16E-70FE-41B1-B2E7-6E3818564F23}","027FE16E-70FE-41B1-B2E7-6E3818564F23"]);
        validateAllForFailure(fluent, ["{027FE16E-70FE-41B1-B2E7-6E3818564F3}","027FE16Ea70FE-41B1-B2E7-6E3818564F23"]);
    });
    test('isHexColor', () => {
        let fluent = validate().asHexColor();
        validateAllForSuccess(fluent, ["#ffffff","#fff"]);
        validateAllForFailure(fluent, ["fff",3004085616, true, false, 0, 1,"0","1"]);
    });
    test('in', () => {
        const items = [1,2,3,"a","b","c",true,false];
        let fluent = validate().in(items);
        validateAllForSuccess(fluent, [1,2,3,"a","b","c",true,false]);
        validateAllForFailure(fluent, ["1",5,0,{},"true"]);
    });
    test('notIn', () => {
        const items = [1,2,3,"a","b","c",true,false];
        let fluent = validate().notIn(items);
        validateAllForSuccess(fluent, ["1",5,0,{},"true"]);
        validateAllForFailure(fluent, [1,2,3,"a","b","c",true,false]);
    });
    test('isNull', () => {
        let fluent = validate().isNull();
        validateAllForSuccess(fluent, [null]);
        validateAllForFailure(fluent, ["fff",3004085616, true, false, 0, 1,"0","1"]);
    });
    test('isEmptyString', () => {
        let fluent = validate().isEmptyString();
        validateAllForSuccess(fluent, [""]);
        validateAllForFailure(fluent, ["fff",3004085616, true, false, 0, 1,"0","1"]);
    });
    test('is', () => {
        validateAllForSuccess(validate().is("abc"), ["abc"]);
        validateAllForSuccess(validate().is(123), [123]);
        validateAllForSuccess(validate().is(true), [true]);
        validateAllForFailure(validate().is(true), [false,0,"1"]);
    });
    test('isNot', () => {
        validateAllForSuccess(validate().isNot("abc"), ["abcd"]);
        validateAllForSuccess(validate().isNot(123), [1234]);
        validateAllForSuccess(validate().isNot(true), [false]);
        validateAllForFailure(validate().isNot(true), [true]);
    });
    test('hasLengthRange', () => {
        let fluent = validate().hasLengthRange(()=>2,()=>4);
        validateAllForSuccess(fluent, ["12","123","1234",[1,2,3,4]]);
        validateAllForFailure(fluent, ["1","12345",[1,2,3,4,5],[]]);
    });
    test('hasMaxLength', () => {
        let fluent = validate().hasMaxLength(()=>3);
        validateAllForSuccess(fluent, ["123",[1,2,3]]);
        validateAllForFailure(fluent, ["12345",[1,2,3,4,5]]);
    });
    test('hasMinLength', () => {
        let fluent = validate().hasMinLength(()=>3);
        validateAllForSuccess(fluent, ["123",[1,2,3],"1234"]);
        validateAllForFailure(fluent, ["12",[1,2],[]]);
    });
    test('hasLength', () => {
        let fluent = validate().hasLength(3);
        validateAllForSuccess(fluent, ["123","abc",[1,2,3],123]);
        validateAllForFailure(fluent, ["12","1234",[1,2],[1,2,3,4],12,1234]);
        // Test with function
        let fluentWithFunction = validate().hasLength(()=>5);
        validateAllForSuccess(fluentWithFunction, ["12345","hello",[1,2,3,4,5],12345]);
        validateAllForFailure(fluentWithFunction, ["1234","123456",[1,2,3,4],[1,2,3,4,5,6],1234,123456]);
    });
    test('min', () => {
        let fluent = validate().min(()=>3);
        validateAllForSuccess(fluent, [3,4,100]);
        validateAllForFailure(fluent, [0,1,2, NaN, parseInt("abc")]);
    });
    test('max', () => {
        let fluent = validate().max(()=>3);
        validateAllForSuccess(fluent, [0,1,2,3]);
        validateAllForFailure(fluent, [4,100,"abc", NaN, parseInt("abc")]);
    });
    test('asName', () => {
        let fluent = validate().asName();
        validateAllForSuccess(fluent, ["Joe Smith", "Larry O'Hanigan", "Sally Smith-Hill"]);
        validateAllForFailure(fluent, ["J@o", "Ted$", true, false, 0, "0","ASDF12" ]);
    });
    test('asPhoneNumber', () => {
        let fluent = validate().asPhoneNumber();
        validateAllForSuccess(fluent, ["+61 (4) 345 12345","123-12324","(04) 1234 5678", "+61 4 31 207 307"]);
        validateAllForFailure(fluent, ["J@o", "Ted$", true, false, 0, "0","ASDF12" ]);
    });
    test('asSecureUrl', () => {
        let fluent = validate().asSecureUrl();
        validateAllForSuccess(fluent, ["https://abc.com","https://www.abc.com"]);
        validateAllForFailure(fluent, ["http://abc.com", "http://www.abc.com", "J@o", "Ted$", true, false, 0, "0","ASDF12" ]);
    });
    test('hasValidator', () => {
        let fluent = validate().asNumber().max(1);
        let hasValidator = fluent.hasValidator("MaxValidator");
        expect(hasValidator).toBe(true);
        hasValidator = fluent.hasValidator("MinValidator");
        expect(hasValidator).toBe(false);
    });
});