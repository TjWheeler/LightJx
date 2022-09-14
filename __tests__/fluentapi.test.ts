import {Validate} from '../src/Validate';
import { ValidatorFluent } from '../src/ValidatorFluent';
import { RequiredValidator } from '../src/validators/CoreValidators';
import { logOptions } from '../src/validators/CoreValidators';
import moment from 'moment';
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
    test('asAlphaNumericHyphenText', () => {
        let fluent = validate().asAlphaNumericHyphenText();
        validateAllForSuccess(fluent, ["a","abc ABC","abc 123",123,"a-b"]);
        validateAllForFailure(fluent, ["#$@",{},"'",true,false]);
    });
    test('isDateOnOrAfter', () => {
        const theDate = moment().subtract(1,"hours").toDate();
        let fluent = validate().isDateOnOrAfter(theDate);
        validateAllForSuccess(fluent, [new Date(),moment().subtract(1,"minutes").toDate(), theDate]);
        validateAllForFailure(fluent, [moment().subtract(2,"hours").toDate(),moment(theDate).subtract(1,'seconds').toDate()]);
    });
    test('isDateOnOrBefore', () => {
        const theDate = moment().add(1,"hours").toDate();
        let fluent = validate().isDateOnOrBefore(theDate);
        validateAllForSuccess(fluent, [new Date(),moment().add(1,"minutes").toDate(),theDate]);
        validateAllForFailure(fluent, [moment().add(2,"hours").toDate(), moment(theDate).add(1,'seconds').toDate()]);
    });
    test('isDateBetween', () => {
        const minDate = moment().toDate();
        const maxDate = moment(minDate).add(1,"hours").toDate();
        let fluent = validate().isDateBetween(minDate,maxDate);
        validateAllForSuccess(fluent, [minDate,maxDate, moment(minDate).add(1,"minutes").toDate()]);
        validateAllForFailure(fluent, [moment(maxDate).add(1,"seconds").toDate(), moment(minDate).subtract(1,'seconds').toDate()]);
    });
    test('isBoolean', () => {
        let fluent = validate().isBoolean();
        validateAllForSuccess(fluent, [true,false,"true","false"]);
        validateAllForFailure(fluent, ["#$@",{},1,0,"yes","no"]);
    });
    test('containsText', () => {
        const searchText = "aBc123";
        let fluent = validate().containsText(searchText, false);
        validateAllForSuccess(fluent, [`----${searchText}`,`abc${searchText}abc`, searchText]);
        validateAllForFailure(fluent, [`abc${searchText.toUpperCase()}abc`,true,false,"true","false","#$@",{},1,0,"yes","no"]);
        fluent = validate().containsText(searchText, true);
        validateAllForSuccess(fluent, [`abc${searchText}abc`,`----${searchText.toUpperCase()}`,`abc${searchText.toUpperCase()}abc`, searchText.toUpperCase()]);
        validateAllForFailure(fluent, [`abcabc`,true,false,"true","false","#$@",{},1,0,"yes","no"]);
    });
    test('isInt', () => {
        let fluent = validate().isInt();
        validateAllForSuccess(fluent, [1,123,"1","123"]);
        validateAllForFailure(fluent, [1.1,"1.2","#$@",{},"yes","no"]);
    });
    test('isFloat', () => {
        let fluent = validate().isFloat();
        validateAllForSuccess(fluent, [1.1,"1.2",1,123,"1","123"]);
        validateAllForFailure(fluent, ["1.1abc","#$@",{},"yes","no"]);
    });
    test('isEmail', () => {
        let fluent = validate().asEmail();
        validateAllForSuccess(fluent, ["abc@mail.com", "a@b.com", "a.x'x@m.biz"]);
        validateAllForFailure(fluent, ["1.1abc","#$@",{},"yes","no","@mail.com",true,false,0,123]);
    });
    test('isGuid', () => {
        let fluent = validate().isGuid();
        validateAllForSuccess(fluent, ["{027FE16E-70FE-41B1-B2E7-6E3818564F23}","027FE16E-70FE-41B1-B2E7-6E3818564F23"]);
        validateAllForFailure(fluent, ["{027FE16E-70FE-41B1-B2E7-6E3818564F3}","027FE16Ea70FE-41B1-B2E7-6E3818564F23"]);
    });
    test('isHexColor', () => {
        let fluent = validate().isHexColor();
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
        let fluent = validate().hasLengthRange(2,4);
        validateAllForSuccess(fluent, ["12","123","1234",[1,2,3,4]]);
        validateAllForFailure(fluent, ["1","12345",[1,2,3,4,5],[]]);
    });
    test('hasLength', () => {
        let fluent = validate().hasLength(3);
        validateAllForSuccess(fluent, ["123",[1,2,3]]);
        validateAllForFailure(fluent, ["1","12345",[1,2,3,4,5],[]]);
    });
    test('min', () => {
        let fluent = validate().min(3);
        validateAllForSuccess(fluent, [3,4,100]);
        validateAllForFailure(fluent, [0,1,2]);
    });
    test('max', () => {
        let fluent = validate().max(3);
        validateAllForSuccess(fluent, [0,1,2,3]);
        validateAllForFailure(fluent, [4,100,"abc"]);
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
});