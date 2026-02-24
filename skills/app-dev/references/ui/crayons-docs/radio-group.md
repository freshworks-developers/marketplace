>title: radio-group - Usage in HTML
>tags: 
>context: radio-group
>content:

# Radio Group (fw-radio-group)
## Usage in HTML

```html
<fw-radio-group name="Profile" value="au" allow-empty>
<fw-radio value="au">Auditory</fw-radio>
<fw-radio value="vi">Visual</fw-radio>
<fw-radio value="re">Restless</fw-radio>
</fw-radio-group>
```

---
>title: radio-group - Usage in React
>tags: 
>context: radio-group, react
>content:

# Radio Group (fw-radio-group)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwRadio, FwRadioGroup } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwRadioGroup name="Profile" value="au" allowEmpty>
<FwRadio value="au">Auditory</FwRadio>
<FwRadio value="vi">Visual</FwRadio>
<FwRadio value="re">Restless</FwRadio>
</FwRadioGroup>
</div>);
}
```

---
>title: Usage in radio-group
>tags: 
>context: radio-group
>content:

# Radio Group (fw-radio-group)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in radio-group
>tags: 
>context: radio-group
>content:

# Radio Group (fw-radio-group)
## Properties



Property: `allowEmpty`
Attribute: `allow-empty`
Description: If true, a radio group can be saved without selecting any option. If an option is selected, the selection can be cleared. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `errorText`
Attribute: `error-text`
Description: Error text displayed below the radio group.
Type: `string`
Default: `''`


Property: `hintText`
Attribute: `hint-text`
Description: Hint text displayed below the radio group.
Type: `string`
Default: `''`


Property: `label`
Attribute: `label`
Description: Label for the component
Type: `string`
Default: `''`


Property: `name`
Attribute: `name`
Description: Name of the component, saved as part of form data.
Type: `string`
Default: `''`


Property: `orientation`
Attribute: `orientation`
Description: Indicates the direction of the radio buttons alignment, defaults to vertical alignment.
Type: `"column" \| "row"`
Default: `'column'`


Property: `required`
Attribute: `required`
Description: Specifies the input radio group as a mandatory field and displays an asterisk next to the label. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `state`
Attribute: `state`
Description: Theme based on which the radio group is styled.
Type: `"error" \| "normal" \| "warning"`
Default: `'normal'`


Property: `value`
Attribute: `value`
Description: Default option that is selected when the radio group is displayed on the interface. Must be a valid value corresponding to the fw-radio components used in the Radio Group.
Type: `any`
Default: `undefined`


Property: `warningText`
Attribute: `warning-text`
Description: Warning text displayed below the radio group.
Type: `string`
Default: `''`
---
>title: Events in radio-group
>tags: 
>context: radio-group
>content:

# Radio Group (fw-radio-group)
## Events



Event: `fwChange`
Description: Triggered when an option in the Radio Group is selected or deselected.
Type: `CustomEvent<any>`
---
>title: How to use radio-group in crayons ?
>tags: 
>context: radio-group
>content:

# Radio Group (fw-radio-group)
fw-radio-group displays a group of options with radio buttons and enables selection of one option from the list. 
## Demo
```html live
<fw-radio-group name="Profile" value="au" allow-empty>
  <fw-radio value="au">Auditory</fw-radio>
  <fw-radio value="vi">Visual</fw-radio>
  <fw-radio value="re">Restless</fw-radio>
</fw-radio-group>
```
<!-- Auto Generated Below -->
## Methods
### `setFocus() => Promise<void>`
Sets focus on a specific `fw-radio`.
#### Returns
Type: `Promise<void>`
 

---
