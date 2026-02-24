>title: tabs - Usage in HTML
>tags: 
>context: tabs
>content:

# Tabs (fw-tabs)
## Usage in HTML

```html
<fw-tabs>
<fw-tab slot="tab" panel="personal">Personal</fw-tab>
<fw-tab slot="tab" panel="official">Official</fw-tab>

<fw-tab-panel name="personal">
<fw-input
label="Name"
icon-left="add-contact"
warning-text="Do not enter your user ID"
state="warning"
placeholder="Enter your official name"
required
clear-input>
</fw-input>
<fw-button color="secondary">Submit</fw-button>
<fw-button color="secondary">Save</fw-button>
</fw-tab-panel>

<fw-tab-panel name="official">
<fw-select multiple label="Select location of preference" required="true">
<fw-select-option value="1">Chennai</fw-select-option>
<fw-select-option value="2">Bangalore</fw-select-option>
<fw-select-option value="3">Hyderabad</fw-select-option>
</fw-select>
<fw-button color="secondary">Submit</fw-button>
<fw-button color="secondary">Save</fw-button>
</fw-tab-panel>
</fw-tabs>
```

---
>title: tabs - Usage in React
>tags: 
>context: tabs, react
>content:

# Tabs (fw-tabs)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwButton, FwSelect, FwSelectOption, FwInput, FwTabs, FwTab, FwTabPanel } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwTabs>
<FwTab slot="tab" panel="personal">Personal</FwTab>
<FwTab slot="tab" panel="official">Official</FwTab>

<FwTabPanel name="personal">
<FwInput
label="Name"
iconLeft="add-contact"
warningText="Do not enter your user ID"
state="warning"
placeholder="Enter your official name"
required
clearInput>
</FwInput>
<FwButton color="secondary">Submit</FwButton>
<FwButton color="secondary">Save</FwButton>
</FwTabPanel>

<FwTabPanel name="official">
<FwSelect multiple label="Select location of preference" required="true">
<FwSelectOption value="1">Chennai</FwSelectOption>
<FwSelectOption value="2">Bangalore</FwSelectOption>
<FwSelectOption value="3">Hyderabad</FwSelectOption>
</FwSelect>
<FwButton color="secondary">Submit</FwButton>
<FwButton color="secondary">Save</FwButton>
</FwTabPanel>
</FwTabs>
</div>);

}

```

---
>title: Usage in tabs
>tags: 
>context: tabs
>content:

# Tabs (fw-tabs)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in tabs
>tags: 
>context: tabs
>content:

# Tabs (fw-tabs)
## Properties



Property: `activeTabIndex`
Attribute: `active-tab-index`
Description: The index of the tab to be activated (Starts from 0)
Type: `number`
Default: `0`


Property: `activeTabName`
Attribute: `active-tab-name`
Description: The name of the tab to be activated. If present, will be taken as priority over `activeTabIndex`.
Type: `string`
Default: `undefined`


Property: `label`
Attribute: `label`
Description: Describes the purpose of set of tabs.
Type: `string`
Default: `''`


Property: `variant`
Attribute: `variant`
Description: The style of tab headers that needs to be displayed, box will display headers in a container.
Type: `"box" \| "normal"`
Default: `'normal'`
---
>title: Events in tabs
>tags: 
>context: tabs
>content:

# Tabs (fw-tabs)
## Events



Event: `fwChange`
Description: Triggered when a the view switches to a new tab.
Type: `CustomEvent<any>`
---
>title: CSS Custom Properties in tabs
>tags: 
>context: tabs
>content:

# Tabs (fw-tabs)
## CSS Custom Properties



Name: `--fw-tabs-border-block-end`
Description: border bottom style of tabs


Name: `--fw-tabs-height`
Description: height of the tab container.


Name: `--fw-tabs-margin-inline-end`
Description: Right margin if direction is left-to-right, and Left margin if direction is right-to-left for the tab items


Name: `--fw-tabs-margin-inline-start`
Description: Left margin if direction is left-to-right, and Right margin if direction is right-to-left for the tab items


Name: `--fw-tabs-padding-inline-end`
Description: Right padding if direction is left-to-right, and Left padding if direction is right-to-left for the tab items


Name: `--fw-tabs-padding-inline-start`
Description: Left padding if direction is left-to-right, and Right padding if direction is right-to-left for the tab items


Name: `--fw-tabs-width`
Description: width of the tab container.
---
>title: How to use tabs in crayons ?
>tags: 
>context: tabs
>content:

# Tabs (fw-tabs)
fw-tabs displays a series of tabs on the user interface and enables tab-style navigation. The component doesn’t have any attributes that impart styling, it merely functions as a container for the tabs. It makes use of `fw-tab` and `fw-tab-panel`. Each tab must be slotted into `tab` slot and panel must refer to fw-tab-panel of same name.
## Demo
```html live
<fw-tabs>
  <fw-tab slot="tab" panel="personal">Personal</fw-tab>
  <fw-tab slot="tab" panel="official">Official</fw-tab>
  <fw-tab-panel name="personal">
    <fw-input
      label="Name"
      icon-left="add-contact"
      warning-text="Do not enter your user ID"
      state="warning"
      placeholder="Enter your official name"
      required
      clear-input
    >
    </fw-input>
    <fw-button color="secondary">Submit</fw-button>
    <fw-button color="secondary">Save</fw-button>
  </fw-tab-panel>
  <fw-tab-panel name="official">
    <fw-select multiple label="Select location of preference" required="true">
      <fw-select-option value="1">Chennai</fw-select-option>
      <fw-select-option value="2">Bangalore</fw-select-option>
      <fw-select-option value="3">Hyderabad</fw-select-option>
    </fw-select>
    <fw-button color="secondary">Submit</fw-button>
    <fw-button color="secondary">Save</fw-button>
  </fw-tab-panel>
</fw-tabs>
```
<!-- Auto Generated Below -->
## Methods
### `activateTab(index?: number, name?: string) => Promise<void>`
Activates the tab based based on tabindex or name.
#### Returns
Type: `Promise<void>`

---
