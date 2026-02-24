>title: pagination - Usage in HTML
>tags: 
>context: pagination
>content:

# Pagination (fw-pagination)
## Usage in HTML

```html
<fw-pagination per-page="20" total="50"></fw-pagination><br>
<fw-pagination total="50"></fw-pagination><br />
<fw-pagination
page="2"
per-page="10"
total="50"
></fw-pagination>
```

---
>title: pagination - Usage in React
>tags: 
>context: pagination, react
>content:

# Pagination (fw-pagination)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwPagination } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwPagination per-page="20" total="50"></FwPagination><br/>
<FwPagination total="50"></FwPagination>
<FwPagination page="2"
per-page="10"
total="50"></FwPagination>
</div>)
}
```

---
>title: Usage in pagination
>tags: 
>context: pagination
>content:

# Pagination (fw-pagination)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in pagination
>tags: 
>context: pagination
>content:

# Pagination (fw-pagination)
## Properties



Property: `buttonGroupLabel`
Attribute: `button-group-label`
Description: Aria Label to be used for the button group.
Type: `string`
Default: `''`


Property: `isLoading`
Attribute: `is-loading`
Description: Indicates if the records in current page are being fetched.
Type: `boolean`
Default: `false`


Property: `nextButtonLabel`
Attribute: `next-button-label`
Description: Aria Label to be used for next button.
Type: `string`
Default: `''`


Property: `page`
Attribute: `page`
Description: The current page number.
Type: `number`
Default: `1`


Property: `perPage`
Attribute: `per-page`
Description: The number of records to be shown per page. Defaults to 10.
Type: `number`
Default: `10`


Property: `previousButtonLabel`
Attribute: `previous-button-label`
Description: Aria Label to be used for previous button.
Type: `string`
Default: `''`


Property: `total`
Attribute: `total`
Description: The total number of records. This is a mandatory parameter.
Type: `number`
Default: `undefined`
---
>title: Events in pagination
>tags: 
>context: pagination
>content:

# Pagination (fw-pagination)
## Events



Event: `fwChange`
Description: Triggered when either previous or next button is clicked.
Type: `CustomEvent<any>`
---
>title: How to use pagination in crayons ?
>tags: 
>context: pagination
>content:

# Pagination (fw-pagination)
fw-pagination displays pagination. The component displays starting and ending record numbers against total number of records.
## Demo
```html live
<fw-pagination per-page="20" total="50"></fw-pagination><br />
<fw-pagination total="50"></fw-pagination><br />
<fw-pagination page="2" per-page="10" total="50"></fw-pagination>
```
<!-- Auto Generated Below -->
## Methods
### `nextPage() => Promise<void>`
Navigates to next set of records if available.
#### Returns
Type: `Promise<void>`
### `previousPage() => Promise<void>`
Navigates to previous set of records if available.
#### Returns
Type: `Promise<void>`

---
