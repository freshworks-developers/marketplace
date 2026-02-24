>title: toast - Usage in HTML
>tags: 
>context: toast
>content:

# Toast (fw-toast)
## Usage in HTML

```html
<fw-toast id="type_toast"></fw-toast>
<fw-toast id="type_toast_right" position="top-right"></fw-toast>
<fw-toast id="type_toast_left" position="top-left"></fw-toast>

<fw-toast-message type='success' id="custom-toast" timeout="6000">
<div>
<span class="custom-text">Custom content</span>
<h4>custom html contents can be added</h4>
<button onclick="alert('clicked')">custom btn</button>
</div>
</fw-toast-message>

<fw-toast-message type="success" id="custom-toast1" sticky action-link-text="Click me">
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

<fw-button onclick="document.querySelector('#type_toast').trigger({type:'success', content: 'Successfullly triggered'})">Success</fw-button>
<fw-button onclick="document.querySelector('#type_toast_right').trigger({type:'error', content:'something went wrong!'})">Error</fw-button>
<fw-button onclick="document.querySelector('#type_toast_left').trigger({type:'warning', content:'This is a warning!'})">Warning</fw-button>
<fw-button onclick="document.querySelector('#type_toast').trigger({type:'inprogress', content:'Request is in progress'})">Inprogress</fw-button>
<fw-button onclick="document.querySelector('#type_toast').trigger({type:'success', contentref:'#custom-toast'})">Custom Toast Content</fw-button>
<fw-button onclick="document.querySelector('#type_toast').trigger({type:'success', contentref:'#custom-toast1'})">Custom Toast Content1</fw-button>

````

---
>title: toast - Usage in React
>tags: 
>context: toast, react
>content:

# Toast (fw-toast)
## Usage in React

```jsx
import React, {useRef, useEffect} from "react";
import ReactDOM from "react-dom";
import { FwButton, ToastController, FwToast, FwToastMessage } from "@freshworks/crayons/react";
function App() {
const el = useRef(null);
const el1 = useRef(null);
const toast = ToastController({ position:'top-right'})

useEffect(() => {
el1.current.onclick = function() {
console.log("custom action handled here");
}
},[])

return (<div>

<FwToastMessage type='success' id="custom-temp">
<div>
<FwButton onclick={()=> console.log("custom action here")}>custom action element</FwButton>
<FwButton ref={el1}>custom action element in Typescript apps</FwButton>
<p> Please make sure here in the above element, the event handler name is in lowercase. use `onclick` instead of `onClick`. </p>
<p className="cus-style">custom style element</p>
</div>
</FwToastMessage>

<FwToastMessage
type='success'
id='custom-toast1'
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

<FwToast id="type_toast" ref={el} timeout={5000}></FwToast>

<FwButton onClick={()=> toast.trigger({type:'success', content: 'Successfullly triggered'})}>Success</FwButton>
<FwButton onClick={()=> el.current.trigger({type:'error', content:'something went wrong!'})}>Error</FwButton>
<FwButton onClick={()=> el.current.trigger({type:'warning', content:'This is a warning!'})}>Warning</FwButton>
<FwButton onClick={()=> el.current.trigger({type:'inprogress', content:'Request is in progress'})}>Inprogress</FwButton>
<FwButton onClick={() => toast.trigger({contentref:'#custom-temp'})}>trigger custom </FwButton>

<FwButton onClick={() => toast.trigger({contentref:'#custom-toast1'})}>trigger custom 1 </FwButton>
</div>);
}
````  

---
>title: Custom template event naming in toast
>tags: 
>context: toast
>content:

