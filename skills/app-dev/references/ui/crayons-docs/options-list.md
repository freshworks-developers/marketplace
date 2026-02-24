>title: Demo with option-label-path and option-value-path in options-list
>tags: 
>context: options-list
>content:

# Usage
### Demo with option-label-path and option-value-path
```html live
<fw-label value="With predefined options" color="blue"></fw-label>
<fw-popover same-width="false">
<fw-button slot="popover-trigger">Click Me!</fw-button>
<fw-list-options
variant="icon"
id="predefinedOptions"
slot="popover-content"
option-label-path="name"
option-value-path="id"
></fw-list-options>
</fw-popover>
<br />
<br />
<fw-label value="With search" color="blue"></fw-label>
<fw-popover same-width="false">
<fw-button slot="popover-trigger">Click Me!</fw-button>
<fw-list-options
variant="avatar"
searchable="true"
id="searchVariant"
slot="popover-content"
no-data-text="Type to search.."
not-found-text="Not available in this universe"
search-text="Search Pirate"
multiple
option-label-path="label"
option-value-path="id"
></fw-list-options>
</fw-popover>

<script type="application/javascript">
var iconDataSource = [
{
id: '1',
name: 'Luffy',
subText: 'Pirate King',
graphicsProps: { name: 'verified' },
},
{
id: '2',
name: 'Zorro',
subText: 'Best Swordsman',
graphicsProps: { name: 'magic-wand' },
},
{
id: '3',
name: 'Sanji',
subText: 'Best Chef',
graphicsProps: { name: 'ecommerce' },
},
];
var predefinedOptions = document.getElementById('predefinedOptions');
predefinedOptions.options = iconDataSource;
predefinedOptions.setSelectedOptions([
{
id: '2',
name: 'Zorro',
subText: 'Best Swordsman',
graphicsProps: { name: 'magic-wand' },
},
]);
predefinedOptions.addEventListener('fwChange', (e) => {
console.log(e.detail);
});

var searchVariant = document.getElementById('searchVariant');
baseURL = 'https://api.sampleapis.com/rickandmorty/characters';
searchVariant.selectedOptions = [
{
label: 'Rick Sanchez',
subText: 'Human',
id: '1',
graphicsProps: {
image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
},
},
];
searchVariant.search = (value, source) => {
// Sample function to mimic the dynamic filter over network
return fetch(baseURL)
.then((resp) => resp.json())
.then((data) => {
const result = data.filter((x) =>
x.name.toLowerCase().includes(value.toLowerCase())
);
return result.map((x) => {
return {
label: x.name,
subText: x.type,
id: x.id.toString(),
graphicsProps: { image: x.image },
};
});
});
};
</script>
```
---
>title: options-list - Usage for option-label-path and option-value-path in HTML
>tags: 
>context: options-list
>content:

# Usage
### Usage for option-label-path and option-value-path in HTML
  
