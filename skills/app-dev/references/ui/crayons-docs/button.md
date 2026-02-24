>title: button - Usage in HTML
>tags: 
>context: button
>content:

# Button (fw-button)
## Usage in HTML

``` html
<section>
<fw-label value="Try themes"></fw-label>
<fw-button color="primary"> OK </fw-button>
<fw-button color="secondary"> Secondary </fw-button>
<fw-button color="danger"> Don't Click </fw-button>
<fw-button color="link"> Link Button </fw-button>
<fw-button color="text"> Plain Text Button </fw-button>
</section>

<br />

<section>
<fw-label value="Try sizes"></fw-label>
<fw-button size="small"> Small </fw-button>
<fw-button> Default </fw-button>
</section>
<br />

<section>
<fw-label value="Try icon buttons"></fw-label>
<fw-button size="icon"
><fw-icon name="agent" size="20" color="white"></fw-icon>
</fw-button>
<fw-button size="icon" color="secondary"
><fw-icon name="phone" size="20"></fw-icon>
</fw-button>
</section>
<br />

<section>
<fw-label value="Caret with icon"></fw-label>
<fw-button show-caret-icon>
<fw-icon name="calendar-time" size="16" slot="before-label"></fw-icon>
Select date
</fw-button>

<fw-button color="link" show-caret-icon>
<fw-icon name="calendar-time" size="16" slot="before-label"></fw-icon>
Select date
</fw-button>
</section>
<br />

<section>
<fw-label value="Loading state"></fw-label>
<fw-button loading> Loading </fw-button>
<fw-button loading color="secondary"> OK </fw-button>
<fw-button loading color="danger"> Don't Click </fw-button>
</section>
<br />

<section>
<fw-label value="Disabled"></fw-label>
<fw-button disabled color="primary"> OK </fw-button>
<fw-button disabled color="secondary"> OK </fw-button>
<fw-button disabled color="danger"> Don't Click </fw-button>
</section>

<section>
<fw-label
value="Try icon + text buttons Buttons with before-label and after-label"
></fw-label>
<fw-button color="secondary">
<fw-icon slot="before-label" size="16" name="delete"></fw-icon>
<span>Delete</span>
</fw-button>
<fw-button color="primary">
<span>Copy</span>
<fw-icon name="code" size="16" slot="after-label"></fw-icon>
</fw-button>
</section>
```

---
>title: button - Usage in React
>tags: 
>context: button, react
>content:

