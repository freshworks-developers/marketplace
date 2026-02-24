>title: input - Usage in HTML
>tags: 
>context: input
>content:

# Input (fw-input)
## Usage in HTML

```html
<fw-input
label="Name"
icon-left="add-contact"
hint-text="Do not enter your user ID"
warning-text="Please use numbers for user ID"
error-text="Invalid user ID"
state="warning"
placeholder="Enter your official name"
required
clear-input
>
</fw-input>
<fw-input
label="Password"
error-text="Password is incorrect"
state="error"
required
clear-input
>
</fw-input>
<h3>`hint-text`, `warning-text`, `error-text` can be passed as slots</h3>
<fw-input
label="Verification Code"
placeholder="Enter the verification code sent to the registered email address"
state="normal"
clear-input
>
<div slot="hint-text">use the verification code sent to your email address</div>
</fw-input>
<fw-input label="Deprecated Field" disabled state="normal" clear-input>
</fw-input>
<fw-input
label="Do Not Modify"
value="Not applicable"
readonly
state="normal"
clear-input
>
</fw-input>
<fw-input value="123" type="number" label="Number Input"></fw-input>
<fw-input
type="number"
min="0"
max="10"
label="Number Input with min and max"
></fw-input>
<fw-input
value="3.001"
type="number"
step="0.1"
max="5"
label="Decimal Input with step and max"
></fw-input>

<h5>You can use group inputs together like below</h5>
<div
style="
display: flex;
--fw-input-border-radius: 4px 0px 0px 4px;
--fw-select-border-radius: 0px 4px 4px 0px;
"
>
<fw-input
label="House Input"
required="true"
placeholder="Your input"
hint-text="enter input"
></fw-input>
<fw-select
style="margin-left: -1px"
label="House Name"
required="true"
value="1"
placeholder="Your choice"
hint-text="Select singluar option"
>
<fw-select-option value="1">Starks</fw-select-option>
<fw-select-option value="2">Lannisters</fw-select-option>
</fw-select>
</div>

````

---
>title: input - Usage in React
>tags: 
>context: input, react
>content:

# Input (fw-input)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwInput } from "@freshworks/crayons/react";
function App() {
const style = {
display: "flex";
--fw-input-border-radius: "4px 0px 0px 4px";
--fw-select-border-radius: "0px 4px 4px 0px";
}
return (<div>
<FwInput
label="Name"
iconLeft="add-contact"
hintText="Do not enter your user ID"
warningText="Use only numbers for user ID"
errorText="Invalid user ID"
state="warning"
placeholder="Enter your official name"
required
clearInput>
</FwInput>
<FwInput
label="Password"
errorText="Password is incorrect"
state="error"
required
clearInput>
</FwInput>
<h3>`hint-text`, `warning-text`, `error-text` can be passed as slots</h3>
<FwInput
label="Verification Code"
placeholder="Enter the verification code sent to the registered email address"
state="normal"
clearInput>
<div slot="hint-text">Please use the code sent to your email address</div>
</FwInput>
<FwInput
label="Deprecated Field"
disabled
state="normal"
clearInput>
</FwInput>
<FwInput
label="Do Not Modify"
value="Not applicable"
readonly
state="normal"
clearInput>
</FwInput>
<FwInput value="123" type="number" label="Number Input"></FwInput>
<FwInput type="number" min={0} max={10} label="Number Input with min and max"></FwInput>
<FwInput value="3.001" type="number" step="0.1" max={5}
label="Decimal Input with step and max"
></FwInput>

<h5>You can use group inputs together like below</h5>
<div
style={style}
>
<FwInput
label="House Input"
required={true}
placeholder="Your input"
hint-text="enter input"
></FwInput>
<FwSelect
style={{marginLeft: "-1px"}}
label="House Name"
required={true}
value="1"
placeholder="Your choice"
hint-text="Select singluar option"
>
<FwSelectOption value="1">Starks</FwSelectOption>
<FwSelectOption value="2">Lannisters</FwSelectOption>
</FwSelect>
</div>
</div>);
````  

---
>title: Slots in input
>tags: 
>context: input
>content:

# Input (fw-input)
## Usage
### Slots
Slots can be used to create complex use cases.  
```html live
<template>
<div>
<fw-input value="Searching..." icon-left="search" clear-input>
<fw-spinner slot="input-suffix" size="small"></fw-spinner>
</fw-input>