```html
<fw-label value="With predefined options" color="blue"></fw-label>
<fw-popover same-width="false">
<fw-button slot="popover-trigger">Click Me!</fw-button>
<fw-list-options
variant="icon"
id="predefinedOptions"
slot="popover-content"
option-label-path="name"
option-value-path="id"
></fw-list-options>
</fw-popover>
<br />
<br />
<fw-label value="With search" color="blue"></fw-label>
<fw-popover same-width="false">
<fw-button slot="popover-trigger">Click Me!</fw-button>
<fw-list-options
variant="avatar"
searchable="true"
id="searchVariant"
slot="popover-content"
no-data-text="Type to search.."
not-found-text="Not available in this universe"
search-text="Search Pirate"
multiple
option-label-path="label"
option-value-path="id"
></fw-list-options>
</fw-popover>

<script type="application/javascript">
var iconDataSource = [
{
id: '1',
name: 'Luffy',
subText: 'Pirate King',
graphicsProps: { name: 'verified' },
},
{
id: '2',
name: 'Zorro',
subText: 'Best Swordsman',
graphicsProps: { name: 'magic-wand' },
},
{
id: '3',
name: 'Sanji',
subText: 'Best Chef',
graphicsProps: { name: 'ecommerce' },
},
];
var predefinedOptions = document.getElementById('predefinedOptions');
predefinedOptions.options = iconDataSource;
predefinedOptions.setSelectedOptions([
{
id: '2',
name: 'Zorro',
subText: 'Best Swordsman',
graphicsProps: { name: 'magic-wand' },
},
]);
predefinedOptions.addEventListener('fwChange', (e) => {
console.log(e.detail);
});

var searchVariant = document.getElementById('searchVariant');
baseURL = 'https://api.sampleapis.com/rickandmorty/characters';
searchVariant.selectedOptions = [
{
label: 'Rick Sanchez',
subText: 'Human',
id: '1',
graphicsProps: {
image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
},
},
];
searchVariant.search = (value, source) => {
// Sample function to mimic the dynamic filter over network
return fetch(baseURL)
.then((resp) => resp.json())
.then((data) => {
const result = data.filter((x) =>
x.name.toLowerCase().includes(value.toLowerCase())
);
return result.map((x) => {
return {
label: x.name,
subText: x.type,
id: x.id.toString(),
graphicsProps: { image: x.image },
};
});
});
};
</script>
```  

---
>title: Demo with virtual scroll in options-list
>tags: 
>context: options-list
>content:

# Usage
### Demo with virtual scroll
**This feature is experimental, it needs to be explicitly activated using the `enableVirtualScroll` feature flag.**  
`enableVirtualScroll` property can be used to enable virtualisation of long list of options.
`estimatedSize` property is used to set estimated size of items in the list box to ensure smooth-scrolling.  
```html live
<fw-label value="With Virtual Scroll" color="blue"></fw-label>
<fw-popover>
<fw-button slot="popover-trigger">Open Long List</fw-button>
<fw-list-options
id="longList"
enable-virtual-scroll="true"
estimated-size="52"
slot="popover-content"
></fw-list-options>
</fw-popover>

<script type="application/javascript">
var longList = document.getElementById('longList');
const longListOptions = Array.from(Array(50000), (_,i) => ({
text: `Item No: ${i + 1}`,
value: i
}));
longList.options = longListOptions;
longList.addEventListener('fwChange', (e) => {
console.log(e.detail);
});
</script>
```
---
>title: options-list - Usage of Virtual scroll in HTML
>tags: 
>context: options-list
>content:

# Usage
### Usage of Virtual scroll in HTML
  
```html
<fw-label value="With Virtual Scroll" color="blue"></fw-label>
<fw-popover>
<fw-button slot="popover-trigger">Open Long List</fw-button>
<fw-list-options
id="longList"
enable-virtual-scroll="true"
estimated-size="52"
slot="popover-content"
></fw-list-options>
</fw-popover>

<script type="application/javascript">
var longList = document.getElementById('longList');
const longListOptions = Array.from(Array(50000), (_,i) => ({
text: `Item No: ${i + 1}`,
value: i
}));
longList.options = longListOptions;
longList.addEventListener('fwChange', (e) => {
console.log(e.detail);
});
</script>
```

---
>title: options-list - Usage of Virtual scroll in React
>tags: 
>context: options-list, react
>content:

# Usage
### Usage of Virtual scroll in React
  
```jsx
function ListOptions() {
const longListOptions = Array.from(Array(50000), (_,i) => ({
text: `Item No: ${i + 1}`,
value: i
}));
return (
<FwPopover>
<FwButton slot="popover-trigger">Open Long List</FwButton>
<FwListOptions
id='longList'
slot='popover-content'
options={longListOptions}
enableVirtualScroll
estimatedSize={52}
></FwListOptions>
</FwPopover>
);
}
export default ListOptions;
```  

---
>title: Usage of Virtual scroll in options-list
>tags: 
>context: options-list
>content:

# Usage
### Usage of Virtual scroll
  
<!-- Auto Generated Below -->
---
>title: Properties in options-list
>tags: 
>context: options-list
>content:

