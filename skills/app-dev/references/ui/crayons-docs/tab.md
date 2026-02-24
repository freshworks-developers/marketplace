>title: tab - Usage in HTML
>tags: 
>context: tab
>content:

# Tab (fw-tab)
## Usage in HTML

```html
<fw-tab>Personal</fw-tab>
<fw-tab>Official</fw-tab>
```

---
>title: tab - Usage in React
>tags: 
>context: tab, react
>content:

# Tab (fw-tab)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwTab } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwTab>Personal</FwTab>
<FwTab>Official</FwTab>
</div>);
}
```

---
>title: Usage in tab
>tags: 
>context: tab
>content:

# Tab (fw-tab)
## Usage

<!-- Auto Generated Below -->
---
>title: Properties in tab
>tags: 
>context: tab
>content:

# Tab (fw-tab)
## Properties



Property: `active`
Attribute: `active`
Description: Determines whether the tab is active.
Type: `boolean`
Default: `undefined`


Property: `disabled`
Attribute: `disabled`
Description: Disables this tab
Type: `boolean`
Default: `undefined`


Property: `panel`
Attribute: `panel`
Description: The name of the tab panel which this tab controls.
Type: `string`
Default: `undefined`


Property: `tabHeader`
Attribute: `tab-header`
Description: Header for the tab to be displayed.
Type: `string`
Default: `undefined`


Property: `tabName`
Attribute: `tab-name`
Description: Unique name of the tab.
Type: `string`
Default: `undefined`
---
>title: CSS Custom Properties in tab
>tags: 
>context: tab
>content:

# Tab (fw-tab)
## CSS Custom Properties



Name: `--fw-tab-border-block-end`
Description: border bottom style of tab
---
>title: How to use tab in crayons ?
>tags: 
>context: tab
>content:

# Tab (fw-tab)
fw-tab provides child elements for fw-tabs, to enable tab style navigation.
## Demo
```html live
  <fw-tab>Personal</fw-tab>
  <fw-tab>Official</fw-tab>
```
<!-- Auto Generated Below -->

---