<fw-input placeholder="DD/MM/YYYY">
<div slot="input-suffix" class="calenderContainer">
<span class="separator"></span>
<fw-icon name="calendar" size="16"></fw-icon>
</div>
</fw-input>
<fw-input placeholder="Type to search">
<div slot="input-prefix" class="tagContainer">
<fw-tag text="Option 1"></fw-tag>
<fw-tag text="Option 2"></fw-tag>
</div>
<fw-icon slot="input-suffix" name="chevron-down" size="8"></fw-icon>
</fw-input>

<h3>
`hint-text`, `warning-text`, `error-text` can also be passed as slots
</h3>
<fw-input
label="Verification Code"
placeholder="Enter the verification code sent to the registered email address"
state="normal"
clear-input
>
<div slot="hint-text">
use the verification code sent to your email address
</div>
</fw-input>
</div>
</template>
<style>
fw-input {
margin: 12px;
}

.calenderContainer {
display: flex;
align-items: center;
}

.separator {
background-color: #cfd7df;
width: 1px;
height: 20px;
margin-inline-end: 4px;
}

.tagContainer {
display: flex;
align-items: center;
flex-wrap: wrap;
margin: 4px;
}

fw-tag {
margin: 0 4px;
}
</style>
```  
<!-- Auto Generated Below -->
---
>title: Properties in input
>tags: 
>context: input
>content:

# Input (fw-input)
## Properties



Property: `autocomplete`
Attribute: `autocomplete`
Description: Specifies whether the browser can display suggestions to autocomplete the text value.
Type: `"off" \| "on"`
Default: `'off'`


Property: `clearInput`
Attribute: `clear-input`
Description: Displays a right-justified clear icon in the text box. Clicking the icon clears the input text. If the attribute’s value is undefined, the value is set to false. For a read-only input box, the clear icon is not displayed unless a default value is specified for the input box.
Type: `boolean`
Default: `false`


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


Property: `hintText`
Attribute: `hint-text`
Description: Hint text displayed below the text box.
Type: `string`
Default: `''`


Property: `iconLeft`
Attribute: `icon-left`
Description: Identifier of the icon that is displayed in the left side of the text box. The attribute’s value must be a valid svg file in the repo of icons (assets/icons).
Type: `string`
Default: `undefined`


Property: `iconRight`
Attribute: `icon-right`
Description: Identifier of the icon that is displayed in the right side of the text box. The attribute’s value must be a valid svg file in the repo of icons (assets/icons).
Type: `string`
Default: `undefined`


Property: `label`
Attribute: `label`
Description: Label displayed on the interface, for the component.
Type: `string`
Default: `''`


Property: `max`
Attribute: `max`
Description: Specifies a maximum value that can be entered for the number/decimal input.
Type: `number`
Default: `undefined`


Property: `maxlength`
Attribute: `maxlength`
Description: Maximum number of characters a user can enter in the text box.
Type: `number`
Default: `undefined`


Property: `min`
Attribute: `min`
Description: Specifies a minimum value that can be entered for the number/decimal input.
Type: `number`
Default: `undefined`


Property: `minlength`
Attribute: `minlength`
Description: Minimum number of characters a user must enter in the text box for the value to be valid.
Type: `number`
Default: `undefined`


Property: `name`
Attribute: `name`
Description: Name of the component, saved as part of form data.
Type: `string`
Default: `''`


Property: `placeholder`
Attribute: `placeholder`
Description: Text displayed in the text box before a user enters a value.
Type: `string`
Default: `undefined`


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


Property: `state`
Attribute: `state`
Description: Theme based on which the text box is styled.
Type: `"error" \| "normal" \| "warning"`
Default: `'normal'`


Property: `step`
Attribute: `step`
Description: The step attribute is used when the type is `number`. It specifies the interval between legal numbers in a number/decimal input element. Works with the min and max attributes to limit the increments at which a value can be set. Possible values are `any` or a positive floating point number. Default value is `any`
Type: `string`
Default: `'any'`


Property: `type`
Attribute: `type`
Description: Type of value accepted as the input value. If a user enters a value other than the specified type, the input box is not populated.
Type: `"email" \| "number" \| "text" \| "url"`
Default: `'text'`


Property: `value`
Attribute: `value`
Description: Default value displayed in the input box.
Type: `string`
Default: `''`


Property: `warningText`
Attribute: `warning-text`
Description: Warning text displayed below the text box.
Type: `string`
Default: `''`
---
>title: Events in input
>tags: 
>context: input
>content:

# Input (fw-input)
## Events



Event: `fwBlur`
Description: Triggered when the input box loses focus.
Type: `CustomEvent<any>`


Event: `fwFocus`
Description: Triggered when the input box comes into focus.
Type: `CustomEvent<void>`


Event: `fwInput`
Description: Triggered when a value is entered in the input box.
Type: `CustomEvent<any>`


Event: `fwInputClear`
Description: Triggered when clear icon is clicked.
Type: `CustomEvent<any>`


Event: `fwInputKeyDown`
Description: Triggered on key down in the input box.
Type: `CustomEvent<any>`
---
>title: CSS Custom Properties in input
>tags: 
>context: input
>content:

# Input (fw-input)
## CSS Custom Properties



Name: `--fw-error-color`
Description: Color of the error text.


Name: `--fw-hint-color`
Description: Color of the hint text.


Name: `--fw-input-border-radius`
Description: Border Radius of the input.


Name: `--fw-label-color`
Description: Color of the label.


Name: `--fw-warning-color`
Description: Color of the warning text.
---
>title: How to use input in crayons ?
>tags: 
>context: input
>content:

# Input (fw-input)
fw-input displays a single-line input box on the user interface and enables assigning a value to it.
## Demo
You can use Input component for handling `Text`, `Number`, `Decimal` user input.
```html live
<fw-input
  label="Name"
  icon-left="add-contact"
  hint-text="Do not enter your user ID"
  warning-text="Please use numbers for user ID"
  error-text="Invalid user ID"
  state="warning"
  placeholder="Enter your official name"
  required
  clear-input