# Usage
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


Property: `debounceTimer`
Attribute: `debounce-timer`
Description: Debounce timer for the search promise function.
Type: `number`
Default: `300`


Property: `disabled`
Attribute: `disabled`
Description: Disables the component on the interface. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `enableVirtualScroll`
Attribute: `enable-virtual-scroll`
Description: Virtualize long list of elements in list options *Experimental*
Type: `boolean`
Default: `false`


Property: `estimatedSize`
Attribute: `estimated-size`
Description: Works only when 'enableVirtualScroll' is true. Estimated size of each item in the list box to ensure smooth-scrolling.
Type: `number`
Default: `35`


Property: `filterText`
Attribute: `filter-text`
Description: The text to filter the options.
Type: `any`
Default: `undefined`


Property: `formatCreateLabel`
Attribute: --
Description: Works only when 'isCreatable' is selected. Function to format the create label displayed as an option.
Type: `(value: string) => string`
Default: `undefined`


Property: `hideTick`
Attribute: `hide-tick`
Description: hide tick mark icon on select option
Type: `boolean`
Default: `false`


Property: `isCreatable`
Attribute: `is-creatable`
Description: Allows user to create the option if the provided input doesn't match with any of the options.
Type: `boolean`
Default: `false`


Property: `max`
Attribute: `max`
Description: Works with `multiple` enabled. Configures the maximum number of options that can be selected with a multi-select component.
Type: `number`
Default: `Number.MAX_VALUE`


Property: `multiple`
Attribute: `multiple`
Description: Enables selection of multiple options. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `noDataText`
Attribute: `no-data-text`
Description: Text to be displayed when there is no data available in the select.
Type: `string`
Default: `''`


Property: `notFoundText`
Attribute: `not-found-text`
Description: Default option to be shown if the option doesn't match the filterText.
Type: `string`
Default: `''`


Property: `optionLabelPath`
Attribute: `option-label-path`
Description: Key for determining the label for a given option
Type: `string`
Default: `'text'`


Property: `optionValuePath`
Attribute: `option-value-path`
Description: Key for determining the value for a given option
Type: `string`
Default: `'value'`


Property: `options`
Attribute: --
Description: Value corresponding to the option, that is saved  when the form data is saved.
Type: `any[]`
Default: `[]`


Property: `search`
Attribute: --
Description: Filter function which takes in filterText and dataSource and return a Promise. Where filter text is the text to filter the value in dataSource array. The returned promise should contain the array of options to be displayed.
Type: `(text: string, dataSource: any[]) => Promise<any[]>`
Default: `this.defaultSearchFunction`


Property: `searchText`
Attribute: `search-text`
Description: Placeholder to placed on the search text box.
Type: `string`
Default: `''`


Property: `searchable`
Attribute: `searchable`
Description: Enables the input with in the popup for filtering the options.
Type: `boolean`
Default: `false`


Property: `selectedOptions`
Attribute: --
Description: The option that is displayed as the default selection, in the list box. Must be a valid value corresponding to the fw-select-option components used in Select.
Type: `any[]`
Default: `[]`


Property: `validateNewOption`
Attribute: --
Description: Works only when 'isCreatable' is selected. Function to validate the newly created value. Should return true if new option is valid or false if invalid.
Type: `(value: string) => boolean`
Default: `undefined`


Property: `value`
Attribute: `value`
Description: Value of the option that is displayed as the default selection, in the list box. Must be a valid value corresponding to the fw-select-option components used in Select.
Type: `any`
Default: `''`


Property: `variant`
Attribute: `variant`
Description: Standard is the default option without any graphics other options are icon and avatar which places either the icon or avatar at the beginning of the row. The props for the icon or avatar are passed as an object via the graphicsProps.
Type: `"avatar" \| "conversation" \| "icon" \| "standard"`
Default: `'standard'`
---
>title: Events in options-list
>tags: 
>context: options-list
>content:

# Usage
## Events



