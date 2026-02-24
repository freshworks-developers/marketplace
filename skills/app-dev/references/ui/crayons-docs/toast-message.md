>title: toast-message - Usage in HTML
>tags: 
>context: toast-message
>content:

# Toast Message (fw-toast-message)
## Usage in HTML

```html
<fw-toast-message open id="type_toast" sticky=true type="success" content="success"></fw-toast-message>
<fw-toast-message open id="type_toast" sticky=true type="error" content="error"></fw-toast-message>
<fw-toast-message open id="type_toast" type="warning" content="warning"></fw-toast-message>
<fw-toast-message open id="type_toast" type="inprogress" content="inprogress"></fw-toast-message>
<fw-toast-message
type="success"
id="custom-toast"
sticky
show
action-link-text="Click me"
>
<div
style="display: flex;
flex-direction: column;
gap: 4px;"
>
<span
style="font-style: normal;
font-weight: 700;
font-size: 14px;
line-height: 20px;
color: #12344D;"
>Test content</span
>
<span
style="font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 16px;"
>custom html contents can be added</span
>
</div>
</fw-toast-message>
```

---
>title: toast-message - Usage in React
>tags: 
>context: toast-message, react
>content:

# Toast Message (fw-toast-message)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwToastMessage } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwToastMessage open id="type_toast" sticky type="success" content="success"></FwToastMessage>
<FwToastMessage open id="type_toast" sticky type="error" content="error"></FwToastMessage>
<FwToastMessage open id="type_toast" type="warning" content="warning"></FwToastMessage>
<FwToastMessage open id="type_toast" type="inprogress" content="inprogress"></FwToastMessage>
<FwToastMessage
type='success'
id='custom-toast'
sticky
action-link-text='Click me'
>
<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
<span
style={{
fontStyle: 'normal',
fontWeight: '700',
fontSize: '14px',
lineHeight: '20px',
color: '#12344D',
}}
>
Test content
</span>
<span
style={{
fontStyle: 'normal',
fontWeight: '400',
fontSize: '12px',
lineHeight: '16px',
}}
>
custom html contents can be added
</span>
</div>
</FwToastMessage>
</div>);
}
```

---
>title: Usage in toast-message
>tags: 
>context: toast-message
>content:

# Toast Message (fw-toast-message)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in toast-message
>tags: 
>context: toast-message
>content:

# Toast Message (fw-toast-message)
## Properties



Property: `actionLinkText`
Attribute: `action-link-text`
Description: The Content of the action link
Type: `string`
Default: `''`


Property: `content`
Attribute: `content`
Description: The content to be displayed in toast
Type: `string`
Default: `undefined`


Property: `open`
Attribute: `open`
Description: visibility prop of toast message
Type: `boolean`
Default: `false`


Property: `pauseOnHover`
Attribute: `pause-on-hover`
Description: Pause the toast from hiding on mouse hover
Type: `boolean`
Default: `undefined`


Property: `sticky`
Attribute: `sticky`
Description: won't close automatically
Type: `boolean`
Default: `false`


Property: `timeout`
Attribute: `timeout`
Description: Time duration of the toast visibility
Type: `number`
Default: `4000`


Property: `type`
Attribute: `type`
Description: Type of the toast - success,failure, warning, inprogress
Type: `"error" \| "inprogress" \| "success" \| "warning"`
Default: `'warning'`
---
>title: Events in toast-message
>tags: 
>context: toast-message
>content:

# Toast Message (fw-toast-message)
## Events



Event: `fwLinkClick`
Description: Triggered when the action link clicked.
Type: `CustomEvent<any>`


Event: `fwRemoveToast`
Description: Triggered on closing the toast message. This event gets used by the parent container to remove the toast message from itself
Type: `CustomEvent<any>`
---
>title: How to use toast-message in crayons ?
>tags: 
>context: toast-message
>content:

# Toast Message (fw-toast-message)
Toast Message used internally by Toast component to render toast message.
## Demo
```html live
<fw-toast-message
  open
  id="type_toast"
  sticky="true"
  type="success"
  content="success"
></fw-toast-message>
<fw-toast-message
  open
  id="type_toast"
  sticky="true"
  type="error"
  content="error"
></fw-toast-message>
<fw-toast-message
  open
  id="type_toast"
  type="warning"
  content="warning"
></fw-toast-message>
<fw-toast-message
  open
  id="type_toast"
  type="inprogress"
  content="inprogress"
></fw-toast-message>
<fw-toast-message
  type="success"
  id="custom-toast"
  sticky
  open
  action-link-text="Click me"
>
  <div
    style="display: flex;
    flex-direction: column;
    gap: 4px;"
  >
    <span
      style="font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    color: #12344D;"
      >Test content</span
    >
    <span
      style="font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;"
      >custom html contents can be added</span
    >
  </div>
</fw-toast-message>
```
<!-- Auto Generated Below -->
 

---
