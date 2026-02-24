>title: textarea - Usage in HTML
>tags: 
>context: textarea
>content:

# Textarea (fw-textarea)
## Usage in HTML

```html
<fw-textarea cols=75 rows=5 maxlength=190 minlength=5
label="Address"
warning-text="Do not enter your temporary address"
state="warning"
placeholder="Enter your permanent address"
required>
</fw-textarea>
<fw-textarea cols=75 rows=5
label="Passcode"
error-text="Passcode is incorrect"
state="error"
required>
</fw-textarea>
<h3>`hint-text`, `warning-text`, `error-text` can be passed as slots</h3>
<fw-textarea cols=75 rows=5
label="Location identifier"
placeholder="Enter landmark details"
state="normal">
<div slot="hint-text">Enter location details</div>
</fw-textarea>
<fw-textarea cols=75 rows=1
label="Plot number"
value="not applicable"
disabled
state="normal">
</fw-textarea>
```

---
>title: textarea - Usage in React
>tags: 
>context: textarea, react
>content:

# Textarea (fw-textarea)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwTextarea } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwTextarea cols={75} rows={5} maxlength={190} minlength={5}
label="Address"
warningText="Do not enter your temporary address"
state="warning"
placeholder="Enter your permanent address"
required>
</FwTextarea>
<FwTextarea cols={75} rows={5}
label="Passcode"
errorText="Passcode is incorrect"
state="error"
required>
</FwTextarea>
<h3>`hint-text`, `warning-text`, `error-text` can be passed as slots</h3>
<FwTextarea cols={75} rows={5}
label="Location identifier"
placeholder="Enter landmark details"
state="normal">
<div slot="hint-text">Enter location details</div>
</FwTextarea>
<FwTextarea cols={75} rows={1}
label="Plot number"
value="not applicable"
disabled
state="normal">
</FwTextarea>
</div>);
}
```

---
>title: Usage in textarea
>tags: 
>context: textarea
>content:

# Textarea (fw-textarea)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in textarea
>tags: 
>context: textarea
>content:

# Textarea (fw-textarea)
## Properties



Property: `cols`
Attribute: `cols`
Description: Width of the input box, specified as number of columns.
Type: `number`
Default: `undefined`


Property: `disabled`
Attribute: `disabled`
Description: Disables the text area on the interface. If the attribute’s value is undefined, the value is set to false.
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


Property: `label`
Attribute: `label`
Description: Label displayed on the interface, for the component.
Type: `string`
Default: `''`


Property: `maxRows`
Attribute: `max-rows`
Description: Max number of rows the textarea can create when user writes content greater than regular rows.
Type: `number`
Default: `undefined`


Property: `maxRowsDebounceTimer`
Attribute: `max-rows-debounce-timer`
Description: Debounce timer for setting rows dynamically based on user input and maxRows, default is 200ms.
Type: `number`
Default: `undefined`


Property: `maxlength`
Attribute: `maxlength`
Description: Maximum number of characters a user can enter in the input box.
Type: `number`
Default: `undefined`


Property: `minlength`
Attribute: `minlength`
Description: Minimum number of characters a user must enter in the input box for the value to be valid.
Type: `number`
Default: `undefined`


Property: `name`
Attribute: `name`
Description: Name of the component, saved as part of form data.
Type: `string`
Default: `''`


Property: `placeholder`
Attribute: `placeholder`
Description: Text displayed in the input box before a user enters a value.
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


Property: `resize`
Attribute: `resize`
Description: Specifies the way in which the text area can be resized
Type: `"both" \| "horizontal" \| "none" \| "vertical"`
Default: `'both'`


Property: `rows`
Attribute: `rows`
Description: Height of the input box, specified as number of rows.
Type: `number`
Default: `undefined`


Property: `state`
Attribute: `state`
Description: Theme based on which the input box is styled.
Type: `"error" \| "normal" \| "warning"`
Default: `'normal'`


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


Property: `wrap`
Attribute: `wrap`
Description: Type of text wrapping used by the input box. If the value is hard, the text in the textarea is wrapped (contains line breaks) when the form data is saved. If the value is soft, the text in the textarea is saved as a single line, when the form data is saved.
Type: `"hard" \| "soft"`
Default: `'soft'`
---
>title: Events in textarea
>tags: 
>context: textarea
>content:

# Textarea (fw-textarea)
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
---
>title: CSS Custom Properties in textarea
>tags: 
>context: textarea
>content:

# Textarea (fw-textarea)
## CSS Custom Properties



Name: `--fw-error-color`
Description: Color of the error text.


Name: `--fw-hint-color`
Description: Color of the hint text.


Name: `--fw-textarea-input-color`
Description: Color of the textarea input


Name: `--fw-textarea-margin-bottom`
Description: Bottom margin for the textarea


Name: `--fw-textarea-min-height`
Description: Min-Height of the textarea.


Name: `--fw-textarea-width`
Description: Width of the textarea.


Name: `--fw-warning-color`
Description: Color of the warning text.
---
>title: How to use textarea in crayons ?
>tags: 
>context: textarea
>content:

# Textarea (fw-textarea)
fw-textarea displays an input box on the user interface and enables assigning multi-line text value to it. The size of the input box is based on the cols and rows attributes.
## Demo
```html live
<fw-textarea
  cols="75"
  rows="5"
  maxlength="190"
  minlength="5"
  label="Address"
  warning-text="Do not enter your temporary address"
  state="warning"
  placeholder="Enter your permanent address"
  required
>
</fw-textarea>
<fw-textarea
  cols="75"
  rows="5"
  label="Passcode"
  error-text="Passcode is incorrect"
  state="error"
  required
>
</fw-textarea>
<h3>`hint-text`, `warning-text`, `error-text` can be passed as slots</h3>
<fw-textarea
  cols="75"
  rows="5"
  label="Location identifier"
  placeholder="Enter landmark details"
  state="normal"
>
  <div slot="hint-text">Enter location details</div>
</fw-textarea>
<fw-textarea
  cols="75"
  rows="1"
  label="Plot number"
  value="not applicable"
  disabled
  state="normal"
>
</fw-textarea>
<fw-textarea
  cols="75"
  rows="4"
  max-rows="10"
  label="Description"
>
</fw-textarea>
<fw-textarea
  cols="75"
  rows="4"
  max-rows="10"
  max-rows-debounce-timer="300"
  label="Description"
>
</fw-textarea>
```
<!-- Auto Generated Below -->
## Methods
### `setFocus() => Promise<void>`
Sets focus on a specific `fw-textarea`. Use this method instead of the global `input.focus()`.
#### Returns
Type: `Promise<void>`
 

---
