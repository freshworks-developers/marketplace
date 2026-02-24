>title: nested-select - Usage in HTML
>tags: 
>context: nested-select
>content:

# fw-nested-select
## Usage in HTML

```html
<fw-nested-select
id="nestedSelect"
name='Country'
label='Dependent field'
placeholder='select Country'
></fw-nested-select>

<script type="application/javascript">
var nestedChoicesSource = [{
id: 'india',
value: 'India',
label: 'State',
name: 'state',
choices: [
{
id: 'tamil_nadu',
value: 'Tamil Nadu',
name: 'city',
label: 'City',
choices: [
{
id: 'chennai',
value: 'Chennai',
},
{
id: 'coimbatore',
value: 'Coimbatore',
},
],
},
{
id: 'kerala',
value: 'Kerala',
name: 'city',
label: 'City',
choices: [
{
id: 'cochin',
value: 'Cochin',
},
{
id: 'wayanad',
value: 'Wayanad',
},
],
},
],
},
{
id: 'europe',
value: 'Europe',
label: 'State',
name: 'state',
choices: [
{
id: 'germany',
value: 'Germany',
name: 'city',
label: 'City',
choices: [
{
id: 'berlin',
value: 'berlin'
},
{
id: 'hamburg',
value: 'Hamburg',
},
],
},
],
}];

// Initialize default values
var selectProps = (name) => ({ value: initialValues[name] || '' });
var nestedSelectEl = document.getElementById('nestedSelect');
nestedSelectEl.options = nestedChoicesSource;
nestedSelectEl.selectProps = selectProps;
</script>

```

---
>title: nested-select - Usage in React
>tags: 
>context: nested-select, react
>content:

# fw-nested-select
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwNestedSelect } from "@freshworks/crayons/react";
function App() {
const initialValues = {};

const selectProps = (name) => (
{ value: initialValues[name] || '' }
);

const options = [{
id: 'india',
value: 'India',
label: 'State',
name: 'state',
choices: [
{
id: 'tamil_nadu',
value: 'Tamil Nadu',
name: 'city',
label: 'City',
choices: [
{
id: 'chennai',
value: 'Chennai',
},
{
id: 'coimbatore',
value: 'Coimbatore',
},
],
},
{
id: 'kerala',
value: 'Kerala',
name: 'city',
label: 'City',
choices: [
{
id: 'cochin',
value: 'Cochin',
},
{
id: 'wayanad',
value: 'Wayanad',
},
],
},
],
},
{
id: 'europe',
value: 'Europe',
label: 'State',
name: 'state',
choices: [
{
id: 'germany',
value: 'Germany',
name: 'city',
label: 'City',
choices: [
{
id: 'berlin',
value: 'berlin'
},
{
id: 'hamburg',
value: 'Hamburg',
},
],
},
],
},
];

return (<div>
<FwNestedSelect
options={options}
name="country"
label="Country"
selectProps={selectProps}
>
</FwNestedSelect>
</div>)
}
```

---
>title: Usage in nested-select
>tags: 
>context: nested-select
>content:

# fw-nested-select
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in nested-select
>tags: 
>context: nested-select
>content:

# fw-nested-select
## Properties



Property: `errorText`
Attribute: `error-text`
Description: Error text displayed below the text box.
Type: `string`
Default: `''`


Property: `hintText`
Attribute: `hint-text`
Description: Hint text displayed below the text box.
Type: `string`
Default: `''`


Property: `label`
Attribute: `label`
Description: label
Type: `string`
Default: `''`


Property: `name`
Attribute: `name`
Description: Name of first level field
Type: `string`
Default: `''`


Property: `optionLabelPath`
Attribute: `option-label-path`
Description: OptionLabelPath referred from field
Type: `string`
Default: `'value'`


Property: `optionValuePath`
Attribute: `option-value-path`
Description: OptionValuePath referred from field
Type: `string`
Default: `'id'`


Property: `options`
Attribute: --
Description: Options to display
Type: `any[]`
Default: `[]`


Property: `required`
Attribute: `required`
Description: Specifies the select field as a mandatory field and displays an asterisk next to the label. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `selectProps`
Attribute: `select-props`
Description: Function to return initialValues
Type: `any`
Default: `undefined`


Property: `state`
Attribute: `state`
Description: Theme based on which the list box is styled.
Type: `"error" \| "normal" \| "warning"`
Default: `'normal'`


Property: `value`
Attribute: `value`
Description: Initial value from first level choices
Type: `string`
Default: `''`


Property: `warningText`
Attribute: `warning-text`
Description: Warning text displayed below the text box.
Type: `string`
Default: `''`
---
>title: Events in nested-select
>tags: 
>context: nested-select
>content:

# fw-nested-select
## Events



Event: `fwChange`
Description: Triggered when nested selection doesn't have choices
Type: `CustomEvent<any>`
---
>title: How to use nested-select in crayons ?
>tags: 
>context: nested-select
>content:

# fw-nested-select
fw-nested-select allows to display nested dropdown choices
## Demo
```html live
<fw-nested-select
  id="nestedSelect"
  name='country'
  label='Country'
  placeholder='select Country'
  
></fw-nested-select>
<script type="application/javascript">
  var nestedChoicesSource = [{
    id: 'india',
    value: 'India',
    label: 'State',
    name: 'state',
    choices: [
      {
        id: 'tamil_nadu',
        value: 'Tamil Nadu',
        name: 'city',
        label: 'City',
        choices: [
          {
            id: 'chennai',
            value: 'Chennai',
          },
          {
            id: 'coimbatore',
            value: 'Coimbatore',
          },
        ],
      },
      {
        id: 'kerala',
        value: 'Kerala',
        name: 'city',
        label: 'City',
        choices: [
          {
            id: 'cochin',
            value: 'Cochin',
          },
          {
            id: 'wayanad',
            value: 'Wayanad',
          },
        ],
      },
    ],
  },
  {
    id: 'europe',
    value: 'Europe',
    label: 'State',
    name: 'state',
    choices: [
      {
        id: 'germany',
        value: 'Germany',
        name: 'city',
        label: 'City',
        choices: [
          {
            id: 'berlin',
            value: 'berlin'
          },
          {
            id: 'hamburg',
            value: 'Hamburg',
          },
        ],
      },
    ],
  }];
  
  // Initialize default values
  var selectProps = (name) => ({ value: initialValues[name] || '' });
  var nestedSelectEl = document.getElementById('nestedSelect');
  nestedSelectEl.options = nestedChoicesSource;
  nestedSelectEl.selectProps = selectProps;
</script>
```
<!-- Auto Generated Below -->
 

---
