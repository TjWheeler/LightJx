# LightJx - A Validation Framework

A javascript validation framework ported and adapted from [LightVx](https://github.com/TjWheeler/LightVx)

# Usage

```node
npm i lightjx --save
```
```javascript
import { Validate } from 'lightjx';

let validator = Validate.field("MyField","Display Name").asPhoneNumber();
validator.validate("This is the user input");
if(!validator.isValid) {
    console.error(validator.errorMessage);
}
```

# A note on security & validation

Remember that validation in the browser is purely asthetic for user convenience. It offers no security and is easily bypassed.
All systems should appropriately validate in the backend as part of a trusted and secure process.

# Examples

## Storing all validation rules in an object using the name

```javascript
{
    businessName: Validate.field("businessName", "Business Name").required().asAlphaNumericHyphenText(),
    email: Validate.field("email", "E-Mail").required().asEmail(),
    phone: Validate.field("phone", "Phone").asPhoneNumber(),
    fax: Validate.field("fax", "Fax").asPhoneNumber()
}
```

## Using a validator directly

```javascript
import { Validate } from 'lightjx';

let emailValidator = Validate.field("email", "E-Mail").required().asEmail().validate("yourEmail@address");
if(!emailValidator.isValid) {
    console.error(emailValidator.errorMessage);
}
```

## Using a custom regular expression
This validator is not using the _required_ validator, so if there is no input the isValid propertywill be true.
Most validators will suceed if no user input unless *.required()* is used.

```javascript
import { Validate } from 'lightjx';

let validator = Validate.field("MyField","Display Name").withExpression(/^[a-zA-Z0-9]{1,}$/);
validator.validate("This is the user input");
if(!validator.isValid) {
    console.error(validator.errorMessage);
}
```

## Available commands

- with(validator:Validator)
- withExpression(expression:string | RegExp)
- asAlphaText()
- asAlphaNumericHyphenText()
- asName()
- asPhoneNumber()
- asEmail()
- isDateOnOrAfter(minDate:Date)
- isDateOnOrBefore(maxDate:Date)
- isDateBetween(minDate:Date, maxDate:Date)
- isBoolean()
- containsText(searchText:string, ignoreCase:boolean = false)
- isInt()
- isFloat()
- isGuid()
- isHexColor()
- in(items:Array<any>)
- notIn(items:Array<any>)
- isNull()
- isEmptyString()
- is(value:any)
- isNot(value:any)
- hasLengthRange(min?:number, max?:number)
- hasLength(length:number)
- min(min:number)
- max(max:number)