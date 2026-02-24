>title: timepicker - Usage in HTML
>tags: 
>context: timepicker
>content:

# Timepicker (fw-timepicker)
## Usage in HTML

```html
<fw-label value="An interval based picker" color="yellow"></fw-label><br/>
<fw-timepicker interval=45 format="hh:mm a"></fw-timepicker>
<fw-label value="A range based picker" color="yellow"></fw-label><br/>
<fw-timepicker min-time="04:30 PM" max-time="08:30 PM"></fw-timepicker>
```

---
>title: timepicker - Usage in React
>tags: 
>context: timepicker, react
>content:

# Timepicker (fw-timepicker)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwTimepicker } from "@freshworks/crayons/react";
function App() {
return (<div>
<label>An interval based picker</label><br/>
<FwTimepicker interval={45} format="hh:mm a"></FwTimepicker>
<label>A range based picker</label><br/>
<FwTimepicker minTime="04:30 PM" maxTime="08:30 PM"></FwTimepicker>
</div>);
}
```

---
>title: Usage in timepicker
>tags: 
>context: timepicker
>content:

# Timepicker (fw-timepicker)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in timepicker
>tags: 
>context: timepicker
>content:

# Timepicker (fw-timepicker)
## Properties



Property: `allowDeselect`
Attribute: `allow-deselect`
Description: Whether clicking on the already selected option disables it.
Type: `boolean`
Default: `true`


Property: `caret`
Attribute: `caret`
Description: Whether the arrow/caret should be shown in the timepicker.
Type: `boolean`
Default: `true`


Property: `disabled`
Attribute: `disabled`
Description: Set true to disable the element
Type: `boolean`
Default: `false`


Property: `errorText`
Attribute: `error-text`
Description: Error text displayed below the text box.
Type: `string`
Default: `''`


Property: `format`
Attribute: `format`
Description: Format in which time values are populated in the list box. If the value is hh:mm a, the time values are in the 12-hour format. If the value is hh:mm, the time values are in the 24-hr format. The default value will be set based on the locale time format.
Type: `string`
Default: `undefined`


Property: `hintText`
Attribute: `hint-text`
Description: Hint text displayed below the text box.
Type: `string`
Default: `''`


Property: `interval`
Attribute: `interval`
Description: Time interval between the values displayed in the list, specified in minutes.
Type: `number`
Default: `30`


Property: `label`
Attribute: `label`
Description: Label displayed on the interface, for the component.
Type: `string`
Default: `''`


Property: `locale`
Attribute: `locale`
Description: Locale for which timePicker needs to be shown. Defaults to browser's current locale.
Type: `string`
Default: `undefined`


Property: `maxTime`
Attribute: `max-time`
Description: Upper time-limit for the values displayed in the list. The default value will be set based on the locale time format.
Type: `string`
Default: `undefined`


Property: `minTime`
Attribute: `min-time`
Description: Lower time-limit for the values displayed in the list. The default value will be set based on the locale time format.
Type: `string`
Default: `undefined`


Property: `name`
Attribute: `name`
Description: Name of the component, saved as part of form data.
Type: `string`
Default: `''`


Property: `optionsPlacement`
Attribute: `options-placement`
Description: Placement of the options list with respect to timepicker.
Type: `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"`
Default: `'bottom'`


Property: `placeholder`
Attribute: `placeholder`
Description: Text displayed in the select before an option is selected.
Type: `string`
Default: `undefined`


Property: `readonly`
Attribute: `readonly`
Description: If true, the user cannot type in the text input
Type: `boolean`
Default: `false`


Property: `required`
Attribute: `required`
Description: Specifies the input box as a mandatory field and displays an asterisk next to the label. If the attribute's value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `sameWidth`
Attribute: `same-width`
Description: Whether the dropdown should be same width as that of the input.
Type: `boolean`
Default: `true`


Property: `state`
Attribute: `state`
Description: Theme based on which the input of the timepicker is styled.
Type: `"error" \| "normal" \| "warning"`
Default: `'normal'`


Property: `value`
Attribute: `value`
Description: The Time value. The value is always in the non meridian format i.e., HH:mm
Type: `string`
Default: `undefined`


Property: `warningText`
Attribute: `warning-text`
Description: Warning text displayed below the text box.
Type: `string`
Default: `''`
---
>title: Events in timepicker
>tags: 
>context: timepicker
>content:

# Timepicker (fw-timepicker)
## Events



Event: `fwBlur`
Description: Triggered when the list box loses focus.
Type: `CustomEvent<any>`


Event: `fwChange`
Description: Triggered when a value is selected or deselected from the list box options.
Type: `CustomEvent<any>`


Event: `fwFocus`
Description: Triggered when the list box comes into focus.
Type: `CustomEvent<any>`
---
>title: How to use timepicker in crayons ?
>tags: 
>context: timepicker
>content:

# Timepicker (fw-timepicker)
fw-timepicker displays a list or drop-down box with prepopulated time values and enables picking a time. The time values displayed in the list box are based on the fw-timepicker attribute values.
## Demo
```html live
<fw-label value="An interval based picker" color="yellow"></fw-label><br />
<fw-timepicker interval="45" format="hh:mm a"></fw-timepicker>
<fw-label value="A range based picker" color="yellow"></fw-label><br />
<fw-timepicker min-time="04:30 PM" max-time="08:30 PM"></fw-timepicker>
<fw-label value="Time picker with locale support" color="yellow"></fw-label
><br />
<fw-timepicker locale="ar"></fw-timepicker>
```
<!-- Auto Generated Below -->
## Methods
### `setFocus() => Promise<void>`
Sets focus on a specific `fw-timepicker`.
#### Returns
Type: `Promise<void>`
 

---
