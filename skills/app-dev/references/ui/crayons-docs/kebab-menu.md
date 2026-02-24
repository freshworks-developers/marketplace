>title: kebab-menu - Usage in HTML
>tags: 
>context: kebab-menu
>content:

# Kebab Menu (fw-kebab-menu)
## Usage in HTML

```html
<fw-label value="Standard variant"></fw-label>
<fw-kebab-menu id="standard-kebab-menu"></fw-kebab-menu>
<br /><br />
<fw-label value="Icon variant"></fw-label>
<fw-kebab-menu id="icon-kebab-menu" variant="icon"></fw-kebab-menu>
<br />

<script type="application/javascript">
var standardDataSource = [
{
value: 'move_up',
text: 'Move Up',
},
{
value: 'move_down',
text: 'Move Down',
},
{
value: 'remove',
text: 'Remove',
},
];
var iconDataSource = [
{
value: 'move_up',
text: 'Move Up',
graphicsProps: { name: 'arrow-up' },
},
{
value: 'move_down',
text: 'Move Down',
graphicsProps: { name: 'arrow-down' },
},
{
value: 'remove',
text: 'Remove',
graphicsProps: { name: 'delete' },
},
];
var standardVariant = document.getElementById('standard-kebab-menu');
standardVariant.options = iconDataSource;
standardVariant.addEventListener('fwSelect', (e) => {
console.log('standard variant fwSelect event', e.detail);
})
var iconVariant = document.getElementById('icon-kebab-menu');
iconVariant.options = iconDataSource;
iconVariant.addEventListener('fwSelect', (e) => {
console.log('icon variant fwSelect event', e.detail);
})
</script>
```

---
>title: kebab-menu - Usage in React
>tags: 
>context: kebab-menu, react
>content:

# Kebab Menu (fw-kebab-menu)
## Usage in React
  
```jsx
import React from "react";
import { FwKebabMenu } from "@freshworks/crayons/react";
function App() {

var standardDataSource = [
{
value: 'move_up',
text: 'Move Up',
},
{
value: 'move_down',
text: 'Move Down',
},
{
value: 'remove',
text: 'Remove',
},
];
var iconDataSource = [
{
value: 'move_up',
text: 'Move Up',
graphicsProps: { name: 'arrow-up' },
},
{
value: 'move_down',
text: 'Move Down',
graphicsProps: { name: 'arrow-down' },
},
{
value: 'remove',
text: 'Remove',
graphicsProps: { name: 'delete' },
},
];

return (
<>
<FwKebabMenu id="standardVariant" options={standardDataSource}></FwKebabMenu>
<FwKebabMenu id="iconVariant" variant="icon" options={iconDataSource}></FwKebabMenu>
</>
);
}
```  

---
>title: Usage in kebab-menu
>tags: 
>context: kebab-menu
>content:

# Kebab Menu (fw-kebab-menu)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in kebab-menu
>tags: 
>context: kebab-menu
>content:

# Kebab Menu (fw-kebab-menu)
## Properties



Property: `options`
Attribute: --
Description: The data for the kebab menu component, the options will be of type array of fw-select-options.
Type: `any[]`
Default: `[]`


Property: `variant`
Attribute: `variant`
Description: Standard is the default option without any graphics other option is icon which places the icon at the beginning of the row. The props for the icon are passed as an object via the graphicsProps.
Type: `"icon" \| "standard"`
Default: `'standard'`
---
>title: Events in kebab-menu
>tags: 
>context: kebab-menu
>content:

# Kebab Menu (fw-kebab-menu)
## Events



Event: `fwSelect`
Description: fwSelect event is emitted when an option is clicked from the list.
Type: `CustomEvent<any>`
---
>title: How to use kebab-menu in crayons ?
>tags: 
>context: kebab-menu
>content:

# Kebab Menu (fw-kebab-menu)
fw-kebab-menu displays a kebab icon which on clicking displays a list or drop-down box that enables selection of an option from an available list of values.
`fwSelect` event will be triggered when selecting a value from the list.
## Demo
```html live
<fw-label value="Standard variant"></fw-label>
<fw-kebab-menu id="standard-kebab-menu"></fw-kebab-menu>
<br /><br />
<fw-label value="Icon variant"></fw-label>
<fw-kebab-menu id="icon-kebab-menu" variant="icon"></fw-kebab-menu>
<br />
<script type="application/javascript">
  var standardDataSource = [
    {
      value: 'move_up',
      text: 'Move Up',
    },
    {
      value: 'move_down',
      text: 'Move Down',
    },
    {
      value: 'remove',
      text: 'Remove',
    },
  ];
  var iconDataSource = [
    {
      value: 'move_up',
      text: 'Move Up',
      graphicsProps: { name: 'arrow-up' },
    },
    {
      value: 'move_down',
      text: 'Move Down',
      graphicsProps: { name: 'arrow-down' },
    },
    {
      value: 'remove',
      text: 'Remove',
      graphicsProps: { name: 'delete' },
    },
  ];
  var standardVariant = document.getElementById('standard-kebab-menu');
  standardVariant.options = iconDataSource;
  standardVariant.addEventListener('fwSelect', (e) => {
    console.log('standard variant fwSelect event', e.detail);
  })
  var iconVariant = document.getElementById('icon-kebab-menu');
  iconVariant.options = iconDataSource;
  iconVariant.addEventListener('fwSelect', (e) => {
    console.log('icon variant fwSelect event', e.detail);
  })
</script>
```
<!-- Auto Generated Below -->
 

---