# Button (fw-button)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwButton, FwIcon } from "@freshworks/crayons/react";
function App() {
return (<div>
<section>
<label>Try themes</label>
<FwButton color="primary" onFwClick={()=>console.log("fwClick event emitted from button")}> OK </FwButton>
<FwButton color="secondary"> Secondary </FwButton>
<FwButton color="danger"> Don't Click </FwButton>
<FwButton color="link"> Link Button </FwButton>
<FwButton color="text"> Plain Text Button </FwButton>
</section>

<br />

<section>
<label>Try sizes</label>
<FwButton size="mini" color="secondary"> Mini </FwButton>
<FwButton size="small"> Small </FwButton>
<FwButton> Default </FwButton>
</section>
<br />

<section>
<label>Try icon buttons</label>
<FwButton size="icon"
><FwIcon name="agent" color="white"></FwIcon>
</FwButton>
<FwButton size="icon" color="secondary"
><FwIcon name="phone"></FwIcon>
</FwButton>
</section>
<br />
<section>
<label value="Caret with icon"></label>
<FwButton show-caret-icon>
<FwIcon name="calendar-time" slot="before-label"></FwIcon>
Select date
</FwButton>

<FwButton color="link" show-caret-icon>
<fw-icon name="calendar-time" slot="before-label" ></fw-icon>
Select date
</FwButton>
</section>
<br />

<section>
<label>Loading state</label>
<FwButton loading> Loading </FwButton>
<FwButton loading color="secondary"> OK </FwButton>
<FwButton loading color="danger"> Don't Click </FwButton>
</section>
<br />

<section>
<label>Disabled</label>
<FwButton disabled color="primary"> OK </FwButton>
<FwButton disabled color="secondary"> OK </FwButton>
<FwButton disabled color="danger"> Don't Click </FwButton>
</section>
<br />
<section>
<label value="Try icon + text buttons Buttons with before-label and after-label"></label>
<FwButton color="secondary">
<FwIcon slot="before-label" name="delete"></FwIcon>
<span>Delete</span>
</FwButton>
<FwButton color="primary">
<span>Copy</span>
<FwIcon name="code" slot="after-label"></FwIcon>
</FwButton>
</section>
<br />

<section>
<FwButton value="Try full length"></FwButton>
<FwButton color="secondary" size="small" style="display: block;">Span full-width</FwButton>
</section>
</div>)
```

---
>title: Usage in button
>tags: 
>context: button
>content:

# Button (fw-button)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in button
>tags: 
>context: button
>content:

# Button (fw-button)
## Properties



Property: `color`
Attribute: `color`
Description: Identifier of  the theme based on which the button is styled.
Type: `"danger" \| "link" \| "primary" \| "secondary" \| "text"`
Default: `'primary'`


Property: `disabled`
Attribute: `disabled`
Description: Disables the button on the interface. Default value is false.
Type: `boolean`
Default: `false`


Property: `fileUploaderId`
Attribute: `file-uploader-id`
Description: Accepts the id of the fw-file-uploader component to upload the file.
Type: `string`
Default: `''`


Property: `loading`
Attribute: `loading`
Description: Loading state for the button, Default value is false.
Type: `boolean`
Default: `false`


Property: `modalTriggerId`
Attribute: `modal-trigger-id`
Description: Accepts the id of the fw-modal component to open it on click.
Type: `string`
Default: `''`


Property: `showCaretIcon`
Attribute: `show-caret-icon`
Description: Caret indicator for the button, Default value is false.
Type: `boolean`
Default: `false`


Property: `size`
Attribute: `size`
Description: Size of the button.
Type: `"icon" \| "icon-small" \| "normal" \| "small"`
Default: `'normal'`


Property: `throttleDelay`
Attribute: `throttle-delay`
Description: Sets the delay for throttle in milliseconds. Defaults to 200 milliseconds.
Type: `number`
Default: `200`


Property: `type`
Attribute: `type`
Description: Button type based on which actions are performed when the button is clicked.
Type: `"button" \| "submit"`
Default: `'button'`
---
>title: Events in button
>tags: 
>context: button
>content:

# Button (fw-button)
## Events



Event: `fwBlur`
Description: Triggered when the button loses focus.
Type: `CustomEvent<void>`


Event: `fwClick`
Description: Triggered when the button is clicked.
Type: `CustomEvent<void>`


Event: `fwFocus`
Description: Triggered when the button comes into focus.
Type: `CustomEvent<void>`
---
>title: CSS Custom Properties in button
>tags: 
>context: button
>content:

# Button (fw-button)
## CSS Custom Properties



Name: `--fw-button-label-vertical-padding`
Description: vertical padding for the button label


Name: `--fw-button-min-width`
Description: minimum width for the button
---
>title: How to use button in crayons ?
>tags: 
>context: button
>content:

# Button (fw-button)
fw-button displays a button on the user interface and enables performing specific actions based on the button type. The button’s label can be a text, icon, or both.
## Demo
```html live
<section>
  <fw-label value="Try themes"></fw-label>
  <fw-button color="primary"> OK </fw-button>
  <fw-button color="secondary"> Secondary </fw-button>
  <fw-button color="danger"> Don't Click </fw-button>
  <fw-button color="link"> Link Button </fw-button>
  <fw-button color="text"> Plain Text Button </fw-button>
</section>
<br />
<section>
  <fw-label value="Try sizes"></fw-label>
  <fw-button size="small"> Small </fw-button>
  <fw-button> Default </fw-button>
</section>
<br />
<section>
  <fw-label value="Try icon buttons"></fw-label>
  <fw-button size="icon"
    ><fw-icon name="agent" size="20" color="white"></fw-icon>
  </fw-button>
  <fw-button size="icon" color="secondary"
    ><fw-icon name="phone" size="20"></fw-icon>
  </fw-button>
</section>
<br />
<section>
  <fw-label value="Caret with icon"></fw-label>
  <fw-button show-caret-icon>
    <fw-icon name="calendar-time" size="16" slot="before-label"></fw-icon>
    Select date
  </fw-button>
  <fw-button color="link" show-caret-icon>
    <fw-icon name="calendar-time" size="16" slot="before-label"></fw-icon>
    Select date
  </fw-button>
</section>
<br />
<section>
  <fw-label value="Loading state"></fw-label>
  <fw-button loading> Loading </fw-button>
  <fw-button loading color="secondary"> OK </fw-button>
  <fw-button loading color="danger"> Don't Click </fw-button>
</section>
<br />
<section>
  <fw-label value="Disabled"></fw-label>
  <fw-button disabled color="primary"> OK </fw-button>
  <fw-button disabled color="secondary"> OK </fw-button>
  <fw-button disabled color="danger"> Don't Click </fw-button>
</section>
<section>
  <fw-label
    value="Try icon + text buttons Buttons with before-label and after-label"
  ></fw-label>
  <fw-button color="secondary">
    <fw-icon slot="before-label" size="16" name="delete"></fw-icon>
    <span>Delete</span>
  </fw-button>
  <fw-button color="primary">
    <span>Copy</span>
    <fw-icon name="code" size="16" slot="after-label"></fw-icon>
  </fw-button>
</section>
<br />
```
<!-- Auto Generated Below -->
## Methods
### `setFocus() => Promise<any>`
#### Returns
Type: `Promise<any>`
 

---
