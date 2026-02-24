>title: inline-message - Usage in HTML
>tags: 
>context: inline-message
>content:

# Inline Message (fw-inline-message)
## Usage in HTML

``` html
<section>
<fw-label value="Try types"></fw-label>
<fw-inline-message open type="error">This is an error alert message.</fw-inline-message>
<fw-inline-message open type="info">This is an info alert message.</fw-inline-message>
<fw-inline-message open type="warning">This is a warning alert message.</fw-inline-message>
<fw-inline-message open type="success">This is a success alert message.</fw-inline-message>
</section>
<br />
<section>
<fw-label value="Try types with closable alerts"></fw-label>
<fw-inline-message open closable type="error">This is an error alert message with close option.</fw-inline-message>
<fw-inline-message open closable type="info">This is an info alert message with close option.</fw-inline-message>
<fw-inline-message open closable type="warning">This is a warning alert message with close option.</fw-inline-message>
<fw-inline-message open closable type="success">This is a success alert message with close option.</fw-inline-message>
</section>
<br />
```

---
>title: inline-message - Usage in React
>tags: 
>context: inline-message, react
>content:

# Inline Message (fw-inline-message)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FWLabel, FwInlineMessage } from "@freshworks/crayons/react";
function App() {
return (<div>
<section>
<FwLabel value="Try types"></FwLabel>
<FwInlineMessage open type="error">This is an error alert message.</FwInlineMessage>
<FwInlineMessage open type="info">This is an info alert message.</FwInlineMessage>
<FwInlineMessage open type="warning">This is a warning alert message.</FwInlineMessage>
<FwInlineMessage open type="success">This is a success alert message.</FwInlineMessage>
</section>
<br />
<section>
<FwLabel value="Try types with closable alerts"></FwLabel>
<FwInlineMessage open closable type="error">This is an error alert message with close option.</FwInlineMessage>
<FwInlineMessage open closable type="info">This is an info alert message with close option.</FwInlineMessage>
<FwInlineMessage open closable type="warning">This is a warning alert message with close option.</FwInlineMessage>
<FwInlineMessage open closable type="success">This is a success alert message with close option.</FwInlineMessage>
</section>
<br />
</div>)
}
```

---
>title: Usage in inline-message
>tags: 
>context: inline-message
>content:

# Inline Message (fw-inline-message)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in inline-message
>tags: 
>context: inline-message
>content:

# Inline Message (fw-inline-message)
## Properties



Property: `closable`
Attribute: `closable`
Description: Makes the inline message closable.
Type: `boolean`
Default: `true`


Property: `duration`
Attribute: `duration`
Description: The duration in milliseconds for which inline message will be shown.
Type: `number`
Default: `Infinity`


Property: `open`
Attribute: `open`
Description: Indicates whether the inline message is open or not.
Type: `boolean`
Default: `true`


Property: `type`
Attribute: `type`
Description: The type of inline message to be displayed. Defaults to info.
Type: `"error" \| "info" \| "success" \| "warning"`
Default: `'info'`
---
>title: Events in inline-message
>tags: 
>context: inline-message
>content:

# Inline Message (fw-inline-message)
## Events



Event: `fwHide`
Description: Triggered when inline message is hidden.
Type: `CustomEvent<any>`


Event: `fwShow`
Description: Triggered when inline message is shown.
Type: `CustomEvent<any>`
---
>title: How to use inline-message in crayons ?
>tags: 
>context: inline-message
>content:

# Inline Message (fw-inline-message)
fw-inline-message displays an alert on the user interface and enables displaying additional information to the context of the page.
## Demo
```html live
<section>
  <fw-label value="Try types"></fw-label>
  <fw-inline-message open type="error">This is an error alert message.</fw-inline-message>
  <fw-inline-message open type="info">This is an info alert message.</fw-inline-message>
  <fw-inline-message open type="warning">This is a warning alert message.</fw-inline-message>
  <fw-inline-message open type="success">This is a success alert message.</fw-inline-message>
</section>
<br />
<section>
  <fw-label value="Try types with closable alerts"></fw-label>
  <fw-inline-message open closable type="error">This is an error alert message with close option.</fw-inline-message>
  <fw-inline-message open closable type="info">This is an info alert message with close option.</fw-inline-message>
  <fw-inline-message open closable type="warning">This is a warning alert message with close option.</fw-inline-message>
  <fw-inline-message open closable type="success">This is a success alert message with close option.</fw-inline-message>
</section>
<br />
```
<!-- Auto Generated Below -->
## Methods
### `hide() => Promise<void>`
#### Returns
Type: `Promise<void>`
### `show() => Promise<void>`
#### Returns
Type: `Promise<void>`
 

---
