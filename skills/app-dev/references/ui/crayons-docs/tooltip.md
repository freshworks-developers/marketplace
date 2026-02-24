>title: Basic demo in tooltip
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### Basic demo
```html live
<fw-tooltip content="This is the first tooltip example">
<fw-button> Show tooltip </fw-button>
</fw-tooltip>
```
---
>title: tooltip - Basic usage in HTML
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### Basic usage in HTML

```html
<fw-tooltip content="This is the first tooltip example">
<fw-button> Show tooltip </fw-button>
</fw-tooltip>
```

---
>title: tooltip - Basic usage in React
>tags: 
>context: tooltip, react
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### Basic usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwButton, FwTooltip } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwTooltip content="This is the first tooltip example">
<FwButton> Show tooltip </FwButton>
</FwTooltip>
</div>);
}
```

---
>title: Placement demo in tooltip
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### Placement demo
```html live
<template>
<div>
<div>
Hover over the tiles:
<br /><br /><br />
</div>
<div class="tooltip-placement-example">
<div class="tooltip-placement-example-row">
<fw-tooltip content="top-start" placement="top-start">
<button></button>
</fw-tooltip>

<fw-tooltip content="top" placement="top">
<button></button>
</fw-tooltip>

<fw-tooltip content="top-end" placement="top-end">
<button></button>
</fw-tooltip>
</div>

<div class="tooltip-placement-example-row">
<fw-tooltip content="left-start" placement="left-start">
<button></button>
</fw-tooltip>

<fw-tooltip content="right-start" placement="right-start">
<button></button>
</fw-tooltip>
</div>

<div class="tooltip-placement-example-row">
<fw-tooltip content="left" placement="left">
<button></button>
</fw-tooltip>

<fw-tooltip content="right" placement="right">
<button></button>
</fw-tooltip>
</div>

<div class="tooltip-placement-example-row">
<fw-tooltip content="left-end" placement="left-end">
<button></button>
</fw-tooltip>

<fw-tooltip content="right-end" placement="right-end">
<button></button>
</fw-tooltip>
</div>

<div class="tooltip-placement-example-row">
<fw-tooltip content="bottom-start" placement="bottom-start">
<button></button>
</fw-tooltip>

<fw-tooltip content="bottom" placement="bottom">
<button></button>
</fw-tooltip>

<fw-tooltip content="bottom-end" placement="bottom-end">
<button></button>
</fw-tooltip>
</div>
</div>
</div>
</template>

<style>
.tooltip-placement-example {
width: 270px;
margin-left: calc(50% - 135px);
}

.tooltip-placement-example-row {
display: flex;
justify-content: space-between;
}

.tooltip-placement-example button {
display: block;
height: 50px;
width: 50px;
border: 0px;
background-color: rgb(38, 73, 102);
background-image: linear-gradient(rgb(38, 73, 102), rgb(18, 52, 77));
border-radius: 4px;
margin: 2px;
}

.tooltip-placement-example-row:first-child, .tooltip-placement-example-row:last-child {
justify-content: center;
}
</style>
```
---
>title: Triggers demo in tooltip
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### Triggers demo
```html live
<div>
Activating through click:
<br /><br />
</div>
<fw-tooltip placement="right" trigger="click" content="This is the tooltip that activates on click">
<fw-button> Click </fw-button>
</fw-tooltip>
<div>
<br /><br />
Activating through hover:
<br /><br />
</div>
<fw-tooltip placement="right" trigger="hover" content="This is the tooltip that activates on hover">
<fw-button> Hover </fw-button>
</fw-tooltip>
<div>
<br /><br />
Activating through manual trigger outside tooltip:
<br /><br />
</div>
<fw-tooltip placement="right" id="tooltip" trigger="manual" content="Alice Schneier">
<fw-avatar initials="AS"></fw-avatar>
</fw-tooltip>
<div><br /><fw-button id="trigger"> Show Name </fw-button></div>
<script type="application/javascript">
document.getElementById("trigger").addEventListener("click", function () {
document.getElementById("tooltip").show();
})
</script>
```
---
>title: tooltip - Triggers usage in HTML
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### Triggers usage in HTML

```html
<div>
Activating through click:
<br /><br />
</div>
<fw-tooltip placement="right" trigger="click" content="This is the tooltip that activates on click">
<fw-button> Click </fw-button>
</fw-tooltip>
<div>
<br /><br />
Activating through hover:
<br /><br />
</div>
<fw-tooltip placement="right" trigger="hover" content="This is the tooltip that activates on hover">
<fw-button> Hover </fw-button>
</fw-tooltip>
<div>
<br /><br />
Activating through manual trigger outside tooltip:
<br /><br />
</div>
<fw-tooltip placement="right" id="tooltip" trigger="manual" content="Alice Schneier">
<fw-avatar initials="AS"></fw-avatar>
</fw-tooltip>
<div><br /><fw-button id="trigger"> Show Name </fw-button></div>
<script type="application/javascript">
document.getElementById("trigger").addEventListener("click", function () {
document.getElementById("tooltip").show();
})
</script>
```

---
>title: tooltip - Triggers usage in React
>tags: 
>context: tooltip, react
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### Triggers usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwButton, FwTooltip, FwAvatar } from "@freshworks/crayons/react";
function App() {
const triggerRef = useRef(null);
const tooltipRef = useRef(null);
return (<div>
<div>
Activating through click:
<br /><br />
</div>
<FwTooltip placement="right" trigger="click" content="This is the tooltip that activates on click">
<FwButton> Click </FwButton>
</FwTooltip>
<div>
<br /><br />
Activating through hover:
<br /><br />
</div>
<FwTooltip placement="right" trigger="hover" content="This is the tooltip that activates on hover">
<FwButton> Hover </FwButton>
</FwTooltip>
<div>
<br /><br />
Activating through manual trigger outside tooltip:
<br /><br />
</div>
<FwTooltip placement="right" id="tooltip" trigger="manual" content="Alice Schneier" ref={tooltipRef}>
<FwAvatar initials="AS"></FwAvatar>
</FwTooltip>
<div><br /><FwButton ref={triggerRef} onClick={() => tooltipRef.current.show()}> Show Name </FwButton></div>
</div>);
}
```

