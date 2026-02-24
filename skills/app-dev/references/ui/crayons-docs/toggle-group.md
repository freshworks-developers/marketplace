>title: toggle-group - Usage in HTML
>tags: 
>context: toggle-group
>content:

# Toggle Group (fw-toggle-group)
## Usage in HTML

```html
<fw-toggle-group
name="Test toggle group"
selected-values="bb,cc">
<fw-toggle-group-button
header="Header A"
description="This is a sample description of the card component."
value="aa"></fw-toggle-group-button>
<fw-toggle-group-button
header="Header B"
description="This is a sample description of the card component."
value="bb"></fw-toggle-group-button>
<fw-toggle-group-button
header="Header C"
description="This is a sample description of the card component."
value="cc"></fw-toggle-group-button>
<fw-toggle-group-button
header="Header D"
value="dd"></fw-toggle-group-button>
<fw-toggle-group-button
header="Header E"
value="ee"></fw-toggle-group-button>
</fw-toggle-group>
<fw-toggle-group
name="Test icon toggle group"
selected-values="gg">
<fw-toggle-group-button
icon-name="phone"
value="aa"
type="icon"></fw-toggle-group-button>
<fw-toggle-group-button
icon-name="agent"
value="bb"
type="icon"></fw-toggle-group-button>
<fw-toggle-group-button
icon-name="delete"
value="cc"
type="icon"></fw-toggle-group-button>
<fw-toggle-group-button
icon-name="check"
value="dd"
type="icon"></fw-toggle-group-button>
</fw-toggle-group>
````

---
>title: toggle-group - Usage in React
>tags: 
>context: toggle-group, react
>content:

# Toggle Group (fw-toggle-group)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FWToggleGroupButton, FwToggleGroup } from '@Freshworks/crayons/react'
function App() {
return (<div>
<FwToggleGroup selectedValues="bb" multiple={true} onFwChange={toggleChangeHandler}>
<FWToggleGroupButton key="aa" value="aa" header="Header 1" description="This is a sample description 1"/>
<FWToggleGroupButton key="bb" value="bb" header="Header 2" description="This is a sample description 2"/>
<FWToggleGroupButton key="cc" value="cc" header="Header 2" description="This is a sample description 2"/>
</FwToggleGroup>
</div>);
}
````

---
>title: Usage in toggle-group
>tags: 
>context: toggle-group
>content:

# Toggle Group (fw-toggle-group)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in toggle-group
>tags: 
>context: toggle-group
>content:

# Toggle Group (fw-toggle-group)
## Properties



Property: `label`
Attribute: `label`
Description: Label for the component, that can be used by screen readers.
Type: `string`
Default: `''`


Property: `multiple`
Attribute: `multiple`
Description: Boolean value to allow multiple selection or single child selection
Type: `boolean`
Default: `false`


Property: `name`
Attribute: `name`
Description: Name of the component, saved as part of form data.
Type: `string`
Default: `''`


Property: `value`
Attribute: `value`
Description: Selected items to be shown - stored in array format - if property "multiple" is set to false, this will always be a single value array
Type: `any`
Default: `null`
---
>title: Events in toggle-group
>tags: 
>context: toggle-group
>content:

# Toggle Group (fw-toggle-group)
## Events



Event: `fwChange`
Description: Triggered when an option in the Toggle Group is selected or deselected.
Type: `CustomEvent<any>`
---
>title: How to use toggle-group in crayons ?
>tags: 
>context: toggle-group
>content:

# Toggle Group (fw-toggle-group)
fw-toggle-group displays a group of components like card button/icon button and enables to select either one option or select/deselect multiple options.
## Demo
```html live
<fw-toggle-group
  name="Test toggle group"
  selected-values="bb,cc"
  multiple="true"
>
  <fw-toggle-group-button
    header="Header A"
    description="This is a sample description of the card component."
    value="aa"
  ></fw-toggle-group-button>
  <fw-toggle-group-button
    header="Header B"
    description="This is a sample description of the card component."
    value="bb"
  ></fw-toggle-group-button>
  <fw-toggle-group-button
    header="Header C"
    description="This is a sample description of the card component."
    value="cc"
  ></fw-toggle-group-button>
  <fw-toggle-group-button header="Header D" value="dd"></fw-toggle-group-button>
  <fw-toggle-group-button header="Header E" value="ee"></fw-toggle-group-button>
  <fw-toggle-group-button header="Header F" value="ff"></fw-toggle-group-button>
</fw-toggle-group>
```
<!-- Auto Generated Below -->
## Methods
### `setSelectedValues(values: string | string[]) => Promise<void>`
#### Returns
Type: `Promise<void>`
----------------------------------------------
Built with ❤ at Freshworks

---
