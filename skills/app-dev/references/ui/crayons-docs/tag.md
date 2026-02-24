>title: tag - Usage in HTML
>tags: 
>context: tag
>content:

# Tag (fw-tag)
## Usage in HTML

```html
<fw-tag text="Option"></fw-tag>

<fw-tag id="avatarTag" variant="avatar" text="Option"></fw-tag>

<fw-tag id="avatarTagError" variant="avatar" text="Option" state="error"></fw-tag>

<fw-tag id="avatarTagFocused" variant="avatar" text="Option" is-focused></fw-tag>

<fw-tag id="avatarTagWithSubText" variant="avatar" text="Option" sub-text='<sub-text>'></fw-tag>

<fw-tag id="avatarTagTransparent" variant="avatar" text="Option" state="transparent"></fw-tag>

<div style="max-width: 200px; padding-top: 10px">
<fw-tag id="avatarTagWithEllipsis" variant="avatar" text="Option With Longest Text" sub-text='<sub-text>' show-ellipsis-on-overflow></fw-tag>
</div>

<script type="application/javascript">
avatarTag = document.getElementById('avatarTag');
avatarTagError = document.getElementById('avatarTagError');
avatarTagFocused = document.getElementById('avatarTagFocused');
avatarTagWithSubText = document.getElementById('avatarTagWithSubText');
avatarTagWithEllipsis = document.getElementById('avatarTagWithEllipsis');
avatarTag.graphicsProps = {
image:
'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
};
avatarTagError.graphicsProps = {
image:
'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
};
avatarTagFocused.graphicsProps = {
image:
'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
};
avatarTagWithSubText.graphicsProps = {
image:
'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
};
avatarTagTransparent.graphicsProps = {
image:
'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
};
avatarTagWithEllipsis.graphicsProps = {
image:
'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
};
</script>

````

---
>title: tag - Usage in React
>tags: 
>context: tag, react
>content:

# Tag (fw-tag)
## Usage in React

```jsx
import React from "react";
import { FwTag } from "@freshworks/crayons/react";

function App() {

return (<div>
<FwTag text="Option"></FwTag>

<FwTag variant="avatar" graphicsProps={{
image:
'https://images.dog.ceo/breeds/chow/n02112137_8862.jpg'
}} text="Chow Wolowitz"></FwTag>

<FwTag variant="avatar" graphicsProps={{
image:
'https://images.dog.ceo/breeds/chow/n02112137_8862.jpg'
}} text="Chow Wolowitz" state="error"></FwTag>

<FwTag variant="avatar" graphicsProps={{
image:
'https://images.dog.ceo/breeds/chow/n02112137_8862.jpg'
}} text="Chow Wolowitz" isFocused></FwTag>

<FwTag variant="avatar" graphicsProps={{
image:
'https://images.dog.ceo/breeds/chow/n02112137_8862.jpg'
}} text="Chow Wolowitz" subText="Best Pet"></FwTag>

<FwTag variant="avatar" graphicsProps={{
image:
'https://images.dog.ceo/breeds/chow/n02112137_8862.jpg'
}} text="Chow Wolowitz" state="transparent"></FwTag>

<div style={{ maxWidth: '250px' }}>
<FwTag variant="avatar" graphicsProps={{
image:
'https://images.dog.ceo/breeds/chow/n02112137_8862.jpg'
}} text="Chow Wolowitz" subText='<sub-text>' showEllipsisOnOverflow></FwTag>
</div>

</div >);
}

export default App;

````  

---
>title: Usage in tag
>tags: 
>context: tag
>content:

# Tag (fw-tag)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in tag
>tags: 
>context: tag
>content:

# Tag (fw-tag)
## Properties



Property: `closable`
Attribute: `closable`
Description: Whether the Tag can be closed.
Type: `boolean`
Default: `true`


Property: `disabled`
Attribute: `disabled`
Description: Sets the state of the tag to disabled. The close button is disabled. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `focusable`
Attribute: `focusable`
Description: Whether the Tag is focusable.
Type: `boolean`
Default: `true`


Property: `graphicsProps`
Attribute: --
Description: The props need to be passed for the variant. If the variant is avatar then use this prop to send the props for the fw-avatar component.
Type: `{}`
Default: `{}`


Property: `index`
Attribute: `index`
Description: Index of tag in a group of tags
Type: `number \| string`
Default: `'-1'`


Property: `isFocused`
Attribute: `is-focused`
Description: If true, tag will be focused
Type: `boolean`
Default: `false`


Property: `showEllipsisOnOverflow`
Attribute: `show-ellipsis-on-overflow`
Description: Truncate text with ellipsis when text overflows
Type: `boolean`
Default: `false`


Property: `state`
Attribute: `state`
Description: Theme based on which the tag is styled.
Type: `"error" \| "normal" \| "transparent"`
Default: `'normal'`


Property: `subText`
Attribute: `sub-text`
Description: Display sub text in the tag component.
Type: `string`
Default: `undefined`


Property: `text`
Attribute: `text`
Description: Display text in the tag component.
Type: `string`
Default: `undefined`


Property: `value`
Attribute: `value`
Description: Value associated with the tag component, that is saved when the form data is saved.
Type: `number \| string`
Default: `undefined`


Property: `variant`
Attribute: `variant`
Description: The variant of tag to be displayed.
Type: `"avatar" \| "standard"`
Default: `'standard'`
---
>title: Events in tag
>tags: 
>context: tag
>content:

# Tag (fw-tag)
## Events



Event: `fwClosed`
Description: Triggered when the tag is deselected.
Type: `CustomEvent<any>`
---
>title: How to use tag in crayons ?
>tags: 
>context: tag
>content:

# Tag (fw-tag)
fw-tag provides a child component that is used to enable selecting multiple options in the Select component.
## Demo
```html live
<fw-tag text="Option"></fw-tag>
<fw-tag id="avatarTag" variant="avatar" text="Option"></fw-tag>
<fw-tag id="avatarTagError" variant="avatar" text="Option" state="error"></fw-tag>
<fw-tag id="avatarTagFocused" variant="avatar" text="Option" is-focused></fw-tag>
<fw-tag id="avatarTagWithSubText" variant="avatar" text="Option" sub-text='<sub-text>'></fw-tag>
<fw-tag id="avatarTagTransparent" variant="avatar" text="Option" state="transparent"></fw-tag>
<div style="max-width: 200px; padding-top: 10px">
  <fw-tag id="avatarTagWithEllipsis" variant="avatar" text="Option With Longest Text" sub-text='<sub-text>' show-ellipsis-on-overflow></fw-tag>
</div>
<script type="application/javascript">
  avatarTag = document.getElementById('avatarTag');
  avatarTagError = document.getElementById('avatarTagError');
  avatarTagFocused = document.getElementById('avatarTagFocused');
  avatarTagWithSubText = document.getElementById('avatarTagWithSubText');
  avatarTagWithEllipsis = document.getElementById('avatarTagWithEllipsis');
  avatarTag.graphicsProps = {
    image:
      'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  };
  avatarTagError.graphicsProps = {
    image:
      'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  };
  avatarTagFocused.graphicsProps = {
    image:
      'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  };
  avatarTagWithSubText.graphicsProps = {
    image:
      'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  };
  avatarTagTransparent.graphicsProps = {
    image:
      'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  };
  avatarTagWithEllipsis.graphicsProps = {
    image:
      'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  };
</script>
```
<!-- Auto Generated Below -->
## Methods
### `setFocus() => Promise<any>`
#### Returns
Type: `Promise<any>`
 

---