# Toast (fw-toast)
## ToastOptions
### Custom template event naming
Please make sure when using event handler inside `custom template` in a `React app`, the event handler name is in `lowercase`. For example use `onclick` instead of `onClick`. This helps in cloning the event handlers used in the template when displaying multiple toast messages.
Refer [usage](#usage)  
```js
useEffect(() => {
el1.current.onclick = function() {
console.log("custom action handled here");
}
},[])
<FwButton onclick={()=> console.log("custom action here")}>Action button</FwButton>
<FwButton ref={el1}>In Typescript apps</FwButton>
```  
<!-- Auto Generated Below -->
---
>title: Properties in toast
>tags: 
>context: toast
>content:

# Toast (fw-toast)
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


Property: `pauseOnHover`
Attribute: `pause-on-hover`
Description: Pause the toast from hiding on mouse hover
Type: `boolean`
Default: `undefined`


Property: `position`
Attribute: `position`
Description: position of the toast notification in screen
Type: `"top-center" \| "top-left" \| "top-right"`
Default: `'top-center'`


Property: `shouldPreventDuplicates`
Attribute: `should-prevent-duplicates`
Description: Prevent rendering the duplicate toasters at the same time
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
>title: How to use toast in crayons ?
>tags: 
>context: toast
>content:

# Toast (fw-toast)
Toasts are used to show pop-up messages that lasts on the screen for a while. Use them to show users alerts or messages. You can also use custom HTML content with in toast
## Demo
```html live
<fw-toast id="type_toast"></fw-toast>
<fw-toast id="type_toast_right" position="top-right"></fw-toast>
<fw-toast id="type_toast_left" position="top-left"></fw-toast>
<fw-toast-message type="success" id="custom-toast" timeout="6000">
  <div>
    <span class="custom-text">Custom content</span>
    <h4>custom html contents can be added</h4>
    <button onclick="alert('clicked')">custom btn</button>
  </div>
</fw-toast-message>
<fw-toast-message
  type="success"
  id="custom-toast1"
  sticky
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
<fw-button
  onclick="document.querySelector('#type_toast').trigger({type:'success', content: 'Successfullly triggered'})"
  >Success</fw-button
>
<fw-button
  onclick="document.querySelector('#type_toast_right').trigger({type:'error', content:'something went wrong!'})"
  >Error</fw-button
>
<fw-button
  onclick="document.querySelector('#type_toast_left').trigger({type:'warning', content:'This is a warning!'})"
  >Warning</fw-button
>
<fw-button
  onclick="document.querySelector('#type_toast').trigger({type:'inprogress', content:'Request is in progress'})"
  >Inprogress</fw-button
>
<fw-button
  onclick="document.querySelector('#type_toast').trigger({type:'success', contentref:'#custom-toast'})"
  >Custom Toast Content</fw-button
>
<fw-button
  onclick="document.querySelector('#type_toast').trigger({type:'success', contentref:'#custom-toast1'})"
  >Custom Toast Content 1</fw-button
>
```
## Custom Z-index
You can use `--fw-toast-zindex` css variable to set custom z-index for the toast stack.
## ToastController
You can also use `ToastController` to create Toast like below:
```js
Javascript - import {  ToastController } from "@freshworks/crayons"
React - import {  ToastController } from "@freshworks/crayons/react"
```
Create an instance of `ToastController` by passing [ToastOptions](#toastoptions) (optional) and use [Methods](#methods) to manage toast
```js
const toast = ToastController({ position: 'top-right' });
toast.trigger({ type: 'success', content: 'Successfullly triggered' });
```
## ToastOptions
Below is the interface for `ToastOptions` that can be used for creating the toast
```js
interface ToastOptions {
  /**
   * The Content of the action link
   */
  actionLinkText?: string;
  /**
   * The content to be displayed in toast
   */
  content?: string;
  /**
   * The document selector for the toast-message component
   * which can be used to embed custom html content in the toast message
   */
  contentref?: string;
  /**
   * Pause the toast from hiding on mouse hover
   */
  pauseOnHover?: boolean;
  /**
   * won't close automatically
   * Default is `false`
   */
  sticky?: boolean;
  /**
   * Time duration of the toast visibility
   * Default is `4000`
   */
  timeout?: number;
  /**
   * Type of the toast - success,failure, warning, inprogress
   * Default is `warning`
   */
  type?: 'success' | 'error' | 'warning' | 'inprogress';
  /**
   *  position of the toast notification in screen
   *  Default is `top-center`
   */
  position?: 'top-center' | 'top-left' | 'top-right';
}
```
## Methods
### `trigger(opts: ToastOptions) => Promise<void>`
#### Returns
Type: `Promise<void>`

---
