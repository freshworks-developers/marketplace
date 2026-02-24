>title: spinner - Usage in HTML
>tags: 
>context: spinner
>content:

# Spinner (fw-spinner)
## Usage in HTML

```html
<fw-label value="A small loader" color="yellow"></fw-label><br/>
<fw-spinner size="small"></fw-spinner><br/><br/>
<fw-label value="A medium sized loader" color="yellow"></fw-label><br/>
<fw-spinner size="medium" color="green"></fw-spinner>
```

---
>title: spinner - Usage in React
>tags: 
>context: spinner, react
>content:

# Spinner (fw-spinner)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwSpinner } from "@freshworks/crayons/react";
function App() {
return (<div>
<label>A small loader</label><br/>
<FwSpinner size="small"></FwSpinner><br/><br/>
<label>A medium sized loader</label><br/>
<FwSpinner size="medium" color="green"></FwSpinner>
</div>);
}
```

---
>title: Usage in spinner
>tags: 
>context: spinner
>content:

# Spinner (fw-spinner)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in spinner
>tags: 
>context: spinner
>content:

# Spinner (fw-spinner)
## Properties



Property: `color`
Attribute: `color`
Description: Color in which the loader is displayed, specified as a standard CSS color.
Type: `string`
Default: `''`


Property: `size`
Attribute: `size`
Description: Size of the loader.
Type: `"default" \| "large" \| "medium" \| "micro" \| "small"`
Default: `'default'`
---
>title: CSS Custom Properties in spinner
>tags: 
>context: spinner
>content:

# Spinner (fw-spinner)
## CSS Custom Properties



Name: `--fw-spinner-color`
Description: Color of the spinner
---
>title: How to use spinner in crayons ?
>tags: 
>context: spinner
>content:

# Spinner (fw-spinner)
fw-spinner displays a continuous loader on the user interface, to indicate that a system is processing an entity.
## Demo
```html live
<fw-label value="A small loader" color="yellow"></fw-label><br/>
<fw-spinner size="small"></fw-spinner><br/><br/>
<fw-label value="A medium sized loader" color="yellow"></fw-label><br/>
<fw-spinner size="medium" color="green"></fw-spinner>
```
<!-- Auto Generated Below -->
 

---