>
</fw-input>
<fw-input
  label="Password"
  error-text="Password is incorrect"
  state="error"
  required
  clear-input
>
</fw-input>
<h3>`hint-text`, `warning-text`, `error-text` can be passed as slots</h3>
<fw-input
  label="Verification Code"
  placeholder="Enter the verification code sent to the registered email address"
  state="normal"
  clear-input
>
  <div slot="hint-text">
    use the verification code sent to your email address
  </div>
</fw-input>
<fw-input label="Deprecated Field" disabled state="normal" clear-input>
</fw-input>
<fw-input
  label="Do Not Modify"
  value="Not applicable"
  readonly
  state="normal"
  clear-input
>
</fw-input>
<fw-input value="123" type="number" label="Number Input"></fw-input>
<fw-input
  type="number"
  min="0"
  max="10"
  label="Number Input with min and max"
></fw-input>
<fw-input
  value="3.001"
  type="number"
  step="0.1"
  max="5"
  label="Decimal Input with step and max"
></fw-input>
<h5>You can use group inputs together like below</h5>
<div
  style="
        display: flex;
        --fw-input-border-radius: 4px 0px 0px 4px;
        --fw-select-border-radius: 0px 4px 4px 0px;
      "
>
  <fw-input
    label="House Input"
    required="true"
    placeholder="Your input"
    hint-text="enter input"
  ></fw-input>
  <fw-select
    style="margin-left: -1px"
    label="House Name"
    required="true"
    value="1"
    placeholder="Your choice"
    hint-text="Select singluar option"
  >
    <fw-select-option value="1">Starks</fw-select-option>
    <fw-select-option value="2">Lannisters</fw-select-option>
  </fw-select>
</div>
```
## Methods
### `setFocus() => Promise<void>`
Sets focus on a specific `fw-input`. Use this method instead of the global `input.focus()`.
#### Returns
Type: `Promise<void>`
## Shadow Parts
| Part                         | Description |
| ---------------------------- | ----------- |
| `"fw-input-container"`       |             |
| `"fw-input-inner-container"` |             |
 

---