---
>title: HTML in Tooltip in tooltip
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### HTML in Tooltip
```html live
<fw-tooltip>
<fw-button> Show tooltip </fw-button>
<div slot="tooltip-content">
This tooltip has <b>HTML</b> content.
</div>
</fw-tooltip>
```
---
>title: tooltip - HTML in tooltip Usage in HTML
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### HTML in tooltip Usage in HTML

```html
<fw-tooltip>
<fw-button> Show tooltip </fw-button>
<div slot="tooltip-content">
This tooltip has <b>HTML</b> content.
</div>
</fw-tooltip>
```

---
>title: tooltip - HTML in tooltip Usage in React
>tags: 
>context: tooltip, react
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### HTML in tooltip Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwButton, FwTooltip } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwTooltip>
<FwButton> Show tooltip </FwButton>
<div slot="tooltip-content">
This tooltip has <b>HTML</b> content.
</div>
</FwTooltip>
</div>);
}
```

---
>title: Hoisting in tooltip
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### Hoisting
```html live
<template>
<div class="limit">
<fw-tooltip content="This is a tooltip">
<fw-button> No hoist </fw-button>
</fw-tooltip>
<fw-tooltip content="This is a hoisted tooltip" hoist>
<fw-button> Hoist </fw-button>
</fw-tooltip>
</div>
</template>
<style>
.limit {
position: relative;
display: inline-block;
overflow: hidden;
padding: 15px 0px;
}
</style>
```
---
>title: tooltip - Hoisting usage in HTML
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### Hoisting usage in HTML

```html
<template>
<div class="limit">
<fw-tooltip content="This is a tooltip">
<fw-button> No hoist </fw-button>
</fw-tooltip>
<fw-tooltip content="This is a hoisted tooltip" hoist>
<fw-button> Hoist </fw-button>
</fw-tooltip>
</div>
</template>
<style>
.limit {
position: relative;
display: inline-block;
overflow: hidden;
padding: 15px 0px;
}
</style>
```

---
>title: Hoisting usage in tooltip
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Demo & Usage
#### Hoisting usage
  
<!-- Auto Generated Below -->
---
>title: Properties in tooltip
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
## Properties



Property: `content`
Attribute: `content`
Description: Content of the tooltip.
Type: `string`
Default: `''`


Property: `distance`
Attribute: `distance`
Description: Distance defines the distance between the popover trigger and the popover content along y-axis.
Type: `string`
Default: `'10'`


Property: `fallbackPlacements`
Attribute: --
Description: Alternative placement for popover if the default placement is not possible.
Type: `[PopoverPlacementType]`
Default: `['top']`


Property: `header`
Attribute: `header`
Description: Header of the tooltip.
Type: `string`
Default: `''`


Property: `hoist`
Attribute: `hoist`
Description: Option to prevent the tooltip from being clipped when the component is placed inside a container with `overflow: auto\|hidden\|scroll`.
Type: `boolean`
Default: `false`


Property: `placement`
Attribute: `placement`
Description: Placement of the popover content with respect to the popover trigger.
Type: `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"`
Default: `'top'`


Property: `trigger`
Attribute: `trigger`
Description: The trigger event on which the popover-content is displayed. The available options are 'click' \| 'manual' \| 'hover', in case of 'manual' no trigger event will be set.
Type: `"click" \| "hover" \| "manual"`
Default: `'hover'`
---
>title: How to use tooltip in crayons ?
>tags: 
>context: tooltip
>content:

# Tooltip (fw-tooltip)
Tooltips are used to show additional information on a target during hover interactions.
## Demo & Usage
<!-- Auto Generated Below -->
## Methods
### `hide() => Promise<boolean>`
Hides the tooltip.
#### Returns
Type: `Promise<boolean>`
promise that resolves to true
### `show() => Promise<boolean>`
Shows the tooltip.
#### Returns
Type: `Promise<boolean>`
promise that resolves to true
 

---
