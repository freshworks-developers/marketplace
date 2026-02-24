>title: radio - Usage in HTML
>tags: 
>context: radio
>content:

# Radio (fw-radio)
## Usage in HTML

```html
<fw-radio checked description="Select to agree">Agree or Disagree</fw-radio><br><br>
<fw-radio checked disabled value="dr">Disabled radio</fw-radio>
```

---
>title: radio - Usage in React
>tags: 
>context: radio, react
>content:

# Radio (fw-radio)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwRadio } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwRadio checked description="Select to agree">Agree or Disagree</FwRadio><br/><br/>
<FwRadio checked disabled value="dr">Disabled radio</FwRadio>
</div>);
}
```

---
>title: Usage in radio
>tags: 
>context: radio
>content:

# Radio (fw-radio)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in radio
>tags: 
>context: radio
>content:

# Radio (fw-radio)
## Properties



Property: `checked`
Attribute: `checked`
Description: Sets the state to selected. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `description`
Attribute: `description`
Description: Description to be displayed for the checkbox.
Type: `string`
Default: `''`


Property: `disabled`
Attribute: `disabled`
Description: Disables the component on the interface. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


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


Property: `state`
Attribute: `state`
Description: Theme based on which the radio button is styled.
Type: `"error" \| "normal"`
Default: `'normal'`


Property: `value`
Attribute: `value`
Description: Identifier corresponding to the component, that is saved when the form data is saved.
Type: `string`
Default: `''`
---
>title: Events in radio
>tags: 
>context: radio
>content:

# Radio (fw-radio)
## Events



Event: `fwBlur`
Description: Triggered when the radio button loses focus.
Type: `CustomEvent<any>`


Event: `fwChange`
Description: Triggered when the radio button is toggled.
Type: `CustomEvent<any>`


Event: `fwDeselect`
Description: Triggered when the radio button in focus is cleared.
Type: `CustomEvent<any>`


Event: `fwFocus`
Description: Triggered when the radio button comes into focus.
Type: `CustomEvent<void>`


Event: `fwSelect`
Description: /**   Triggered when the radio button in focus is selected.
Type: `CustomEvent<any>`
---
>title: How to use radio in crayons ?
>tags: 
>context: radio
>content:

# Radio (fw-radio)
fw-radio displays a radio button on the user interface and enables assigning a state (selected or deselected) to it. In the selected state, the button displayed is highlighted. fw-radio provides child elements for fw-radio-group, to populate the Radio Group component’s list. 
## Demo
```html live
<fw-radio checked description="Select to agree">Agree or Disagree</fw-radio><br><br>
<fw-radio checked disabled value="dr">Disabled radio</fw-radio>
```
<!-- Auto Generated Below -->
## Methods
### `setFocus() => Promise<void>`
Sets focus on a specific `fw-radio`.
#### Returns
Type: `Promise<void>`
 

---
