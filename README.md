# LightJx - A Validation Framework

A javascript validation framework ported and adapted from [LightVx](https://github.com/TjWheeler/LightVx)

## Documentation

📚 **[AI Developer Guide](./docs/ai-guidance.md)** - Comprehensive guide with all validators, patterns, and examples

# Usage

```node
npm i lightjx --save
```
```javascript
import { Validate } from 'lightjx';

let validator = Validate.field("MyField","Display Name").required().asPhoneNumber();
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
This validator is not using the _required_ validator, so if there is no input the isValid property will be true.
Most validators will succeed if no user input unless *.required()* is used.

```javascript
import { Validate } from 'lightjx';

let validator = Validate.field("MyField","Display Name").withExpression(/^[a-zA-Z0-9]{1,}$/);
validator.validate("This is the user input");
if(!validator.isValid) {
    console.error(validator.errorMessage);
}
```

## Validating exact lengths
LightJx provides a `hasLength()` method for validating exact string or number lengths, useful for postal codes, IDs, phone numbers, etc.

```javascript
import { Validate } from 'lightjx';

// Validate US zip code (exactly 5 digits)
let zipValidator = Validate.field("zipCode","Zip Code").required().hasLength(5);
zipValidator.validate("12345"); // Valid
zipValidator.validate("1234");  // Invalid - too short
zipValidator.validate("123456"); // Invalid - too long

// Validate product ID (exactly 8 characters)
let idValidator = Validate.field("productId","Product ID").required().hasLength(8).asAlphaNumericText();
idValidator.validate("ABC12345"); // Valid
idValidator.validate("ABC123");   // Invalid - too short
```

## Using a function to defer validtaion
Sometimes, you might want to validate using information from another source, such as a different field in the form.  Some validators allow a function to be used instead of the comparison value, these are:
- MinValidator
- MaxValidator
- MinDateValidator
- BetweenDateValidator
- ContainsTextValidator
- NotContainsTextValidator
- LengthValidator (hasMinLength, hasMaxLength, hasLengthRange, hasLength)
Passing in a function will allow more advanced validation that adjusts to changing form data.

```javascript
import { Validate } from 'lightjx';

let validator = Validate.field("MyField","Display Name").min(() => yourFormState.values.minCapacity);
validator.validate(100);
if(!validator.isValid) {
    console.error(validator.errorMessage);
}
```

## Validate.field and Validate.define
In general, if you want to create user friendly validation messages, use the `Validate.field` function as this allows you to pass in control and display name values.
If you want to just create validation rules and ignore field names, you can use `Validate.define`

```javascript
//Using field
let validator = Validate.field("username", "Your username").required().asAlphaText().hasMaxLength(5);
//Using Define
let validator = Validate.define().required().asAlphaText().hasMaxLength(5);
```

## Custom Error Messages

All validator methods support custom error messages through an optional `errorMessage` parameter. When provided, your custom message replaces the default validator error message.

```javascript
// Basic custom error message
let validator = Validate.field("email", "Email Address")
    .required("Please enter your email address")
    .asEmail("Enter a valid email address");

// Multiple validators with custom messages
let passwordValidator = Validate.field("password", "Password")
    .required("Password is required")
    .hasMinLength(8, "Password must be at least 8 characters")
    .containsText("A", false, "Password must contain an uppercase letter");

// Mix custom and default messages
let usernameValidator = Validate.field("username", "Username")
    .required("Username is required")
    .asAlphaNumericText() // uses default message
    .hasMaxLength(20, "Username cannot exceed 20 characters");
```

## Available commands

All methods accept an optional `errorMessage` parameter for custom error messages:

- with(validator:Validator)
- withExpression(expression:string | RegExp)
- required(errorMessage?: string)
- asAlphaText(errorMessage?: string)
- asAlphaNumericText(errorMessage?: string)
- asAlphaNumericHyphenText(errorMessage?: string)
- asName(errorMessage?: string)
- asPhoneNumber(errorMessage?: string)
- asEmail(errorMessage?: string)
- asDate(errorMessage?: string)
- isDateOnOrAfter(minDate:Date, errorMessage?: string)
- isDateOnOrBefore(maxDate:Date, errorMessage?: string)
- isDateBetween(minDate:Date, maxDate:Date, errorMessage?: string)
- asBoolean(errorMessage?: string)
- containsText(searchText:string, ignoreCase:boolean = false, errorMessage?: string)
- doesNotContainText(searchText:string, ignoreCase:boolean = false, errorMessage?: string)
- asInt(errorMessage?: string)
- asFloat(errorMessage?: string)
- asNumber(errorMessage?: string)
- asGuid(errorMessage?: string)
- asHexColor(errorMessage?: string)
- asUrl(errorMessage?: string)
- asSecureUrl(errorMessage?: string)
- in(items:Array<any>, errorMessage?: string)
- notIn(items:Array<any>, errorMessage?: string)
- isNull(errorMessage?: string)
- isEmptyString(errorMessage?: string)
- is(value:any, errorMessage?: string)
- isNot(value:any, errorMessage?: string)
- hasLengthRange(min?:number, max?:number, errorMessage?: string)
- hasMinLength(minLength:number | Function, errorMessage?: string)
- hasMaxLength(maxLength:number | Function, errorMessage?: string)
- hasLength(length:number | Function, errorMessage?: string)
- hasNoBrackets()
- min(min:number, errorMessage?: string)
- max(max:number, errorMessage?: string)