>title: country-phone - Usage in HTML
>tags: 
>context: country-phone
>content:

# CountryPhone(fw-country-phone)
## Usage in HTML

```html
<fw-country-phone
value=""
name="country-code"
clear-input
select-placeholder="select country code"
input-placeholder="Enter phone number"
required
input-label="Support phone number"
select-label="Country Code"
error-text="Error message text"
warning-text="Please use numbers for user ID"
state="normal"
></fw-country-phone>
<fw-country-phone
value="+919999999999"
name="country-code"
clear-input
select-placeholder="select country code"
input-placeholder="Enter phone number"
required
input-label="Support phone number"
select-label="Country Code"
error-text="Error message text"
warning-text="Please use numbers for user ID"
state="normal"
style="--fw-select-width: 0 0 400px"
></fw-country-phone>
<fw-country-phone
value="+919999999999"
name="country-code"
clear-input
select-placeholder="select country code"
input-placeholder="Enter phone number"
required
input-label="Support phone number"
select-label="Country Code"
hint-text="select country code to get valid phonenumber"
warning-text="Please use numbers for user ID"
state="normal"
></fw-country-phone>
<fw-country-phone
value="+1264497275926449727599878978789798798789798798789787897987897897897878978978787897989878"
name="country-code"
clear-input
select-placeholder="select country code"
input-placeholder="Enter phone number"
required
input-label="Support phone number"
select-label="Country Code"
hint-text="Input hint text"
warning-text="select country code to get valid phonenumber"
state="warning"
></fw-country-phone>
<fw-country-phone
value="+1264497275926449727599878978789798798789798798789787897987897897897878978978787897989878"
name="country-code"
clear-input
select-placeholder="select country code"
input-placeholder="Enter phone number"
required
input-label="Support phone number"
select-label="Country Code"
hint-text="Input hint text"
error-text="Invalid Country Phone Number"
state="error"
></fw-country-phone>
```

---
>title: country-phone - Usage in React
>tags: 
>context: country-phone, react
>content:

# CountryPhone(fw-country-phone)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwCountryPhone } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwCountryPhone
value="+919999999999"
name="country-code"
clearInput
selectPlaceholder="select country code"
inputPlaceholder="Enter phone number"
required
inputLabel="Support phone number"
selectLabel="Country Code"
errorText="Error message text"
warningText="Please use numbers for user ID"
state="normal">
</FwCountryPhone>
<FwCountryPhone
value="+919999999999"
name="country-code"
clearInput
selectPlaceholder="select country code"
inputPlaceholder="Enter phone number"
required
inputLabel="Support phone number"
selectLabel="Country Code"
hintText="select country code to get valid phonenumber"
warningText="Please use numbers for user ID"
state="normal">
</FwCountryPhone>
<FwCountryPhone
value="+1264497275926449727599878978789798798789798798789787897987897897897878978978787897989878"
name="country-code"
clearInput
selectPlaceholder="select country code"
inputPlaceholder="Enter phone number"
required
inputLabel="Support phone number"
selectLabel="Country Code"
hintText="Input hint text"
warningText="select country code to get valid phonenumber"
state="warning"
style={{"--fw-select-width": '0 0 300px'}}
>
</FwCountryPhone>
<FwCountryPhone
value="+1264497275926449727599878978789798798789798798789787897987897897897878978978787897989878"
name="country-code"
clearInput
selectPlaceholder="select country code"
inputPlaceholder="Enter phone number"
required
inputLabel="Support phone number"
selectLabel="Country Code"
hintText="Input hint text"
errorText="Invalid Country Phone Number"
state="error">
</FwCountryPhone>
</div>);
```

---
>title: Usage in country-phone
>tags: 
>context: country-phone
>content:

# CountryPhone(fw-country-phone)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in country-phone
>tags: 
>context: country-phone
>content:

# CountryPhone(fw-country-phone)
## Properties



Property: `clearInput`
Attribute: `clear-input`
Description: Displays a right-justified clear icon in the text box. Clicking the icon clears the input text. If the attribute’s value is undefined, the value is set to false. For a read-only input box, the clear icon is not displayed unless a default value is specified for the input box.
Type: `boolean`
Default: `false`


Property: `countryCodeDefaultValue`
Attribute: `country-code-default-value`
Description: Default countryCode to be displayed.
Type: `string`
Default: `''`


Property: `disabled`
Attribute: `disabled`
Description: Disables the component on the interface. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `errorText`
Attribute: `error-text`
Description: Error text displayed below the text box.
Type: `string`
Default: `''`


Property: `hideCountryFlag`
Attribute: `hide-country-flag`
Description: Hide Country Flag in the Country Select
Type: `boolean`
Default: `false`


Property: `hideCountryName`
Attribute: `hide-country-name`
Description: Hide Country Name in the Country Select
Type: `boolean`
Default: `false`


Property: `hintText`
Attribute: `hint-text`
Description: Hint text displayed below the text box.
Type: `string`
Default: `''`


Property: `inputLabel`
Attribute: `input-label`
Description: * Label displayed on the interface, for the input component.
Type: `string`
Default: `undefined`


Property: `inputPlaceholder`
Attribute: `input-placeholder`
Description: Text displayed in the text box before a user enters a value.
Type: `string`
Default: `undefined`


Property: `name`
Attribute: `name`
Description: Name of the component, saved as part of form data.
Type: `string`
Default: `''`


Property: `readonly`
Attribute: `readonly`
Description: If true, the user cannot enter a value in the input box. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `required`
Attribute: `required`
Description: Specifies the input box as a mandatory field and displays an asterisk next to the label. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `selectLabel`
Attribute: `select-label`
Description: * Label displayed on the interface, for the input component.
Type: `string`
Default: `undefined`


Property: `selectPlaceholder`
Attribute: `select-placeholder`
Description: Text displayed in the text box before a user enters a value.
Type: `string`
Default: `undefined`


Property: `state`
Attribute: `state`
Description: Theme based on which the text box is styled.
Type: `"error" \| "normal" \| "warning"`
Default: `'normal'`


Property: `value`
Attribute: `value`
Description: Default value displayed in the input box & select dropdown after extracting valid phone number
Type: `string`
Default: `''`


Property: `warningText`
Attribute: `warning-text`
Description: Warning text displayed below the text box.
Type: `string`
Default: `''`
---
>title: Events in country-phone
>tags: 
>context: country-phone
>content:

# CountryPhone(fw-country-phone)
## Events



Event: `fwBlur`
Description: Triggered when phone element is blur.
Type: `CustomEvent<any>`


Event: `fwFocus`
Description: Triggered when input is focused.
Type: `CustomEvent<any>`


Event: `fwInput`
Description: Triggered when phone element is input.
Type: `CustomEvent<any>`


Event: `fwInputClear`
Description: Triggered when clear icon is clicked.
Type: `CustomEvent<any>`
---
>title: CSS Custom Properties in country-phone
>tags: 
>context: country-phone
>content:

# CountryPhone(fw-country-phone)
## CSS Custom Properties



Name: `--fw-select-width`
Description: Adjust country code select dropdown width
---
>title: How to use country-phone in crayons ?
>tags: 
>context: country-phone
>content:

#  CountryPhone(fw-country-phone)
fw-country-phone displays a country code selector & input element for entering phone Number
## Demo
```html live
<fw-country-phone
    value=""
    name="country-code"
    clear-input
    select-placeholder="select country code"
    input-placeholder="Enter phone number"
    required
    input-label="Support phone number"
    select-label="Country Code"
    error-text="Error message text"
    warning-text="Please use numbers for user ID"
    state="normal"
  ></fw-country-phone>
