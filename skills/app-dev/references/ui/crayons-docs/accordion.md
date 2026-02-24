>title: Default Accordion in accordion
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
## Demo
### Default Accordion
```html live
<fw-accordion expanded>
<fw-accordion-title>Header Text</fw-accordion-title>
<fw-accordion-body>
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the
1500s, when an unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five centuries, but also
the leap into electronic typesetting, remaining essentially unchanged. It
was popularised in the 1960s with the release of Letraset sheets containing
Lorem Ipsum passages, and more recently with desktop publishing software
like Aldus PageMaker including versions of Lorem Ipsum
</fw-accordion-body>
</fw-accordion>
```
---
>title: Accordion Title icon size in accordion
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
## Demo
### Accordion Title icon size
```html live
<fw-accordion>
<fw-accordion-title icon-size="small">Header Text</fw-accordion-title>
<fw-accordion-body>
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the
1500s, when an unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five centuries, but also
the leap into electronic typesetting, remaining essentially unchanged. It
was popularised in the 1960s with the release of Letraset sheets containing
Lorem Ipsum passages, and more recently with desktop publishing software
like Aldus PageMaker including versions of Lorem Ipsum
</fw-accordion-body>
</fw-accordion>
<br />
<fw-accordion>
<fw-accordion-title>Header Text</fw-accordion-title>
<fw-accordion-body>
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the
1500s, when an unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five centuries, but also
the leap into electronic typesetting, remaining essentially unchanged. It
was popularised in the 1960s with the release of Letraset sheets containing
Lorem Ipsum passages, and more recently with desktop publishing software
like Aldus PageMaker including versions of Lorem Ipsum
</fw-accordion-body>
</fw-accordion>
<br />
<fw-accordion>
<fw-accordion-title icon-size="large">Header Text</fw-accordion-title>
<fw-accordion-body>
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the
1500s, when an unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five centuries, but also
the leap into electronic typesetting, remaining essentially unchanged. It
was popularised in the 1960s with the release of Letraset sheets containing
Lorem Ipsum passages, and more recently with desktop publishing software
like Aldus PageMaker including versions of Lorem Ipsum
</fw-accordion-body>
</fw-accordion>
```
---
>title: Accordion with custom toggle icons in accordion
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
## Demo
### Accordion with custom toggle icons
```html live
<fw-accordion>
<fw-accordion-title>
<fw-icon name="minus" size="14" slot="expanded-icon"></fw-icon>
<fw-icon name="plus" size="14" slot="collapsed-icon"></fw-icon>
Header Text
</fw-accordion-title>
<fw-accordion-body>
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the
1500s, when an unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five centuries, but also
the leap into electronic typesetting, remaining essentially unchanged. It
was popularised in the 1960s with the release of Letraset sheets containing
Lorem Ipsum passages, and more recently with desktop publishing software
like Aldus PageMaker including versions of Lorem Ipsum
</fw-accordion-body>
</fw-accordion>
```  
Toggle icons can be customized using named slots.  
| Icon           | Slot Name      |
| -------------- | -------------- |
| Expanded Icon  | expanded-icon  |
| Collapsed Icon | collapsed-icon |
---
>title: No Bounding Box Accordion (Borders at top and bottom only) in accordion
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
## Demo
### No Bounding Box Accordion (Borders at top and bottom only)
```html live
<fw-accordion type="no_bounding_box">
<fw-accordion-title>Header Text</fw-accordion-title>
<fw-accordion-body>
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the
1500s, when an unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five centuries, but also
the leap into electronic typesetting, remaining essentially unchanged. It
was popularised in the 1960s with the release of Letraset sheets containing
Lorem Ipsum passages, and more recently with desktop publishing software
like Aldus PageMaker including versions of Lorem Ipsum
</fw-accordion-body>
</fw-accordion>
```
---
>title: Accordion with custom CSS properties in accordion
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
## Demo
### Accordion with custom CSS properties
```html live
<fw-accordion
style="--fw-accordion-border: 1px solid #F5F7F9; --fw-accordion-box-shadow: 0px 1px 8px rgba(152, 152, 152, 0.13); --fw-accordion-border-radius: 4px;"
expanded
>
<fw-accordion-title
truncate-on-overflow="true"
style="--fw-accordion-title-background-color: #F5F7F9; --fw-accordion-title-expanded-icon-color: #2C5CC5; --fw-accordion-title-collapsed-icon-color: #264966;"
>
<fw-icon name="rewards"></fw-icon>
<span style="padding-left: 5px;">Header Text</span>
</fw-accordion-title>
<fw-accordion-body style="--fw-accordion-body-background-color: #FFFFFF">
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the
1500s, when an unknown printer took a galley of type and scrambled it to
make a type specimen book. It has survived not only five centuries, but also
the leap into electronic typesetting, remaining essentially unchanged. It
was popularised in the 1960s with the release of Letraset sheets containing
Lorem Ipsum passages, and more recently with desktop publishing software
like Aldus PageMaker including versions of Lorem Ipsum
</fw-accordion-body>
</fw-accordion>
```
---
>title: accordion - Usage in HTML
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
## Usage in HTML

```html
<fw-accordion>
<fw-accordion-title>Header Text</fw-accordion-title>
<fw-accordion-body>
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
</fw-accordion-body>
</fw-accordion>
<br>
<fw-accordion type="no_bounding_box">
<fw-accordion-title>Header Text</fw-accordion-title>
<fw-accordion-body>
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
</fw-accordion-body>
</fw-accordion>
```

---
>title: accordion - Usage in React
>tags: 
>context: accordion, react
>content:

# Accordion (fw-accordion)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwCheckbox } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwAccordion>
<FwAccordionTitle>Header Text</FwAccordionTitle>
<FwAccordionBody>
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
</FwAccordionBody>
</FwAccordion>
</div>)
}
```

---
>title: Usage in accordion
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in accordion
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
## Properties



Property: `expanded`
Attribute: `expanded`
Description: To manage accordion expanded or collapsed state
Type: `boolean`
Default: `false`


Property: `type`
Attribute: `type`
Description: The type of accordion to be displayed. default => Accordion with all borders no_bounding_box => Accordion with top and bottom borders only
Type: `"default" \| "no_bounding_box"`
Default: `'default'`
---
>title: Events in accordion
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
## Events



Event: `fwAccordionToggle`
Description: Triggered when the accordion is expanded or collapsed
Type: `CustomEvent<AccordionToggleEvent>`
---
>title: CSS Custom Properties in accordion
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
## CSS Custom Properties



Name: `--fw-accordion-border`
Description: Accordion border


Name: `--fw-accordion-border-radius`
Description: Accordion border radius


Name: `--fw-accordion-box-shadow`
Description: Accordion box shadow
---
>title: How to use accordion in crayons ?
>tags: 
>context: accordion
>content:

# Accordion (fw-accordion)
fw-accordion displays a collapsible accordion component, which expands/collapses on clicking the accordion header.
## Demo
### No Bounding Box Accordion (Borders at top and bottom only)
<!-- Auto Generated Below -->
## Methods
### `toggle() => Promise<boolean>`
Method available from the component to toggle expanded or collapsed state of accordion
#### Returns
Type: `Promise<boolean>`
promise that resolves to true

---
