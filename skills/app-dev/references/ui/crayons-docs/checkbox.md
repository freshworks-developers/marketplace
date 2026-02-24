>title: checkbox - Usage in HTML
>tags: 
>context: checkbox
>content:

# Checkbox (fw-checkbox)
## Usage in HTML

```html
<fw-checkbox checked description="Agree or Disagree">Select to agree</fw-checkbox><br><br>
<fw-checkbox checked disabled value="dcb">Disabled check box</fw-checkbox>
```

---
>title: checkbox - Usage in React
>tags: 
>context: checkbox, react
>content:

# Checkbox (fw-checkbox)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwCheckbox } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwCheckbox checked description="Agree or Disagree">Select to agree</FwCheckbox><br/><br/>
<FwCheckbox checked disabled value="dcb">Disabled check box</FwCheckbox>
</div>)
}
```

---
>title: Usage in checkbox
>tags: 
>context: checkbox
>content:

# Checkbox (fw-checkbox)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in checkbox
>tags: 
>context: checkbox
>content:

# Checkbox (fw-checkbox)
## Properties



Property: `checked`
Attribute: `checked`
Description: Sets the state of the check box to selected. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `description`
Attribute: `description`
Description: Description to be displayed for the checkbox.
Type: `string`
Default: `''`


Property: `disabled`
Attribute: `disabled`
Description: Disables the check box on the interface. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `errorText`
Attribute: `error-text`
Description: Error text displayed below the radio group.
Type: `string`
Default: `''`


Property: `hintText`
Attribute: `hint-text`
Description: /**   Hint text displayed below the radio group.
Type: `string`
Default: `''`


Property: `label`
Attribute: `label`
Description: <span style="color:red">**[DEPRECATED]**</span> Use `description` instead. Label displayed on the interface, for the check box.<br/><br/>
Type: `string`
Default: `''`


Property: `name`
Attribute: `name`
Description: Name of the component, saved as part of form data.
Type: `string`
Default: `''`


Property: `required`
Attribute: `required`
Description: Specifies the input box as a mandatory field and displays an asterisk next to the label. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `state`
Attribute: `state`
Description: Theme based on which the checkbox is styled.
Type: `"error" \| "normal" \| "warning"`
Default: `'normal'`


Property: `value`
Attribute: `value`
Description: Identifier corresponding to the component, that is saved when the form data is saved.
Type: `string`
Default: `''`


Property: `warningText`
Attribute: `warning-text`
Description: Warning text displayed below the radio group.
Type: `string`
Default: `''`
---
>title: Events in checkbox
>tags: 
>context: checkbox
>content:

# Checkbox (fw-checkbox)
## Events



Event: `fwBlur`
Description: Triggered when the check box loses focus.
Type: `CustomEvent<any>`


Event: `fwChange`
Description: Triggered when the checkbox state is modified.
Type: `CustomEvent<any>`


Event: `fwFocus`
Description: Triggered when the check box comes into focus.
Type: `CustomEvent<void>`
---
>title: CSS Custom Properties in checkbox
>tags: 
>context: checkbox
>content:

# Checkbox (fw-checkbox)
## CSS Custom Properties



Name: `--fw-error-color`
Description: Color of the error text.


Name: `--fw-hint-color`
Description: Color of the hint text.


Name: `--fw-warning-color`
Description: Color of the warning text.
---
>title: How to use checkbox in crayons ?
>tags: 
>context: checkbox
>content:

# Checkbox (fw-checkbox)
fw-checkbox displays a check box on the user interface and enables assigning a state (selected or deselected) to it. In the selected state, the check box displayed on the UI is highlighted and contains a check mark. 
## Demo
```html live
<fw-checkbox checked description="Agree or Disagree">Select to agree</fw-checkbox><br><br>
<fw-checkbox checked disabled value="dcb">Disabled check box</fw-checkbox>
```
<!-- Auto Generated Below -->
## Methods
### `setFocus() => Promise<void>`
Sets focus on a `fw-checkbox`.
#### Returns
Type: `Promise<void>`
 

---
