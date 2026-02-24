>title: format-number - Usage in HTML
>tags: 
>context: format-number
>content:

# Format Number (fw-format-number)
## Usage in HTML

```html

<label>Pass `locale` attritube to set the formatting locale for the number</label>
English: <fw-format-number value="2000" locale="en" minimum-fraction-digits="2"></fw-format-number><br/>
German: <fw-format-number value="2000" locale="de" minimum-fraction-digits="2"></fw-format-number><br/>

<label> Pass type as `percent` to get the value as percentage.</label>
<fw-format-number type="percent" value="0"></fw-format-number><br/>
<fw-format-number type="percent" value="0.25"></fw-format-number><br/>
<fw-format-number type="percent" value="0.50"></fw-format-number><br/>
<fw-format-number type="percent" value="0.75"></fw-format-number><br/>
<fw-format-number type="percent" value="1"></fw-format-number> <br/>

<label>To format a number as a monetary value, set the type attribute to `currency` and set the currency attribute to the desired `ISO 4217 currency code`.</label>

<label>You should also specify `locale` attribute to ensure the the number is formatted correctly for the target locale.
</label>
USD: <fw-format-number type="currency" currency="USD" value="5000" locale="en-US"></fw-format-number><br/>
GBP: <fw-format-number type="currency" currency="GBP" value="5000" locale="en-GB"></fw-format-number><br/>
EUR: <fw-format-number type="currency" currency="EUR" value="5000" locale="de"></fw-format-number><br/>
CNY: <fw-format-number type="currency" currency="CNY" value="5000" locale="zh-cn"></fw-format-number>
```

---
>title: format-number - Usage in React
>tags: 
>context: format-number, react
>content:

# Format Number (fw-format-number)
## Usage in React

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FwFormatNumber } from "@freshworks/crayons/react";
function App() {
return (<div>

<label>Pass `locale` attritube to set the formatting locale for the number</label>
English: <FwFormatNumber value={2000} locale="en" minimum-fraction-digits={2}></FwFormatNumber><br/>
German: <FwFormatNumber value={2000} locale="de" minimum-fraction-digits={2}></FwFormatNumber><br/>

<label> Pass type as `percent` to get the value as percentage.</label>
<FwFormatNumber type="percent" value={0}></FwFormatNumber><br/>
<FwFormatNumber type="percent" value={0.25}></FwFormatNumber><br/>
<FwFormatNumber type="percent" value={0.50}></FwFormatNumber><br/>
<FwFormatNumber type="percent" value={0.75}></FwFormatNumber><br/>
<FwFormatNumber type="percent" value={1}></FwFormatNumber> <br/>

<label>To format a number as a monetary value, set the type attribute to `currency` and set the currency attribute to the desired `ISO 4217 currency code`.</label>

<label>You should also specify `locale` attribute to ensure the the number is formatted correctly for the target locale.
</label>
<FwFormatNumber type="currency" currency="USD" value={5000} locale="en-US"></FwFormatNumber><br/>
<FwFormatNumber type="currency" currency="GBP" value={5000} locale="en-GB"></FwFormatNumber><br/>
<FwFormatNumber type="currency" currency="EUR" value={5000} locale="de"></FwFormatNumber><br/>
<FwFormatNumber type="currency" currency="CNY" value={5000} locale="zh-cn"></FwFormatNumber>
</div>);
}
```

---
>title: Usage in format-number
>tags: 
>context: format-number
>content:

# Format Number (fw-format-number)
## Usage
  
<!-- Auto Generated Below -->
---
>title: Properties in format-number
>tags: 
>context: format-number
>content:

# Format Number (fw-format-number)
## Properties



Property: `currency`
Attribute: `currency`
Description: The currency to use in currency formatting. Possible values are the `ISO 4217` currency codes, such as `USD` for the US dollar, `EUR` for the euro. If the style is "currency", the currency property must be provided.
Type: `string`
Default: `undefined`


Property: `currencyDisplay`
Attribute: `currency-display`
Description: Currency display formatting.
Type: `"code" \| "name" \| "narrowSymbol" \| "symbol"`
Default: `'symbol'`


Property: `currencySign`
Attribute: `currency-sign`
Description: In many locales, accounting format means to wrap the number with parentheses instead of appending a minus sign. You can enable the above by setting the currencySign option to `accounting`. The default value is `standard`
Type: `"accounting" \| "standard"`
Default: `'standard'`


Property: `locale`
Attribute: `locale`
Description: `Locale` used for formatting the number
Type: `string`
Default: `undefined`


Property: `maximumFractionDigits`
Attribute: `maximum-fraction-digits`
Description: The maximum number of fraction digits to use. Possible values are 0 - 20.
Type: `number`
Default: `undefined`


Property: `maximumSignificantDigits`
Attribute: `maximum-significant-digits`
Description: The maximum number of significant digits to use,. Possible values are 1 - 21. Default is 21
Type: `number`
Default: `21`


Property: `minimumFractionDigits`
Attribute: `minimum-fraction-digits`
Description: The minimum number of fraction digits to use. Possible values are 0 - 20.
Type: `number`
Default: `undefined`


Property: `minimumIntegerDigits`
Attribute: `minimum-integer-digits`
Description: The minimum number of integer digits to use. Possible values are 1 - 21. Default is 1
Type: `number`
Default: `1`


Property: `minimumSignificantDigits`
Attribute: `minimum-significant-digits`
Description: The minimum number of significant digits to use. Possible values are 1 - 21. Default is 1
Type: `number`
Default: `1`


Property: `type`
Attribute: `type`
Description: Formatting style
Type: `"currency" \| "decimal" \| "percent"`
Default: `'decimal'`


Property: `useGrouping`
Attribute: `use-grouping`
Description: Turns on/off grouping separators.
Type: `boolean`
Default: `true`


Property: `value`
Attribute: `value`
Description: Number to format.
Type: `number`
Default: `0`
---
>title: How to use format-number in crayons ?
>tags: 
>context: format-number
>content:

# Format Number (fw-format-number)
Format Number formats a number using the given locale and options.
Localization is handled by the `Intl.NumberFormat` API
## Demo
Pass `locale` attritube to set the formatting locale for the number.
```html live
<div>
English: <fw-format-number value="2000" locale="en" minimum-fraction-digits="2"></fw-format-number><br/>
</div>
<div>
German: <fw-format-number value="2000" locale="de" minimum-fraction-digits="2"></fw-format-number><br/>
</div>
```
Pass type as `percent` to get the value as percentage.
```html live
<fw-format-number type="percent" value="0"></fw-format-number><br/>
<fw-format-number type="percent" value="0.25"></fw-format-number><br>
<fw-format-number type="percent" value="0.50"></fw-format-number><br>
<fw-format-number type="percent" value="0.75"></fw-format-number><br>
<fw-format-number type="percent" value="1"></fw-format-number> <br/>
```
To format a number as a monetary value, set the type attribute to `currency` and set the currency attribute to the desired `ISO 4217 currency code`.
You should also specify `locale` attribute to ensure the the number is formatted correctly for the target locale.
```html live
<div>USD: <fw-format-number type="currency" currency="USD" value="5000" locale="en-US"></fw-format-number><br></div>
<div>GBP: <fw-format-number type="currency" currency="GBP" value="5000" locale="en-GB"></fw-format-number><br></div>
<div>EUR: <fw-format-number type="currency" currency="EUR" value="5000" locale="de"></fw-format-number><br></div>
<div>CNY: <fw-format-number type="currency" currency="CNY" value="5000" locale="zh-cn"></fw-format-number></div>
  
```
<!-- Auto Generated Below -->

---
