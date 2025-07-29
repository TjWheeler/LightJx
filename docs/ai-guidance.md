# LightJx AI Developer Guidance

This comprehensive guide provides everything an AI developer needs to become proficient with LightJx validation framework. LightJx is a fluent JavaScript validation library that works in both browser and Node.js environments.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Core Concepts](#core-concepts)
3. [Usage Patterns](#usage-patterns)
4. [Complete Validator Reference](#complete-validator-reference)
5. [Implementation Examples](#implementation-examples)
6. [Best Practices](#best-practices)

## Quick Start

### Installation
```bash
npm install lightjx
```

### Basic Usage
```javascript
import { Validate } from 'lightjx';

// Define a validator
const emailValidator = Validate.field("email", "Email Address")
    .required()
    .asEmail();

// Validate input
const result = emailValidator.validate("user@example.com");
if (!result.isValid) {
    console.log(result.errorMessage); // "Email Address is required"
}
```

## Core Concepts

### Fluent API
LightJx uses method chaining to build validation rules:
```javascript
Validate.field("username", "Username")
    .required()
    .asAlphaNumericText()
    .hasMinLength(3)
    .hasMaxLength(20)
```

### Two Entry Points

1. **Named Fields**: Use when you have a specific field to validate
```javascript
Validate.field("fieldName", "Display Name")
```

2. **Anonymous Validation**: Use for general-purpose validation
```javascript
Validate.define()
```

### Validation Result Structure
```javascript
{
    isValid: boolean,
    errorMessage: string,        // Combined error messages
    errorMessages: string[],     // Array of all errors
    input: any                   // The validated input
}
```

### Important Behaviors
- Most validators **succeed on empty values** (null, undefined, "") unless `.required()` is used
- Validators can accept **functions** for dynamic values
- Error messages automatically include field display names
- Multiple validators are executed in order, collecting all errors

## Usage Patterns

### Pattern 1: Direct Fluent API
```javascript
// Inline validation
const isValid = Validate.field("age", "Age")
    .required()
    .asNumber()
    .min(18)
    .max(120)
    .validate(25)
    .isValid;
```

### Pattern 2: Reusable Validators
```javascript
// Define once, use multiple times
const passwordValidator = Validate.field("password", "Password")
    .required()
    .hasMinLength(8)
    .containsText(/[A-Z]/) // At least one uppercase
    .containsText(/[0-9]/); // At least one number

// Use repeatedly
passwordValidator.validate("Pass123!"); // true
passwordValidator.validate("weak");     // false
```

### Pattern 3: Form Validation Object
```javascript
const validators = {
    username: Validate.field("username", "Username").required().asAlphaNumericText(),
    email: Validate.field("email", "Email").required().asEmail(),
    age: Validate.field("age", "Age").required().asNumber().min(18)
};

// Validate form data
function validateForm(formData) {
    const errors = {};
    for (const [field, validator] of Object.entries(validators)) {
        const result = validator.validate(formData[field]);
        if (!result.isValid) {
            errors[field] = result.errorMessage;
        }
    }
    return errors;
}
```

### Pattern 4: Dynamic Validation
```javascript
// Using functions for runtime values
const dateValidator = Validate.field("startDate", "Start Date")
    .required()
    .asDate()
    .isDateOnOrAfter(() => new Date()); // Function executed at validation time

// Dynamic min/max
const priceValidator = Validate.field("price", "Price")
    .required()
    .asNumber()
    .min(() => getMinPrice())
    .max(() => getMaxPrice());
```

## Complete Validator Reference

### Text Validators

#### asAlphaText()
Validates alphabetic characters and spaces only.
```javascript
Validate.field("name", "Name").asAlphaText()
// Valid: "John Doe", "ABC", "Test Name"
// Invalid: "John123", "Test-Name", "user@email"
```

#### asAlphaNumericText()
Validates alphanumeric characters only (no spaces).
```javascript
Validate.field("code", "Code").asAlphaNumericText()
// Valid: "ABC123", "test", "123"
// Invalid: "ABC 123", "test-code", "user@123"
```

#### asAlphaNumericHyphenText()
Validates alphanumeric characters, spaces, and hyphens.
```javascript
Validate.field("slug", "Slug").asAlphaNumericHyphenText()
// Valid: "my-slug-123", "ABC 123", "test-name"
// Invalid: "test@name", "slug#123", "name!"
```

#### asName()
Validates names (letters, spaces, hyphens, apostrophes).
```javascript
Validate.field("fullName", "Full Name").asName()
// Valid: "John O'Brien", "Mary-Jane", "José"
// Invalid: "John123", "Name@test", "User#1"
```

### Email & URL Validators

#### asEmail()
Validates email addresses.
```javascript
Validate.field("email", "Email").asEmail()
// Valid: "user@example.com", "test.user+tag@domain.co.uk"
// Invalid: "notanemail", "@example.com", "user@"
```

#### asUrl()
Validates URLs (http, https, mailto, news).
```javascript
Validate.field("website", "Website").asUrl()
// Valid: "https://example.com", "http://test.org", "mailto:user@example.com"
// Invalid: "example.com", "ftp://file.com", "not a url"
```

#### asSecureUrl()
Validates HTTPS URLs only.
```javascript
Validate.field("apiEndpoint", "API Endpoint").asSecureUrl()
// Valid: "https://api.example.com", "https://secure.test.org"
// Invalid: "http://example.com", "ftp://file.com", "example.com"
```

### Number Validators

#### asNumber()
Validates numeric values (accepts number type or numeric strings).
```javascript
Validate.field("quantity", "Quantity").asNumber()
// Valid: 123, "456", -789, "12.34"
// Invalid: "abc", "12a", null (without required)
```

#### asInt()
Validates integers only.
```javascript
Validate.field("count", "Count").asInt()
// Valid: 123, "456", -789, "0"
// Invalid: 12.34, "12.34", "abc", "1.0"
```

#### asFloat()
Validates floating-point numbers.
```javascript
Validate.field("price", "Price").asFloat()
// Valid: 12.34, "56.78", 100, "0.5"
// Invalid: "abc", "12.34.56", "1,234.56"
```

#### min(value)
Sets minimum value (works with numbers).
```javascript
Validate.field("age", "Age").asNumber().min(18)
// Valid: 18, 19, 100, "25"
// Invalid: 17, "10", -5

// With function
Validate.field("price", "Price").asNumber().min(() => getMinPrice())
```

#### max(value)
Sets maximum value (works with numbers).
```javascript
Validate.field("percentage", "Percentage").asNumber().max(100)
// Valid: 0, 50, 100, "99.9"
// Invalid: 101, "150", 200

// With function
Validate.field("quantity", "Quantity").asNumber().max(() => getStock())
```

### Date Validators

#### asDate()
Validates date objects or ISO date strings.
```javascript
Validate.field("birthDate", "Birth Date").asDate()
// Valid: new Date(), "2023-12-25", "2023-01-01T00:00:00Z"
// Invalid: "invalid-date", "25/12/2023", "December 25, 2023"
```

#### isDateOnOrAfter(date)
Validates date is on or after specified date.
```javascript
const today = new Date();
Validate.field("startDate", "Start Date").isDateOnOrAfter(today)
// Valid: today, tomorrow, future dates
// Invalid: yesterday, past dates

// With function
Validate.field("endDate", "End Date").isDateOnOrAfter(() => getStartDate())
```

#### isDateOnOrBefore(date)
Validates date is on or before specified date.
```javascript
const deadline = new Date('2024-12-31');
Validate.field("submitDate", "Submit Date").isDateOnOrBefore(deadline)
// Valid: today, deadline, past dates
// Invalid: dates after deadline

// With function
Validate.field("startDate", "Start Date").isDateOnOrBefore(() => getEndDate())
```

#### isDateBetween(minDate, maxDate)
Validates date is between two dates (inclusive).
```javascript
const start = new Date('2024-01-01');
const end = new Date('2024-12-31');
Validate.field("eventDate", "Event Date").isDateBetween(start, end)
// Valid: any date in 2024
// Invalid: dates before 2024 or after 2024
```

### String Length Validators

#### hasMinLength(length)
Validates minimum string length.
```javascript
Validate.field("username", "Username").hasMinLength(3)
// Valid: "abc", "username", "test123"
// Invalid: "ab", "a", ""

// With function
Validate.field("code", "Code").hasMinLength(() => getMinCodeLength())
```

#### hasMaxLength(length)
Validates maximum string length.
```javascript
Validate.field("tweet", "Tweet").hasMaxLength(280)
// Valid: any string up to 280 characters
// Invalid: strings longer than 280 characters

// With function
Validate.field("comment", "Comment").hasMaxLength(() => getMaxCommentLength())
```

#### hasLengthRange(min, max)
Validates string length within range.
```javascript
Validate.field("password", "Password").hasLengthRange(8, 20)
// Valid: "password123" (11 chars), "securepass" (10 chars)
// Invalid: "short" (5 chars), "verylongpasswordthatexceedslimit" (32 chars)
```

#### hasLength(length)
Validates exact string length. Useful for postal codes, IDs, phone numbers, and any field requiring specific character counts.
```javascript
// US Zip Code validation
Validate.field("zipCode", "Zip Code").hasLength(5)
// Valid: "12345", "90210", "54321"
// Invalid: "1234", "123456", "abc12"

// UK Postal Code (first part)
Validate.field("postalCode", "Postal Code").hasLength(4).asAlphaNumericText()
// Valid: "SW1A", "M1 1A", "B33 8TH" (first 4 chars)
// Invalid: "SW1", "SW1AB1", "12345"

// Product SKU validation
Validate.field("sku", "SKU").hasLength(8).asAlphaNumericText()
// Valid: "ABC12345", "XYZ98765", "12345678"
// Invalid: "ABC123", "ABC123456", "ABC-1234"

// Works with numbers (converted to string length)
Validate.field("employeeId", "Employee ID").hasLength(6)
// Valid: 123456, "654321", "000001"
// Invalid: 12345, 1234567, "abc123"

// Works with arrays (validates array length)
Validate.field("coordinates", "Coordinates").hasLength(2)
// Valid: [10, 20], ["lat", "lng"]
// Invalid: [10], [10, 20, 30]

// Dynamic length with function
Validate.field("securityCode", "Security Code").hasLength(() => getRequiredCodeLength())
// Function called at validation time

// Combined with other validators
Validate.field("productCode", "Product Code")
    .required()
    .hasLength(10)
    .asAlphaNumericHyphenText()
// Must be exactly 10 characters, alphanumeric with hyphens allowed
```

### Content Validators

#### required()
Makes field required (must have a value).
```javascript
Validate.field("name", "Name").required()
// Valid: "any value", 0, false, " " (space)
// Invalid: null, undefined, "", NaN
```

#### asBoolean()
Validates boolean values.
```javascript
Validate.field("agreed", "Agreement").asBoolean()
// Valid: true, false, "true", "false"
// Invalid: "yes", "no", 1, 0, "1"
```

#### containsText(text, ignoreCase)
Validates string contains specific text.
```javascript
Validate.field("description", "Description").containsText("important")
// Valid: "This is important", "important notice"
// Invalid: "This is not", "IMPORTANT" (case sensitive)

// Case insensitive
Validate.field("content", "Content").containsText("warning", true)
// Valid: "Warning!", "WARNING", "wArNiNg"

// With function
Validate.field("message", "Message").containsText(() => getRequiredKeyword())
```

#### doesNotContainText(text, ignoreCase)
Validates string does not contain specific text.
```javascript
Validate.field("username", "Username").doesNotContainText("admin")
// Valid: "user123", "john_doe"
// Invalid: "administrator", "admin_user"

// Case insensitive
Validate.field("comment", "Comment").doesNotContainText("spam", true)
// Valid: "Great post!", "Thanks"
// Invalid: "SPAM", "This is spam", "SpAm"
```

#### hasNoBrackets()
Prevents angle brackets (basic XSS prevention).
```javascript
Validate.field("comment", "Comment").hasNoBrackets()
// Valid: "This is safe text", "No HTML here"
// Invalid: "<script>", "Hello <b>world</b>", "%3Cscript%3E"
```

### Format Validators

#### asPhoneNumber()
Validates phone numbers (flexible format).
```javascript
Validate.field("phone", "Phone").asPhoneNumber()
// Valid: "+1234567890", "(123) 456-7890", "123-456-7890", "1234567890"
// Invalid: "abc", "123", "phone"
```

#### asGuid()
Validates GUID/UUID format.
```javascript
Validate.field("id", "ID").asGuid()
// Valid: "123e4567-e89b-12d3-a456-426614174000", "{123e4567-e89b-12d3-a456-426614174000}"
// Invalid: "not-a-guid", "123456", "12345678-1234-1234-1234-123456789012X"
```

#### asHexColor()
Validates hex color codes.
```javascript
Validate.field("color", "Color").asHexColor()
// Valid: "#FFF", "#FFFFFF", "#123456", "#aAbBcC"
// Invalid: "FFF", "#GGG", "#12345", "rgb(255,255,255)"
```

### Array & Value Validators

#### in(array)
Validates value is in specified array.
```javascript
Validate.field("status", "Status").in(["active", "pending", "completed"])
// Valid: "active", "pending", "completed"
// Invalid: "cancelled", "unknown", null

// With numbers
Validate.field("rating", "Rating").in([1, 2, 3, 4, 5])
// Valid: 1, 2, 3, 4, 5
// Invalid: 0, 6, "1" (string)
```

#### notIn(array)
Validates value is not in specified array.
```javascript
Validate.field("username", "Username").notIn(["admin", "root", "system"])
// Valid: "user123", "john_doe"
// Invalid: "admin", "root", "system"
```

#### is(value)
Validates exact value match.
```javascript
Validate.field("confirmed", "Confirmed").is("YES")
// Valid: "YES"
// Invalid: "yes", "Yes", "NO", true
```

#### isNot(value)
Validates value does not match.
```javascript
Validate.field("status", "Status").isNot("deleted")
// Valid: "active", "pending", anything except "deleted"
// Invalid: "deleted"
```

#### isNull()
Validates value is null.
```javascript
Validate.field("deletedAt", "Deleted At").isNull()
// Valid: null
// Invalid: undefined, "", 0, false, any other value
```

#### isEmptyString()
Validates value is empty string.
```javascript
Validate.field("placeholder", "Placeholder").isEmptyString()
// Valid: ""
// Invalid: " ", "text", null, undefined
```

### Custom Validators

#### with(validator)
Uses custom validator instance.
```javascript
import { RequiredValidator } from 'lightjx';

const customRequired = new RequiredValidator();
Validate.field("data", "Data").with(customRequired)
```

#### withExpression(regex)
Validates with custom regex pattern.
```javascript
// US Zip code
Validate.field("zipCode", "Zip Code").withExpression(/^\d{5}(-\d{4})?$/)
// Valid: "12345", "12345-6789"
// Invalid: "1234", "123456", "12345-67"

// Custom pattern
Validate.field("code", "Code").withExpression(/^[A-Z]{3}-\d{4}$/)
// Valid: "ABC-1234", "XYZ-9999"
// Invalid: "abc-1234", "AB-1234", "ABC-123"
```

## Implementation Examples

### Example 1: User Registration Form
```javascript
const registrationValidators = {
    username: Validate.field("username", "Username")
        .required("Please enter a username")
        .asAlphaNumericText("Username can only contain letters and numbers")
        .hasMinLength(3, "Username must be at least 3 characters")
        .hasMaxLength(20, "Username cannot exceed 20 characters"),
    
    email: Validate.field("email", "Email Address")
        .required("Email address is required")
        .asEmail("Please enter a valid email address"),
    
    password: Validate.field("password", "Password")
        .required("Password is required")
        .hasMinLength(8, "Password must be at least 8 characters")
        .containsText("A", false, "Password must contain at least one uppercase letter")
        .containsText("0", false, "Password must contain at least one number"),
    
    confirmPassword: Validate.field("confirmPassword", "Confirm Password")
        .required("Please confirm your password"),
    
    age: Validate.field("age", "Age")
        .required("Age is required")
        .asInt("Age must be a whole number")
        .min(13, "You must be at least 13 years old")
        .max(120, "Please enter a valid age"),
    
    termsAccepted: Validate.field("terms", "Terms Acceptance")
        .required("You must accept the terms and conditions")
        .is(true, "You must accept the terms to continue"),
    
    zipCode: Validate.field("zipCode", "Zip Code")
        .required("Zip code is required")
        .hasLength(5, "Zip code must be exactly 5 digits")
        .asNumber("Zip code must contain only numbers")
};

function validateRegistration(formData) {
    const errors = {};
    
    // Validate each field
    for (const [field, validator] of Object.entries(registrationValidators)) {
        const result = validator.validate(formData[field]);
        if (!result.isValid) {
            errors[field] = result.errorMessage;
        }
    }
    
    // Custom password match validation
    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
```

### Example 2: Product Form Validation
```javascript
const productValidators = {
    name: Validate.field("name", "Product Name")
        .required()
        .hasMinLength(3)
        .hasMaxLength(100),
    
    sku: Validate.field("sku", "SKU")
        .required()
        .hasLength(12)
        .withExpression(/^[A-Z]{3}-\d{4}-[A-Z0-9]{4}$/),
    
    price: Validate.field("price", "Price")
        .required()
        .asFloat()
        .min(0.01)
        .max(99999.99),
    
    salePrice: Validate.field("salePrice", "Sale Price")
        .asFloat()
        .min(0),
    
    category: Validate.field("category", "Category")
        .required()
        .in(["electronics", "clothing", "food", "books", "other"]),
    
    availableFrom: Validate.field("availableFrom", "Available From")
        .required()
        .asDate()
        .isDateOnOrAfter(() => new Date()),
    
    description: Validate.field("description", "Description")
        .hasMaxLength(1000)
        .hasNoBrackets(),
    
    tags: Validate.field("tags", "Tags")
        .hasMaxLength(200)
};

// Validate with conditional logic
function validateProduct(product) {
    const errors = {};
    
    // Standard validation
    for (const [field, validator] of Object.entries(productValidators)) {
        if (product[field] !== undefined) {
            const result = validator.validate(product[field]);
            if (!result.isValid) {
                errors[field] = result.errorMessage;
            }
        }
    }
    
    // Conditional validation: sale price must be less than regular price
    if (product.salePrice && product.price) {
        if (product.salePrice >= product.price) {
            errors.salePrice = "Sale price must be less than regular price";
        }
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
}
```

### Example 3: Dynamic Configuration Validation
```javascript
function createConfigValidator(config) {
    const validators = {};
    
    // API Configuration
    if (config.enableAPI) {
        validators.apiKey = Validate.field("apiKey", "API Key")
            .required()
            .hasMinLength(32)
            .asAlphaNumericText();
            
        validators.apiEndpoint = Validate.field("apiEndpoint", "API Endpoint")
            .required()
            .asSecureUrl();
    }
    
    // Email Configuration
    if (config.enableEmail) {
        validators.smtpHost = Validate.field("smtpHost", "SMTP Host")
            .required()
            .containsText(".");
            
        validators.smtpPort = Validate.field("smtpPort", "SMTP Port")
            .required()
            .asInt()
            .in([25, 465, 587, 2525]);
            
        validators.fromEmail = Validate.field("fromEmail", "From Email")
            .required()
            .asEmail();
    }
    
    // Database Configuration
    validators.dbConnectionString = Validate.field("dbConnectionString", "Database Connection")
        .required()
        .hasMinLength(10);
        
    validators.maxConnections = Validate.field("maxConnections", "Max Connections")
        .required()
        .asInt()
        .min(1)
        .max(100);
    
    return validators;
}

// Usage
const config = {
    enableAPI: true,
    enableEmail: false,
    // ... other config
};

const validators = createConfigValidator(config);
```

### Example 4: Fixed-Length Field Validation
```javascript
// Common use cases for hasLength() validation
const fixedLengthValidators = {
    // US Social Security Number (9 digits, no dashes)
    ssn: Validate.field("ssn", "Social Security Number")
        .required()
        .hasLength(9)
        .asNumber(),
    
    // Credit Card CVV (3 or 4 digits depending on card type)
    cvv: Validate.field("cvv", "CVV")
        .required()
        .hasLength(3) // Most cards use 3 digits
        .asNumber(),
    
    // Product batch code (exactly 8 alphanumeric characters)
    batchCode: Validate.field("batchCode", "Batch Code")
        .required()
        .hasLength(8)
        .asAlphaNumericText(),
    
    // US ZIP code (exactly 5 digits)
    zipCode: Validate.field("zipCode", "ZIP Code")
        .required()
        .hasLength(5)
        .asNumber(),
    
    // International phone number country code (2-3 digits)
    countryCode: Validate.field("countryCode", "Country Code")
        .required()
        .hasLengthRange(2, 3)
        .asNumber(),
    
    // Two-factor authentication code (6 digits)
    authCode: Validate.field("authCode", "Authentication Code")
        .required()
        .hasLength(6)
        .asNumber(),
    
    // License plate (variable length by state, this example: 7 chars)
    licensePlate: Validate.field("licensePlate", "License Plate")
        .required()
        .hasLength(7)
        .asAlphaNumericText(),
    
    // ISBN-10 (exactly 10 characters)
    isbn10: Validate.field("isbn10", "ISBN-10")
        .hasLength(10)
        .asAlphaNumericText() // Can include 'X' as check digit
};

// Dynamic length validation example
function createDynamicValidator(config) {
    return {
        customId: Validate.field("customId", "Custom ID")
            .required()
            .hasLength(() => config.idLength)
            .asAlphaNumericText(),
            
        securityCode: Validate.field("securityCode", "Security Code")
            .required()
            .hasLength(() => config.securityCodeLength)
            .asNumber()
    };
}

// Usage with different configurations
const config1 = { idLength: 8, securityCodeLength: 4 };
const config2 = { idLength: 12, securityCodeLength: 6 };

const validator1 = createDynamicValidator(config1);
const validator2 = createDynamicValidator(config2);
```

### Example 5: Batch Data Validation
```javascript
function createCSVRowValidator() {
    return {
        id: Validate.field("id", "ID")
            .required()
            .asGuid(),
            
        timestamp: Validate.field("timestamp", "Timestamp")
            .required()
            .asDate(),
            
        amount: Validate.field("amount", "Amount")
            .required()
            .asFloat()
            .min(0),
            
        currency: Validate.field("currency", "Currency")
            .required()
            .withExpression(/^[A-Z]{3}$/),
            
        status: Validate.field("status", "Status")
            .required()
            .in(["pending", "completed", "failed", "refunded"])
    };
}

function validateCSVData(rows) {
    const validators = createCSVRowValidator();
    const results = [];
    
    rows.forEach((row, index) => {
        const rowErrors = {};
        let hasErrors = false;
        
        for (const [field, validator] of Object.entries(validators)) {
            const result = validator.validate(row[field]);
            if (!result.isValid) {
                rowErrors[field] = result.errorMessage;
                hasErrors = true;
            }
        }
        
        results.push({
            row: index + 1,
            isValid: !hasErrors,
            errors: rowErrors,
            data: row
        });
    });
    
    return {
        totalRows: rows.length,
        validRows: results.filter(r => r.isValid).length,
        invalidRows: results.filter(r => !r.isValid).length,
        results
    };
}
```

## Best Practices

### 1. Field Naming Convention
Always provide both technical field name and display name:
```javascript
// Good
Validate.field("emailAddress", "Email Address")

// Less informative
Validate.field("email")
```

### 2. Order Validators Logically
Place validators from most to least restrictive:
```javascript
// Good order
Validate.field("username", "Username")
    .required()           // Check existence first
    .asAlphaNumericText() // Then check format
    .hasMinLength(3)      // Then check constraints
    .hasMaxLength(20)

// Less optimal
Validate.field("username", "Username")
    .hasMaxLength(20)
    .asAlphaNumericText()
    .hasMinLength(3)
    .required()
```

### 3. Use Functions for Dynamic Values
When validation depends on runtime values:
```javascript
// Good - function evaluated at validation time
Validate.field("endDate", "End Date")
    .isDateOnOrAfter(() => document.getElementById('startDate').value)

// Bad - value fixed at validator creation
Validate.field("endDate", "End Date")
    .isDateOnOrAfter(document.getElementById('startDate').value)
```

### 4. Handle Empty Values Appropriately
Remember most validators pass on empty values:
```javascript
// This allows empty values
Validate.field("email", "Email").asEmail()

// This requires a value and validates format
Validate.field("email", "Email").required().asEmail()
```

### 5. Custom Error Messages
All validator methods support custom error messages through an optional `errorMessage` parameter. When provided, your custom message replaces the default validator error message.

#### Basic Custom Error Messages
```javascript
// Custom error message for required validation
Validate.field("email", "Email Address")
    .required("Please enter your email address")
    .validate("");
// Error: "Email Address Please enter your email address"

// Custom error message for format validation
Validate.field("phone", "Phone Number")
    .asPhoneNumber("Enter a valid phone number format")
    .validate("invalid");
// Error: "Phone Number Enter a valid phone number format"
```

#### All Methods Support Custom Messages
Every fluent API method accepts an optional `errorMessage` parameter:
```javascript
// Core validators
.required("This field is mandatory")
.asBoolean("Must be true or false")
.asEmail("Enter a valid email address")
.asPhoneNumber("Invalid phone number format")
.asAlphaText("Only letters and spaces allowed")
.asAlphaNumericText("Only letters and numbers allowed")
.asAlphaNumericHyphenText("Only letters, numbers, spaces and hyphens")
.asName("Enter a valid name")

// Number validators
.asNumber("Must be a numeric value")
.asInt("Must be a whole number")
.asFloat("Must be a decimal number")
.min(10, "Value must be at least 10")
.max(100, "Value cannot exceed 100")

// Length validators
.hasMinLength(5, "Too short - minimum 5 characters")
.hasMaxLength(20, "Too long - maximum 20 characters")
.hasLength(8, "Must be exactly 8 characters")
.hasLengthRange(3, 15, "Must be between 3 and 15 characters")

// Value validators
.is("expected", "Must match expected value")
.isNot("forbidden", "This value is not allowed")
.in(["red", "green", "blue"], "Please select a valid color")
.notIn(["admin", "root"], "Username not allowed")
.isNull("Must be null")
.isEmptyString("Must be empty")

// Text content validators
.containsText("password", false, "Must contain the word 'password'")
.doesNotContainText("spam", false, "Cannot contain spam")

// Date validators
.asDate("Enter a valid date")
.isDateOnOrAfter(minDate, "Date is too early")
.isDateOnOrBefore(maxDate, "Date is too late")
.isDateBetween(start, end, "Date must be within range")

// Format validators
.asGuid("Must be a valid GUID")
.asHexColor("Enter a valid hex color code")
.asUrl("Must be a valid URL")
.asSecureUrl("Must be a secure HTTPS URL")
```

#### Chaining with Custom Messages
```javascript
const validator = Validate.field("password", "Password")
    .required("Password is required")
    .hasMinLength(8, "Password must be at least 8 characters")
    .containsText("A", false, "Password must contain uppercase letters");

const result = validator.validate("abc");
// Multiple errors: "Password Password must be at least 8 characters. Password Password must contain uppercase letters"
```

#### Mixed Custom and Default Messages
```javascript
const validator = Validate.field("username", "Username")
    .required("Username is required")
    .asAlphaNumericText() // uses default message
    .hasLengthRange(3, 20, "Username must be 3-20 characters");

const result = validator.validate("user@name");
// Error: "Username must contain only letters and numbers (no spaces or special characters)"
```

#### Custom Messages Override Defaults
```javascript
// Without custom message
Validate.field("age", "Age").asInt().validate("12.5");
// Error: "Age is not a valid whole number"

// With custom message
Validate.field("age", "Age").asInt("Please enter your age as a whole number").validate("12.5");
// Error: "Age Please enter your age as a whole number"
```

### 6. Reuse Validators
Create validator objects for common fields:
```javascript
// Define once
const validators = {
    email: Validate.field("email", "Email").required().asEmail(),
    phone: Validate.field("phone", "Phone Number").asPhoneNumber(),
    url: Validate.field("url", "Website").asUrl()
};

// Reuse everywhere
function validateContact(data) {
    return validators.email.validate(data.email);
}

function validateProfile(data) {
    return validators.email.validate(data.email);
}
```

### 7. Combine with Form Libraries
LightJx works well with form libraries:
```javascript
// React example pattern
const useValidator = (validator) => {
    const [error, setError] = useState('');
    
    const validate = (value) => {
        const result = validator.validate(value);
        setError(result.isValid ? '' : result.errorMessage);
        return result.isValid;
    };
    
    return { error, validate };
};
```

### 8. Server-Side Validation
Always validate on the server, even with client validation:
```javascript
// Express.js middleware pattern
const validateRequest = (validators) => {
    return (req, res, next) => {
        const errors = {};
        
        for (const [field, validator] of Object.entries(validators)) {
            const result = validator.validate(req.body[field]);
            if (!result.isValid) {
                errors[field] = result.errorMessage;
            }
        }
        
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }
        
        next();
    };
};
```

## Key Concepts Summary

1. **Fluent API**: Chain validators for readable validation rules
2. **Empty Value Handling**: Most validators pass on empty values unless `.required()` is used
3. **Dynamic Functions**: Many validators accept functions for runtime values
4. **Error Context**: Display names are automatically included in error messages
5. **Type Flexibility**: Validators intelligently handle different input types
6. **Validation Flow**: All validators run and collect errors (doesn't stop on first error)

## Common Pitfalls

1. **Forgetting `.required()`**: Validators pass empty values by default
2. **Wrong validator order**: Put format validators before length validators
3. **Static vs Dynamic values**: Use functions for values that change
4. **Type mismatches**: Some validators work with strings, others with specific types
5. **Case sensitivity**: Text validators are case-sensitive by default

This guide provides comprehensive coverage of LightJx for AI developers. Use it to understand available validators, implementation patterns, and best practices for effective validation.