<fw-country-phone
    value="+919999999999"
    name="country-code"
    clear-input
    select-placeholder="select country code"
    input-placeholder="Enter phone number"
    required
    input-label="Support phone number"
    select-label="Country Code"
    error-text="Error message text"
    warning-text="Please use numbers for user ID"
    state="normal"
  ></fw-country-phone>
  <fw-country-phone
    value="+919999999999"
    name="country-code"
    clear-input
    select-placeholder="select country code"
    input-placeholder="Enter phone number"
    required
    input-label="Support phone number"
    select-label="Country Code"
    hint-text="select country code to get valid phonenumber"
    warning-text="Please use numbers for user ID"
    state="normal"
  ></fw-country-phone>
  <fw-country-phone
  value="+1264497275926449727599878978789798798789798798789787897987897897897878978978787897989878"
  name="country-code"
  clear-input
  select-placeholder="select country code"
  input-placeholder="Enter phone number"
  required
  input-label="Support phone number"
  select-label="Country Code"
  hint-text="Input hint text"
  warning-text="select country code to get valid phonenumber"
  state="warning"
></fw-country-phone>
  <fw-country-phone
  value="+1264497275926449727599878978789798798789798798789787897987897897897878978978787897989878"
  name="country-code"
  clear-input
  select-placeholder="select country code"
  input-placeholder="Enter phone number"
  required
  input-label="Support phone number"
  select-label="Country Code"
  hint-text="Input hint text"
  error-text="Invalid Country Phone Number"
  state="error"
></fw-country-phone>
```
<!-- Auto Generated Below -->
## Methods
### `isValidPhoneNumber(value: string, countryCode: CountryCode) => Promise<boolean>`
Checks PhoneNumber is Valid or Not
#### Returns
Type: `Promise<boolean>`
after validation PhoneNumber with countryCode
### `parsePhoneNumber(...args: any[]) => Promise<any>`
Validates PhoneNumber provided and return extra details
#### Returns
Type: `Promise<any>`
{countryCode, countryCallingCode, nationalNumber,  number, metadata }

---
