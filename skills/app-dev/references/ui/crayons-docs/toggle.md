>title: toggle - Usage in HTML
>tags: 
>context: toggle
>content:

# Toggle (fw-toggle)
## Usage in HTML

```html
<fw-toggle size="small"></fw-toggle><br><br>
<fw-toggle size="medium" checked></fw-toggle>
```

---
>title: toggle - Usage in React
>tags: 
>context: toggle, react
>content:

# Toggle (fw-toggle)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwToggle } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwToggle size="small"></FwToggle><br/><br/>
<FwToggle size="medium" checked></FwToggle>
</div>);
}
```

---
>title: Usage in toggle
>tags: 
>context: toggle
>content:

# Toggle (fw-toggle)
## Usage

<!-- Auto Generated Below -->
---
>title: Properties in toggle
>tags: 
>context: toggle
>content:

# Toggle (fw-toggle)
## Properties



Property: `checked`
Attribute: `checked`
Description: Sets the selected state as the default state. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `disabled`
Attribute: `disabled`
Description: Specifies whether to disable the control on the interface. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `label`
Attribute: `label`
Description: Label for the component, that can be used by screen readers.
Type: `string`
Default: `''`


Property: `name`
Attribute: `name`
Description: Name of the component, saved as part of the form data.
Type: `string`
Default: `''`


Property: `showIcon`
Attribute: `show-icon`
Description: Specifies whether to show the check and cancel icons on toggle button. If the attribute’s value is undefined, the value is set to true.
Type: `boolean`
Default: `true`


Property: `size`
Attribute: `size`
Description: Size of the input control.
Type: `"large" \| "medium" \| "small"`
Default: `'medium'`
---
>title: Events in toggle
>tags: 
>context: toggle
>content:

# Toggle (fw-toggle)
## Events



Event: `fwChange`
Description: Triggered when the input control is selected or deselected.
Type: `CustomEvent<any>`
---
>title: How to use toggle in crayons ?
>tags: 
>context: toggle
>content:

# Toggle (fw-toggle)
fw-toggle displays an input control that enables modifying an element’s state between two settings. 
## Demo
```html live
<fw-toggle size="small"></fw-toggle><br><br>
<fw-toggle size="medium" checked></fw-toggle>
```
<!-- Auto Generated Below -->

---
