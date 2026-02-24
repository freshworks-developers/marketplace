>title: select-option - Usage in HTML
>tags: 
>context: select-option
>content:

# Select Option (fw-select-option)
## Usage in HTML

```html
<fw-select-option selected="true">I am the chosen one</fw-select-option>
<fw-select-option html html-content="<b>Me, nein</b>"></fw-select-option>
<fw-select-option>I am another option</fw-select-option>
```

---
>title: select-option - Usage in React
>tags: 
>context: select-option, react
>content:

# Select Option (fw-select-option)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwSelectOption } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwSelectOption selected>I am the chosen one</FwSelectOption>
<FwSelectOption html htmlContent="<b>Me, nein</b>"></FwSelectOption>
<FwSelectOption>I am another option</FwSelectOption>
</div>);
}
```

---
>title: Demo - Variants in select-option
>tags: 
>context: select-option
>content:

# Select Option (fw-select-option)
## Usage
#### Demo - Variants
```html live
<fw-select-option text="Standard Variant"></fw-select-option>
<fw-select-option
text="Standard Variant"
sub-text="This is multiline element"
></fw-select-option>
<fw-select-option
checkbox
text="Checkbox Variant"
sub-text="This is multiline checkbox element"
></fw-select-option>
<fw-select-option
checkbox
hide-tick
text="Checkbox Variant Without Tick Mark"
sub-text="This is multiline checkbox element"
></fw-select-option>
```
---
>title: select-option - Usage - Variants in HTML
>tags: 
>context: select-option
>content:

# Select Option (fw-select-option)
## Usage
#### Usage - Variants in HTML

```html
<fw-select-option text="Standard Variant"></fw-select-option>
<fw-select-option
text="Standard Variant"
sub-text="This is multiline element"
></fw-select-option>
<fw-select-option
checkbox
text="Checkbox Variant"
sub-text="This is multiline checkbox element"
></fw-select-option>
```

---
>title: select-option - Usage - Variants in React
>tags: 
>context: select-option, react
>content:

# Select Option (fw-select-option)
## Usage
#### Usage - Variants in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwSelectOption } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwSelectOption text="Standard Variant"></FwSelectOption>
<FwSelectOption
text="Standard Variant"
subText="This is multiline element"
></FwSelectOption>
<FwSelectOption
checkbox
text="Checkbox Variant"
subText="This is multiline checkbox element"
></FwSelectOption>
</div>);
}
```

---
>title: Usage - Variants in select-option
>tags: 
>context: select-option
>content:

# Select Option (fw-select-option)
## Usage
#### Usage - Variants
  
<!-- Auto Generated Below -->
---
>title: Properties in select-option
>tags: 
>context: select-option
>content:

# Select Option (fw-select-option)
## Properties



Property: `allowDeselect`
Attribute: `allow-deselect`
Description: Whether clicking on the already selected option disables it.
Type: `boolean`
Default: `true`


Property: `allowSelect`
Attribute: `allow-select`
Description: Whether clicking on option selects it.
Type: `boolean`
Default: `true`


Property: `checkbox`
Attribute: `checkbox`
Description: Place a checkbox.
Type: `boolean`
Default: `false`


Property: `disabled`
Attribute: `disabled`
Description: Sets the state of the option to disabled. The selected option is disabled and greyed out. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `graphicsProps`
Attribute: `graphics-props`
Description: The props for the graphics variant. ex., icon props in case of graphicsType = 'icon'
Type: `any`
Default: `undefined`


Property: `groupName`
Attribute: `group-name`
Description: Used in grouped list, provides the group in which the option belongs
Type: `string`
Default: `undefined`


Property: `hideTick`
Attribute: `hide-tick`
Description: Hide tick mark icon
Type: `boolean`
Default: `false`


Property: `html`
Attribute: `html`
Description: States that the option is an HTML value. If the attribute's value is undefined, the value is set to true.
Type: `boolean`
Default: `false`


Property: `htmlContent`
Attribute: `html-content`
Description: HTML content that is displayed as the option.
Type: `string`
Default: `undefined`


Property: `metaText`
Attribute: --
Description: Third line text in conversation can be metaText additional details etc.
Type: `{ name?: string; email?: string; mobile?: string; }`
Default: `undefined`


Property: `optionText`
Attribute: `option-text`
Description: Alternate text displayed on the interface, in place of the actual HTML content.
Type: `string`
Default: `undefined`


Property: `selected`
Attribute: `selected`
Description: Sets the state of the option to selected. The selected option is highlighted and a check mark is displayed next to it. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `subText`
Attribute: `sub-text`
Description: Second line text can be description etc.
Type: `string`
Default: `undefined`


Property: `text`
Attribute: `text`
Description: The text to be displayed in the option.
Type: `string`
Default: `undefined`


Property: `value`
Attribute: `value`
Description: Value corresponding to the option, that is saved  when the form data is saved.
Type: `number \| string`
Default: `undefined`


Property: `variant`
Attribute: `variant`
Description: Standard is the default option without any graphics other options are icon and avatar which places either the icon or avatar at the beginning of the row. The props for the icon or avatar are passed as an object via the graphicsProps.
Type: `"avatar" \| "conversation" \| "icon" \| "standard"`
Default: `'standard'`
---
>title: Events in select-option
>tags: 
>context: select-option
>content:

# Select Option (fw-select-option)
## Events



Event: `fwBlur`
Description: Triggered when an option loses focus.
Type: `CustomEvent<any>`


Event: `fwFocus`
Description: Triggered when an option is focused.
Type: `CustomEvent<any>`


Event: `fwSelectAttempted`
Description: Triggered when an option is clicked when allowSelect is false.
Type: `CustomEvent<any>`


Event: `fwSelected`
Description: Triggered when an option is selected.
Type: `CustomEvent<any>`
---
>title: How to use select-option in crayons ?
>tags: 
>context: select-option
>content:

# Select Option (fw-select-option)
fw-select-option provides child elements for fw-select, to populate the Select component’s list or drop-down box with values. If fw-select-option is used without the value attribute, when the form data is saved, the value of fw-select is the selected option’s text.
## Demo
```html live
<fw-select-option selected="true">I am the chosen one</fw-select-option>
<fw-select-option html html-content="<b>Me, nein</b>"></fw-select-option>
<fw-select-option>I am another option</fw-select-option>
```
<!-- Auto Generated Below -->
## Methods
### `setFocus() => Promise<any>`
#### Returns
Type: `Promise<any>`
 

---
