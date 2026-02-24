>title: tab-panel - Usage in HTML
>tags: 
>context: tab-panel
>content:

# Tab Panel (fw-tab-panel)
## Usage in HTML

```html
<fw-tab-panel active>This is sample panel content</fw-tab-panel>
```

---
>title: tab-panel - Usage in React
>tags: 
>context: tab-panel, react
>content:

# Tab Panel (fw-tab-panel)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwTabPanel } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwTabPanel active>This is sample panel content</FwTabPanel>
</div>);
}
```

---
>title: Usage in tab-panel
>tags: 
>context: tab-panel
>content:

# Tab Panel (fw-tab-panel)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in tab-panel
>tags: 
>context: tab-panel
>content:

# Tab Panel (fw-tab-panel)
## Properties



Property: `active`
Attribute: `active`
Description: If true sets the panel display to block, none otherwise.
Type: `boolean`
Default: `false`


Property: `name`
Attribute: `name`
Description: The panel name.
Type: `string`
Default: `''`
---
>title: CSS Custom Properties in tab-panel
>tags: 
>context: tab-panel
>content:

# Tab Panel (fw-tab-panel)
## CSS Custom Properties



Name: `--fw-tab-panel-height`
Description: height of the tab container.


Name: `--fw-tab-panel-width`
Description: width of the tab container.
---
>title: How to use tab-panel in crayons ?
>tags: 
>context: tab-panel
>content:

# Tab Panel (fw-tab-panel)
fw-tab-panel is used inside fw-tabs to show tabbed content.
## Demo
```html live
  <fw-tab-panel active>This is sample panel content</fw-tab-panel>
```
<!-- Auto Generated Below -->
 

---