Event: `fwChange`
Description: Triggered when a value is selected or deselected from the list box options.
Type: `CustomEvent<any>`


Event: `fwLoading`
Description: Triggered when the options list is in loading state processing the search function.
Type: `CustomEvent<any>`
---
>title: How to use options-list in crayons ?
>tags: 
>context: options-list
>content:

# List Options (fw-list-options)
# Usage
The data-source and the visual variant for the list options can be altered via the props.
```html live
<fw-popover>
  <fw-button slot="popover-trigger">Straw Hats - Click Me!</fw-button>
  <fw-list-options
    id="standardVariant"
    slot="popover-content"
    searchable="true"
    not-found-text="Pirate not found"
    search-text="Search Pirate"
  ></fw-list-options>
</fw-popover>
<br />
<fw-popover same-width="false">
  <fw-button slot="popover-trigger">Click Me!</fw-button>
  <fw-list-options
    variant="icon"
    id="iconVariant"
    slot="popover-content"
  ></fw-list-options>
</fw-popover>
<fw-popover same-width="false">
  <fw-button slot="popover-trigger">Creatable Select - Click Me!</fw-button>
  <fw-list-options
    id="creatableVariant"
    slot="popover-content"
    searchable="true"
    is-creatable="true"
    variant="avatar"
  ></fw-list-options>
</fw-popover>
<script type="application/javascript">
  var dataSource = [
    { value: '1', text: 'Luffy' },
    { value: '2', text: 'Zorro' },
    { value: '3', text: 'Sanji' },
  ];
  var standardVariant = document.getElementById('standardVariant');
  standardVariant.options = dataSource;
  standardVariant.value = ['2'];
  standardVariant.multiple = true;
  var iconDataSource = [
    {
      value: '1',
      text: 'Luffy',
      subText: 'Pirate King',
      graphicsProps: { name: 'verified' },
    },
    {
      value: '2',
      text: 'Zorro',
      subText: 'Best Swordsman',
      graphicsProps: { name: 'magic-wand' },
    },
    {
      value: '3',
      text: 'Sanji',
      subText: 'Best Chef',
      graphicsProps: { name: 'ecommerce' },
    },
  ];
  var iconVariant = document.getElementById('iconVariant');
  iconVariant.options = iconDataSource;
  var creatableDataSource = [
    {
      text: 'Angela Smith',
      subText: 'angela.smith@gmail.com',
      value: 'angela.smith@gmail.com',
      graphicsProps: {
        image:
          'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
    },
    {
      text: 'Freshdesk support from India and Berlin',
      subText: 'support.india@freshdesk.com',
      value: 'support.india@freshdesk.com',
      graphicsProps: {
        image:
          'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
    },
    {
      text: 'Angela from Freshdesk',
      subText: 'angela@freshdesk.in',
      value: 'angela@freshdesk.in',
      graphicsProps: {
        image:
          'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
    },
  ];
  const validateEmail = (email) =>
    String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  var creatableVariant = document.getElementById('creatableVariant');
  creatableVariant.options = creatableDataSource;
  creatableVariant.formatCreateLabel = (label) =>
    `Add "${label}" as one of the recipients`;
  creatableVariant.validateNewOption = (value) => validateEmail(value);
</script>
```
<!-- Auto Generated Below -->
## Methods
### `clearFilter() => Promise<void>`
#### Returns
Type: `Promise<void>`
### `getSelectedOptions() => Promise<any>`
#### Returns
Type: `Promise<any>`
### `scrollToLastSelected() => Promise<void>`
#### Returns
Type: `Promise<void>`
### `setFocus() => Promise<any>`
#### Returns
Type: `Promise<any>`
### `setSelectedOptions(options: any[]) => Promise<any>`
#### Returns
Type: `Promise<any>`
### `setSelectedValues(values: any) => Promise<any>`
Pass an array of string in case of multi-select or string for single-select.
#### Returns
Type: `Promise<any>`
## Shadow Parts
| Part                          | Description |
| ----------------------------- | ----------- |
| `"fw-list-options-container"` |             |
 

---
