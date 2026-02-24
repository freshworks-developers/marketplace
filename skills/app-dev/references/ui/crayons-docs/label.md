>title: label - Usage in HTML
>tags: 
>context: label
>content:

# Label (fw-label)
## Usage in HTML

```html
<fw-label value="Meta Information"></fw-label>
<fw-label value="Response Received" color="blue"></fw-label>
<fw-label value="Overdue" color="red"></fw-label>
<fw-label value="New" color="green"></fw-label>
<fw-label value="Pending" color="yellow"></fw-label>
<fw-label value="Archived" color="grey"></fw-label>
```

---
>title: label - Usage in React
>tags: 
>context: label, react
>content:

# Label (fw-label)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwLabel } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwLabel value="Meta Information"></FwLabel>
<FwLabel value="Response Received" color="blue"></FwLabel>
<FwLabel value="Overdue" color="red"></FwLabel>
<FwLabel value="New" color="green"></FwLabel>
<FwLabel value="Pending" color="yellow"></FwLabel>
<FwLabel value="Archived" color="grey"></FwLabel>
</div>);
}
```

---
>title: Usage in label
>tags: 
>context: label
>content:

# Label (fw-label)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in label
>tags: 
>context: label
>content:

# Label (fw-label)
## Properties



Property: `color`
Attribute: `color`
Description: Theme based on which the label is styled.
Type: `"blue" \| "green" \| "grey" \| "normal" \| "red" \| "yellow"`
Default: `'normal'`


Property: `value`
Attribute: `value`
Description: Display text in the label.
Type: `string`
Default: `''`
---
>title: CSS Custom Properties in label
>tags: 
>context: label
>content:

# Label (fw-label)
## CSS Custom Properties



Name: `--fw-label-padding-horizontal`
Description: Left - Right padding if direction is left-to-right, and Right - Left padding if direction is right-to-left for label


Name: `--fw-label-padding-vertical`
Description: Top - bottom padding for label
---
>title: How to use label in crayons ?
>tags: 
>context: label
>content:

# Label (fw-label)
fw-label displays an informational text component that identifies other components on the user interface. 
## Demo
```html live
<fw-label value="Meta Information"></fw-label>
<fw-label value="Response Received" color="blue"></fw-label>
<fw-label value="Overdue" color="red"></fw-label>
<fw-label value="New" color="green"></fw-label>
<fw-label value="Pending" color="yellow"></fw-label>
<fw-label value="Archived" color="grey"></fw-label>
```
<!-- Auto Generated Below -->

---
