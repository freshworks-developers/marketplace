>title: Properties in drag-item
>tags: 
>context: drag-item
>content:

# Drag Item (fw-drag-item)
## Properties



Property: `disabled`
Attribute: `disabled`
Description: Whether the drag is disabled or not.
Type: `boolean`
Default: `false`


Property: `pinned`
Attribute: `pinned`
Description: Pinned position of the drag item, other drag item cannot be placed above or below it.
Type: `"bottom" \| "top"`
Default: `undefined`


Property: `showDragIcon`
Attribute: `show-drag-icon`
Description: Whether the drag icon should be visible.
Type: `boolean`
Default: `true`
---
>title: How to use drag-item in crayons ?
>tags: 
>context: drag-item
>content:

# Drag Item (fw-drag-item)
fw-drag-item can used as a row component inside fw-drag-container.
## Demo
fw-drag-item can be dragged via clicking and holding the mouse on the drag-icon.
```html live
<fw-drag-item>
  <span>Drag Me via the drag icon</span>
</fw-drag-item>
```
<!-- Auto Generated Below -->

---
