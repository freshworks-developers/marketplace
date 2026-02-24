>title: Properties in file-2
>tags: 
>context: file-2
>content:

# fw-attachment
## Properties



Property: `addedToLibrary`
Attribute: `added-to-library`
Description: Boolean value to set if the attachment is added in library or not
Type: `boolean`
Default: `false`


Property: `enableLibraryAdding`
Attribute: `enable-library-adding`
Description: To enable library adding related feature
Type: `boolean`
Default: `false`


Property: `errorMessage`
Attribute: `error-message`
Description: Error message text to display below the attachment
Type: `string`
Default: `''`


Property: `index`
Attribute: `index`
Description: Index order of the attachment file starting from 0
Type: `number`
Default: `-1`


Property: `isPrivateMode`
Attribute: `is-private-mode`
Description: Set private mode for different styles
Type: `boolean`
Default: `false`


Property: `label`
Attribute: `label`
Description: Name of the attachment file to be displayed (including the file extension)
Type: `string`
Default: `''`


Property: `parseSize`
Attribute: `parse-size`
Description: Boolean used to display size as passed or convert them to relatives like KB, MB etc...
Type: `boolean`
Default: `true`


Property: `size`
Attribute: `size`
Description: Size of the attachment in bytes
Type: `number`
Default: `0`


Property: `state`
Attribute: `state`
Description: State of the attachment for styling
Type: `"error" \| "failed" \| "loading" \| "normal"`
Default: `'normal'`


Property: `type`
Attribute: `type`
Description: File type
Type: `string`
Default: `null`


Property: `value`
Attribute: `value`
Description: Value or id related to the attached file
Type: `any`
Default: `undefined`
---
>title: Events in file-2
>tags: 
>context: file-2
>content:

# fw-attachment
## Events



Event: `fwDelete`
Description: Event triggered to delete the attachment file
Type: `CustomEvent<any>`


Event: `fwModifyLibrary`
Description: Event triggered to add / remove file from the library
Type: `CustomEvent<any>`


Event: `fwReupload`
Description: Event triggered to reupload
Type: `CustomEvent<any>`
---
>title: How to use file-2 in crayons ?
>tags: 
>context: file-2
>content:

# fw-attachment
<!-- Auto Generated Below -->
 

---
