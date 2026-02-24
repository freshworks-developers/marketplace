>title: Styling Pills with custom icons or images in pill
>tags: 
>context: pill
>content:

# Pill (fw-pill)
## Demo
### Styling Pills with custom icons or images
```html live
<fw-pill color="grey">
<img src="/favicon.png" slot="icon" />
Crayons custom icon
</fw-pill>
```
---
>title: Styling Pills with custom CSS in pill
>tags: 
>context: pill
>content:

# Pill (fw-pill)
## Demo
### Styling Pills with custom CSS
Pill can be customized with custom colors by using custom CSS properties listed further below in the page.  
```html live
<fw-pill
style="--fw-pill-background-color: #fff;--fw-pill-border: 1px solid gray;--fw-pill-padding: 4px 12px 4px 8px;"
>
<fw-icon name="info" slot="icon"></fw-icon>
Custom Styled Pill
</fw-pill>
```
---
>title: pill - Usage in HTML
>tags: 
>context: pill
>content:

# Pill (fw-pill)
## Usage in HTML

```html
<fw-pill>
<fw-icon name="internet" slot="icon"></fw-icon>
Meta Information
</fw-pill>
<fw-pill color="blue">
<fw-icon name="info" slot="icon"></fw-icon>
Response Received
</fw-pill>
<fw-pill color="red">
<fw-icon name="alert" slot="icon" ></fw-icon>
Overdue
</fw-pill>
<fw-pill color="green">
<fw-icon name="add-contact" slot="icon" ></fw-icon>
New
</fw-pill>
<fw-pill color="yellow">
<fw-icon name="help" slot="icon" ></fw-icon>
Pending
</fw-pill>
<fw-pill color="grey">
<fw-icon name="add-note" slot="icon" ></fw-icon>
Archived
</fw-pill>
````

---
>title: pill - Usage in React
>tags: 
>context: pill, react
>content:

# Pill (fw-pill)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwPill } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwPill color="green">
<FwIcon name="internet" slot="icon"></FwIcon>
Meta Information
</FwPill>
</div>);
}
````  

---
>title: Usage in pill
>tags: 
>context: pill
>content:

# Pill (fw-pill)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in pill
>tags: 
>context: pill
>content:

# Pill (fw-pill)
## Properties



Property: `color`
Attribute: `color`
Description: Theme based on which the pill is styled.
Type: `"blue" \| "green" \| "grey" \| "red" \| "yellow"`
Default: `undefined`
---
>title: CSS Custom Properties in pill
>tags: 
>context: pill
>content:

# Pill (fw-pill)
## CSS Custom Properties



Name: `--fw-pill-background-color`
Description: Pill background color


Name: `--fw-pill-border`
Description: Pill border


Name: `--fw-pill-border-radius`
Description: Pill border radius


Name: `--fw-pill-color`
Description: Pill color


Name: `--fw-pill-padding`
Description: Pill padding
---
>title: How to use pill in crayons ?
>tags: 
>context: pill
>content:

# Pill (fw-pill)
fw-pill displays an informational text component with icon.
<br>
Icon inside the pill must be set with attribute `slot="icon"` and it could either be `fw-icon` or customised with images or SVG icons as required.
## Demo
```html live
<fw-pill color="blue">
  <fw-icon name="info" slot="icon"></fw-icon>
  Response Received
</fw-pill>
<fw-pill color="red">
  <fw-icon name="alert" slot="icon"></fw-icon>
  Overdue
</fw-pill>
<fw-pill color="green">
  <fw-icon name="add-contact" slot="icon"></fw-icon>
  New
</fw-pill>
<fw-pill color="yellow">
  <fw-icon name="help" slot="icon"></fw-icon>
  Pending
</fw-pill>
<fw-pill color="grey">
  <fw-icon name="add-note" slot="icon"></fw-icon>
  Archived
</fw-pill>
```
<!-- Auto Generated Below -->

---
