>title: toggle-group-button - Usage in HTML
>tags: 
>context: toggle-group-button
>content:

# Toggle Group Button (fw-toggle-group-button)
## Usage in HTML

```html
<fw-toggle-group-button
header="Header A"
description="This is a sample description of the card component."
value="aa">
</fw-toggle-group-button>
<fw-toggle-group-button value="bb" type="icon">
<fw-icon slot="toggle-icon" size="16" name="agent" />
</fw-toggle-group-button>
````

---
>title: toggle-group-button - Usage in React
>tags: 
>context: toggle-group-button, react
>content:

# Toggle Group Button (fw-toggle-group-button)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FWToggleGroupButton } from '@Freshworks/crayons/react'
function App() {
return (<div>
<FWToggleGroupButton key="aa" value="aa" header="Header 1" description="This is a sample description 1" isCheckbox={true}/>
<FWToggleGroupButton key="cc" value="cc" type="icon"><FwIcon slot="toggle-icon" size={16} name="agent" /></FWToggleGroupButton>
</div>);
}
````

---
>title: Usage in toggle-group-button
>tags: 
>context: toggle-group-button
>content:

# Toggle Group Button (fw-toggle-group-button)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in toggle-group-button
>tags: 
>context: toggle-group-button
>content:

# Toggle Group Button (fw-toggle-group-button)
## Properties



Property: `baseClassName`
Attribute: `base-class-name`
Description: sets the default base class name and the rest of the class names for the other states are automatically appended to this
Type: `string`
Default: `'fw-card-radio'`


Property: `description`
Attribute: `description`
Description: Label displayed as description in the card.
Type: `string`
Default: `''`


Property: `disabled`
Attribute: `disabled`
Description: Disables the component on the interface. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `header`
Attribute: `header`
Description: Label displayed as header in the card.
Type: `string`
Default: `''`


Property: `index`
Attribute: `index`
Description: index attached inside the parent group component
Type: `number`
Default: `-1`


Property: `isCheckbox`
Attribute: `is-checkbox`
Description: Enables the component to be used as a part of multi selection group
Type: `boolean`
Default: `false`


Property: `name`
Attribute: `name`
Description: Name of the component, saved as part of the form data.
Type: `string`
Default: `''`


Property: `selectable`
Attribute: `selectable`
Description: Enables the component to be used as a toggle button or just to be used as a normal button
Type: `boolean`
Default: `true`


Property: `selected`
Attribute: `selected`
Description: Sets the state to selected. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `type`
Attribute: `type`
Description: sets the type of the button
Type: `"card" \| "custom" \| "icon"`
Default: `'card'`


Property: `value`
Attribute: `value`
Description: Identifier corresponding to the component, that is saved when the form data is saved.
Type: `string`
Default: `''`
---
>title: Events in toggle-group-button
>tags: 
>context: toggle-group-button
>content:

# Toggle Group Button (fw-toggle-group-button)
## Events



Event: `fwToggled`
Description: Triggered when the card in focus is selected.
Type: `CustomEvent<any>`
---
>title: CSS Custom Properties in toggle-group-button
>tags: 
>context: toggle-group-button
>content:

# Toggle Group Button (fw-toggle-group-button)
## CSS Custom Properties



Name: `--fw-toggle-group-button-card-description-max-height`
Description: maximum height for the description text.


Name: `--fw-toggle-group-button-card-description-max-lines`
Description: maximum lines that can be displayed for description text.


Name: `--fw-toggle-group-button-card-height`
Description: height of the content.


Name: `--fw-toggle-group-button-card-width`
Description: width of the card.


Name: `--fw-toggle-group-button-icon-button-height`
Description: defines the height of the icon toggle button - default is 36px


Name: `--fw-toggle-group-button-icon-button-width`
Description: defines the width of the icon toggle button - default is 42px
---
>title: How to use toggle-group-button in crayons ?
>tags: 
>context: toggle-group-button
>content:

# Toggle Group Button (fw-toggle-group-button)
fw-toggle-group-button displays a button on the user interface and enables performing specific actions based on the button type. This button can be used as a card or an icon button
## Demo
```html live
<section>
  <fw-label value="Icon button"></fw-label>
  <fw-toggle-group-button value="aa" type="icon">
    <fw-icon slot="toggle-icon" size="16" name="phone" />
  </fw-toggle-group-button>
  <fw-toggle-group-button value="dd" type="icon">
    <fw-icon slot="toggle-icon" size="16" name="delete" />
  </fw-toggle-group-button>
</section>
<br />
<section>
  <fw-label value="Card button"></fw-label>
  <fw-toggle-group-button
    header="Header A"
    description="This is a sample description of the card component."
    value="aa"
    is-checkbox
  ></fw-toggle-group-button>
</section>
```
<!-- Auto Generated Below -->
## Methods
### `setFocus() => Promise<void>`
Public method exposed to set the focus for the button component - to be used for accessibility
#### Returns
Type: `Promise<void>`

---
