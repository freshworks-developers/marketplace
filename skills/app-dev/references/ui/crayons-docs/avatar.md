>title: avatar - Usage in HTML
>tags: 
>context: avatar
>content:

# Avatar (fw-avatar)
## Usage in HTML

``` html
<section>
<fw-avatar
size="medium"
image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"></fw-avatar>
<fw-avatar
size="small"
image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"></fw-avatar>
</section>
<section>
<fw-avatar size="medium" image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"> </fw-avatar>
<fw-avatar size="small" image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"> </fw-avatar>
</section>
<section>
<fw-avatar mode="dark" initials="PT"></fw-avatar>
<fw-avatar mode="light" initials="PT"></fw-avatar>
<fw-avatar mode="error" initials="PT"></fw-avatar>
</section>
<section>
<fw-avatar size="xsmall"></fw-avatar>
<fw-avatar mode="error" size="xsmall"></fw-avatar>
</section>
```

---
>title: avatar - Usage in React
>tags: 
>context: avatar, react
>content:

# Avatar (fw-avatar)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwAvatar } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwAvatar  image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"></FwAvatar>

<FwAvatar  mode="dark" initials="PT" ></FwAvatar>
<FwAvatar  mode="light" initials="PT" ></FwAvatar>
<FwAvatar  mode="error" initials="PT" ></FwAvatar>

<FwAvatar size="xsmall"></FwAvatar>
<FwAvatar  mode="error" size="xsmall"></FwAvatar>

<FwAvatar  size="medium" image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300 q=80"></FwAvatar>
<FwAvatar  size="small"  image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"></FwAvatar>

</div>)
}
```

---
>title: Usage in avatar
>tags: 
>context: avatar
>content:

# Avatar (fw-avatar)
## Usage

<!-- Auto Generated Below -->
---
>title: Properties in avatar
>tags: 
>context: avatar
>content:

# Avatar (fw-avatar)
## Properties

---
>title: How to use avatar in crayons ?
>tags: 
>context: avatar
>content:

# Avatar (fw-avatar)
Avatars are used to represent a person or object.
## Demo
```html live
<section>
  <fw-avatar
    size="medium"
    image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  ></fw-avatar>
  <fw-avatar initials="PT"></fw-avatar>
  <fw-avatar name="Patrick Goodwin"></fw-avatar>
</section>
```
Avatar of different sizes
```html live
<section>
  <fw-avatar
    size="medium"
    image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  ></fw-avatar>
  <fw-avatar
    size="small"
    image="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  ></fw-avatar>
</section>
```
Avatar with different modes
```html live
<section>
  <fw-avatar mode="dark" initials="PT"></fw-avatar>
  <fw-avatar mode="light" initials="PT"></fw-avatar>
  <fw-avatar mode="error" initials="PT"></fw-avatar>
</section>
```
Avatar with default avatar icons 
```html live
<section>
  <fw-avatar size="xsmall"></fw-avatar>
  <fw-avatar mode="error" size="xsmall"></fw-avatar>
</section>
```
<!-- Auto Generated Below -->
## Shadow Parts
| Part         | Description |
| ------------ | ----------- |
| `"image"`    |             |
| `"initials"` |             |
 

---
