>title: button-group - Usage in HTML
>tags: 
>context: button-group
>content:

# Button Group (fw-button-group)
## Usage in HTML

```html
<section>
<fw-button-group label="Test">
<fw-button color="secondary">Replace</fw-button>
<fw-button color="secondary">Modify</fw-button>
<fw-button color="secondary">Cancel</fw-button>
</fw-button-group>
</section>
<br/>
<section>
<fw-button-group label="Test">
<fw-button id="b1" size="icon" color="secondary"><fw-icon name="reply" color="black" ></fw-icon> </fw-button>
<fw-button id="b2" size="icon" color="secondary"><fw-icon name="chat-online" color="black" ></fw-icon> </fw-button>
<fw-button id="b3" size="icon" color="secondary"><fw-icon name="more-horizontal" color="black" ></fw-icon> </fw-button>
</fw-button-group>
</section>
```

---
>title: button-group - Usage in React
>tags: 
>context: button-group, react
>content:

# Button Group (fw-button-group)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwButtonGroup, FwButton, FwIcon } from "@freshworks/crayons/react";
function App() {
return (<div>
<FwButtonGroup>
<FwButton color="secondary"> Replace</FwButton>
<FwButton color="secondary">Modify</FwButton>
<FwButton color="secondary">Cancel</FwButton>
</FwButtonGroup>

<FwButtonGroup>
<FwButton id="b1" size="icon" color="secondary"><FwIcon name="reply" color="black"></FwIcon> </FwButton>
<FwButton id="b1" size="icon" color="secondary"><FwIcon name="chat-online" color="black"></FwIcon> </FwButton>
<FwButton id="b1" size="icon" color="secondary"><FwIcon name="more-horizontal" color="black"></FwIcon> </FwButton>
</FwButtonGroup>

</div>)
}
```

---
>title: Usage in button-group
>tags: 
>context: button-group
>content:

# Button Group (fw-button-group)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in button-group
>tags: 
>context: button-group
>content:

# Button Group (fw-button-group)
## Properties

---
>title: How to use button-group in crayons ?
>tags: 
>context: button-group
>content:

# Button Group (fw-button-group)
Button groups can be used to group related buttons into sections.
## Demo
```html live
<section>
  <fw-button-group label="Test">
    <fw-button color="secondary">Replace</fw-button>
    <fw-button color="secondary">Modify</fw-button>
    <fw-button color="secondary">Cancel</fw-button>
  </fw-button-group>
</section>
<br />
<section>
  <fw-button-group label="Test">
    <fw-button id="b1" size="icon" color="secondary"
      ><fw-icon name="reply" color="black"></fw-icon>
    </fw-button>
    <fw-button id="b2" size="icon" color="secondary"
      ><fw-icon name="chat-online" color="black"></fw-icon>
    </fw-button>
    <fw-button id="b3" size="icon" color="secondary"
      ><fw-icon name="more-horizontal" color="black"></fw-icon>
    </fw-button>
  </fw-button-group>
</section>
```
<!-- Auto Generated Below -->
 

---
