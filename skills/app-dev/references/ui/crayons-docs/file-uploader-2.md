>title: file-uploader-2 - Default auto upload file uploader in HTML
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### Default auto upload file uploader in HTML
  
```html
<fw-file-uploader-2
name="sample"
id="file-uploader-00"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="https://mocktarget.apigee.net/echo"
multiple="true"
>
</fw-file-uploader-2>
```  

---
>title: file-uploader-2 - Default auto upload file uploader in React
>tags: 
>context: file-uploader-2, react
>content:

# File uploader 2 (fw-file-uploader-2)
### Default auto upload file uploader in React
  
```jsx
import { FwFileUploader2 } from "@freshworks/crayons/react";
function App() {
return (
<>
<FwFileUploader2
name="sample"
id="file-uploader-00"
description="We support .png, .jpeg and .jpg upto 25MB"
maxFileSize="5"
accept=".png,.jpeg,.jpg"
actionURL="https://mocktarget.apigee.net/echo"
multiple="true"
>
</FwFileUploader2>
</>
);
}
```  

---
>title: Default auto upload file uploader in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### Default auto upload file uploader
```html live
<fw-file-uploader-2
name="sample"
id="file-uploader-00"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="https://mocktarget.apigee.net/echo"
multiple="true"
>
</fw-file-uploader-2>
```  

---
>title: file-uploader-2 - File uploader with initial values set in HTML
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File uploader with initial values set in HTML
  
```html
<div class="fw-flex fw-flex-column fw-justify-center">
<fw-file-uploader-2
name="sample"
id="file-uploader-01"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="https://mocktarget.apigee.net/echo"
multiple="true"
style="width: 400px;"
>
</fw-file-uploader-2>
</div>
```  
```javascript
var fileUploader1 = document.querySelector("#file-uploader-01");
fileUploader1.initialFiles = [{
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49])
)], 'file1.png', {type: 'png', lastModified: Date.now()})
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file2.png', {type: 'png', lastModified: Date.now()}),
progress: 20,
error: 'Failed to upload file'
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49,0,241,255,15,90,104,8,33,129,83,7,97,163,136,
214,129,93,2,43,2,0,181,31,90,179,225,252,176,37,0,0,0,0,73,69,
78,68,174,66,96,130])
)], 'file3.png', {type: 'png', lastModified: Date.now()}),
progress: -1,
error: 'Failed to upload file'
}];
```  

---
>title: file-uploader-2 - File uploader with initial values set in React
>tags: 
>context: file-uploader-2, react
>content:

# File uploader 2 (fw-file-uploader-2)
### File uploader with initial values set in React
  
```jsx
import { FwFileUploader2 } from "@freshworks/crayons/react";
function App() {
const initialFiles = [{
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49])
)], 'file1.png', {type: 'png', lastModified: Date.now()})
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file2.png', {type: 'png', lastModified: Date.now()}),
progress: 20,
error: 'Failed to upload file'
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49,0,241,255,15,90,104,8,33,129,83,7,97,163,136,
214,129,93,2,43,2,0,181,31,90,179,225,252,176,37,0,0,0,0,73,69,
78,68,174,66,96,130])
)], 'file3.png', {type: 'png', lastModified: Date.now()}),
progress: -1,
error: 'Failed to upload file'
}];
return (
<>
<FwFileUploader2
name="sample"
id="file-uploader-01"
description="We support .png, .jpeg and .jpg upto 25MB"
maxFileSize="5"
accept=".png,.jpeg,.jpg"
actionURL="https://mocktarget.apigee.net/echo"
multiple="true"
style={{
width: '400px'
}}
initialFiles={initialFiles}
>
</FwFileUploader2>
</>
);
}
```  

---
>title: File uploader with initial values set in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File uploader with initial values set
Expected format for initial file upload:  
```
const lastServerResponse = {
uploadStatus: 200,
response: `{
"headers": {
"host": "**",
..
}
}`
};

// progress, error and lastServerResponse are optional in the below object.
const InitialFiles: [{
"file": File, // File object
"progress": 100, // Can we any value ranging from 0 to 100. Set -1 for error state.
"error": "", // Error text to display when progress is -1. Must be empty for successful state.
"lastServerResponse": lastServerResponse, // Just a reference placeholder for storing any response from last server call.
}];
```  
```html live
<div class="fw-flex fw-flex-column fw-justify-center">
<fw-file-uploader-2
name="sample"
id="file-uploader-01"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="https://mocktarget.apigee.net/echo"
multiple="true"
style="width: 400px;"
>
</fw-file-uploader-2>
</div>

<script type="application/javascript">
var fileUploader1 = document.querySelector("#file-uploader-01");
fileUploader1.initialFiles = [{
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49])
)], 'file1.png', {type: 'png', lastModified: Date.now()})
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file2.png', {type: 'png', lastModified: Date.now()}),
progress: 20,
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49,0,241,255,15,90,104,8,33,129,83,7,97,163,136,
214,129,93,2,43,2,0,181,31,90,179,225,252,176,37,0,0,0,0,73,69,
78,68,174,66,96,130])
)], 'file3.png', {type: 'png', lastModified: Date.now()}),
progress: -1,
error: 'Failed to upload file'
}];
</script>
```  

---
>title: file-uploader-2 - File upload on a button trigger in HTML
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload on a button trigger in HTML
  
```html
<div class="fw-flex fw-flex-column fw-justify-center">
<div style="width: 400px;" class="fw-flex fw-flex-column">
<fw-file-uploader-2
name="sample"
id="file-uploader-02"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
action-u-r-l="https://run.mocky.io/v3/893d19d2-c988-4273-a907-9c18d78be753?mocky-delay=1000ms"
multiple="true"
is-batch-upload="true"
>
</fw-file-uploader-2>
<br/>
<fw-button id="file-uploader-button-02">Upload file</fw-button>
</div>
</div>
```  
```javascript
var fileUploader2 = document.querySelector("#file-uploader-02");
var fileUploaderButton2 = document.querySelector("#file-uploader-button-02");
fileUploaderButton2.addEventListener('click', () => {
fileUploader2.uploadFiles();
});
```  

---
>title: file-uploader-2 - File upload on a button trigger in React
>tags: 
>context: file-uploader-2, react
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload on a button trigger in React
  
```jsx
import { useRef } from 'react';
import { FwFileUploader2, FwButton } from "@freshworks/crayons/react";
function App() {

const fileUploader = useRef(null);

return (
<>
<FwFileUploader2
name="sample"
id="file-uploader-02"
description="We support .png, .jpeg and .jpg upto 25MB"
maxFileSize="5"
actionURL="https://run.mocky.io/v3/893d19d2-c988-4273-a907-9c18d78be753?mocky-delay=1000ms"
multiple="true"
isBatchUpload="true"
ref={fileUploader}
>
</FwFileUploader2>
<FwButton onClick={() => fileUploader.current.uploadFiles()}>Upload</FwButton>
</>
);
}
```  

---
>title: File upload on a button trigger in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload on a button trigger
```html live
<div class="fw-flex fw-flex-column fw-justify-center">
<div style="width: 400px;" class="fw-flex fw-flex-column">
<fw-file-uploader-2
name="sample"
id="file-uploader-02"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
action-u-r-l="https://run.mocky.io/v3/893d19d2-c988-4273-a907-9c18d78be753?mocky-delay=1000ms"
multiple="true"
is-batch-upload="true"
>
</fw-file-uploader-2>
<br/>
<fw-button id="file-uploader-button-02">Upload file</fw-button>
</div>
</div>
<script type="application/javascript">
var fileUploader2 = document.querySelector("#file-uploader-02");
var fileUploaderButton2 = document.querySelector("#file-uploader-button-02");
fileUploaderButton2.addEventListener('click', () => {
fileUploader2.uploadFiles();
});
</script>
```  

---
>title: file-uploader-2 - File uploader as part of a form in HTML
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File uploader as part of a form in HTML
  
```html
<div class="fw-flex fw-flex-column fw-justify-center">
<form style="width: 400px;" class="fw-flex fw-flex-column fw-justify-center" id="sample-form" action="https://mocktarget.apigee.net/echo" method="post" onsubmit>
<fw-file-uploader-2
name="sample-2"
id="file-uploader-03"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
multiple="true"
is-batch-upload="true"
>
</fw-file-uploader-2>
<br/>
<fw-button type="submit">Upload file</fw-button>
</form>
</div>
```  
```javascript
var sampleForm = document.getElementById("sample-form");
var fileUploader3 = document.getElementById("file-uploader-03");
sampleForm.addEventListener("submit", async (e) => {
e.preventDefault() // Cancel redirection
var files = await fileUploader3.getFiles();
console.log(files); // Perform action to send file to a server
fileUploader3.reset(); // reset the form to initial state
});
```  

---
>title: file-uploader-2 - File uploader as part of a form in React
>tags: 
>context: file-uploader-2, react
>content:

# File uploader 2 (fw-file-uploader-2)
### File uploader as part of a form in React
  
```jsx
import { useRef } from 'react';
import { FwFileUploader2, FwButton } from "@freshworks/crayons/react";

function App() {

const fileUploader = useRef(null);

return (
<>
<form style={{width: '400px'}} class="fw-flex fw-flex-column fw-justify-center" id="sample-form" action="https://mocktarget.apigee.net/echo" method="post" onSubmit={async (e) => {
e.preventDefault() // Cancel redirection
var files = await fileUploader.current.getFiles();
console.log(files); // Perform action to send file to a server
fileUploader.current.reset(); // reset the form to initial state
}}
>
<FwFileUploader2
name="sample-2"
id="file-uploader-03"
description="We support .png, .jpeg and .jpg upto 25MB"
maxFileSize="5"
accept=".png,.jpeg,.jpg"
multiple="true"
isBatchUpload="true"
ref={fileUploader}
>
</FwFileUploader2>
<br/>
<FwButton type="submit">Upload file</FwButton>
</form>
</>
);
}
```  

---
>title: File uploader as part of a form in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File uploader as part of a form
```html live
<div class="fw-flex fw-flex-column fw-justify-center">
<form style="width: 400px;" class="fw-flex fw-flex-column fw-justify-center" id="sample-form" action="https://mocktarget.apigee.net/echo" method="post" onsubmit>
<fw-file-uploader-2
name="sample-2"
id="file-uploader-03"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
multiple="true"
is-batch-upload="true"
>
</fw-file-uploader-2>
<br/>
<fw-button type="submit">Upload file</fw-button>
</form>
</div>

<script type="application/javascript">
var sampleForm = document.getElementById("sample-form");
var fileUploader3 = document.getElementById("file-uploader-03");
sampleForm.addEventListener("submit", async (e) => {
e.preventDefault() // Cancel redirection
var files = await fileUploader3.getFiles();
console.log(files); // Perform action to send file to a server
fileUploader3.reset(); // reset the form to initial state
});
</script>
```  

---
>title: file-uploader-2 - File upload - retry cases in HTML
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload - retry cases in HTML
  
```html
<div class="fw-flex fw-flex-column fw-justify-center">
<div>
<fw-toggle id="succeed-toggle" size="small" checked="false">Switch to succeed file upload</fw-toggle><br><br>
</div>
<div style="width: 400px;" class="fw-flex fw-flex-column">
<fw-file-uploader-2
id="file-uploader-04"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="/no-api"
is-batch-upload="true"
>
</fw-file-uploader-2>
<br/>
<fw-button id="file-uploader-button-04">Upload file</fw-button>
</div>
</div>
```  
```javascript
var fileUploader4 = document.querySelector('#file-uploader-04');
var succeedToggle = document.querySelector('#succeed-toggle');
var fileUploaderButton4 = document.querySelector('#file-uploader-button-04')
fileUploader4.fileUploadError = 'Toggle the switch to successfully upload the file'; // Error message text
succeedToggle.addEventListener('fwChange', (event) => {
if (event.currentTarget.checked === true) {
fileUploader4.actionURL = 'https://mocktarget.apigee.net/echo';
} else {
fileUploader4.actionURL = '/no-api';
}
});

fileUploader4.addEventListener('fwFilesUploaded', (event) => {
console.log(event); // Will be called when all file requests are sent.
});
fileUploader4.addEventListener('fwFileReuploaded', (event) => {
console.log(event); // Will be called a retry attempt request is sent.
});
fileUploaderButton4.addEventListener('click', () => {
fileUploader4.uploadFiles();
});
```  

---
>title: file-uploader-2 - File upload - retry cases in React
>tags: 
>context: file-uploader-2, react
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload - retry cases in React
  
```jsx
import { useRef } from 'react';
import { FwToggle, FwFileUploader2, FwButton } from "@freshworks/crayons/react";

function App() {

const fileUploader = useRef(null);

return (
<>
<div>
<FwToggle
id="succeed-toggle"
size="small"
checked="false"
onFwChange={(e) => {
if (e.currentTarget.checked === true) {
fileUploader.current.actionURL = 'https://mocktarget.apigee.net/echo';
} else {
fileUploader.current.actionURL = '/no-api';
}
}}
>
Switch to succeed file upload
</FwToggle>
</div>
<div style={{ width: '400px' }} class="fw-flex fw-flex-column">
<FwFileUploader2
id="file-uploader-04"
description="We support .png, .jpeg and .jpg upto 25MB"
maxFileSize="5"
accept=".png,.jpeg,.jpg"
actionURL="/no-api"
isBatchUpload="true"
ref={fileUploader}
onFwFilesUploaded={(e) => console.log(e)}
onFwFileReuploaded={(e) => console.log(e)}
>
</FwFileUploader2>
<FwButton onClick={() => fileUploader.current.uploadFiles()}>Upload file</FwButton>
</div>
</>
);
}
```  

---
>title: File upload - retry cases in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload - retry cases
```html live
<div class="fw-flex fw-flex-column fw-justify-center">
<div>
<fw-toggle id="succeed-toggle" size="small" checked="false">Switch to succeed file upload</fw-toggle><br><br>
</div>
<div style="width: 400px;" class="fw-flex fw-flex-column">
<fw-file-uploader-2
id="file-uploader-04"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="/no-api"
is-batch-upload="true"
>
</fw-file-uploader-2>
<br/>
<fw-button id="file-uploader-button-04">Upload file</fw-button>
</div>
</div>

<script type="application/javascript">
var fileUploader4 = document.querySelector('#file-uploader-04');
var succeedToggle = document.querySelector('#succeed-toggle');
var fileUploaderButton4 = document.querySelector('#file-uploader-button-04')
fileUploader4.fileUploadError = 'Toggle the switch to successfully upload the file'; // Error message text
succeedToggle.addEventListener('fwChange', (event) => {
if (event.currentTarget.checked === true) {
fileUploader4.actionURL = 'https://mocktarget.apigee.net/echo';
} else {
fileUploader4.actionURL = '/no-api';
}
});

fileUploader4.addEventListener('fwFilesUploaded', (event) => {
console.log(event); // Will be called when all file requests are sent.
});
fileUploader4.addEventListener('fwFileReuploaded', (event) => {
console.log(event); // Will be called a retry attempt request is sent.
});
fileUploaderButton4.addEventListener('click', () => {
fileUploader4.uploadFiles();
});
</script>
```  

---
>title: file-uploader-2 - File upload - modify header request in HTML
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload - modify header request in HTML
  
```html
<div class="fw-flex fw-flex-column fw-justify-center">
<div style="width: 400px;" class="fw-flex fw-flex-column">
<fw-file-uploader-2
name="sample"
id="file-uploader-05"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="https://mocktarget.apigee.net/echo"
is-batch-upload="true"
>
</fw-file-uploader-2>
<br/>
<fw-button id="file-uploader-button-05">Upload file</fw-button>
</div>
</div>
```  
```javascript
var fileUploader5 = document.querySelector('#file-uploader-05');
var filesUploaderButton5 = document.querySelector('#file-uploader-button-05');
fileUploader5.modifyRequest = (xhr) => {
var token = 'sample';
xhr.setRequestHeader('Authorization', token); // adding a header to the request
return xhr;
};
fileUploader5.addEventListener('fwFilesUploaded', (event) => {
console.log(JSON.parse(event.detail.response).headers.authorization); // Will be called the first time when all file requests are sent.
});
filesUploaderButton5.addEventListener('click', () => {
fileUploader5.uploadFiles();
});
```  

---
>title: file-uploader-2 - File upload - modify header request in React
>tags: 
>context: file-uploader-2, react
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload - modify header request in React
  
```jsx
import { useRef } from 'react';
import { FwFileUploader2, FwButton } from "@freshworks/crayons/react";

function App() {

const fileUploader = useRef(null);

return (
<>
<FwFileUploader2
name="sample"
id="file-uploader-05"
description="We support .png, .jpeg and .jpg upto 25MB"
maxFileSize="5"
accept=".png,.jpeg,.jpg"
actionURL="https://mocktarget.apigee.net/echo"
isBatchUpload="true"
ref={fileUploader}
modifyRequest={(xhr) => {
var token = 'sample';
xhr.setRequestHeader('Authorization', token); // adding a header to the request
return xhr;
}}
onFwFilesUploaded={(e) => {
console.log(JSON.parse(e.detail.response).headers.authorization);
}}
>
</FwFileUploader2>
<FwButton onClick={() => fileUploader.current.uploadFiles()}>Upload File</FwButton>
</>
);
}
```  

---
>title: File upload - modify header request in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload - modify header request
```html live
<div class="fw-flex fw-flex-column fw-justify-center">
<div style="width: 400px;" class="fw-flex fw-flex-column">
<fw-file-uploader-2
name="sample"
id="file-uploader-05"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="https://mocktarget.apigee.net/echo"
is-batch-upload="true"
>
</fw-file-uploader-2>
<br/>
<fw-button id="file-uploader-button-05">Upload file</fw-button>
</div>
</div>

<script type="application/javascript">
var fileUploader5 = document.querySelector('#file-uploader-05');
var filesUploaderButton5 = document.querySelector('#file-uploader-button-05');
fileUploader5.modifyRequest = (xhr) => {
var token = 'sample';
xhr.setRequestHeader('Authorization', token); // adding a header to the request
return xhr;
}
fileUploader5.addEventListener('fwFilesUploaded', (event) => {
console.log(JSON.parse(event.detail.response).headers.authorization); // Will be called the first time when all file requests are sent.
});
filesUploaderButton5.addEventListener('click', () => {
fileUploader5.uploadFiles();
});
</script>
```  

---
>title: file-uploader-2 - File upload - custom upload and reset buttons in HTML
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload - custom upload and reset buttons in HTML
  
```html
<div class="fw-flex fw-flex-column fw-justify-center">
<div style="width: 400px;" class="fw-flex fw-flex-column">
<fw-file-uploader-2
name="sample"
id="file-uploader-06"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="https://mocktarget.apigee.net/echo"
is-batch-upload="true"
>
</fw-file-uploader-2>
<br/>
<button id="custom-submit">Submit</button>
<br/>
<button id="custom-reset">Reset</button>
</div>
</div>
```  
```javascript
var fileUploader6 = document.querySelector("#file-uploader-06");
var customButton = document.querySelector("#custom-submit");
var customReset = document.querySelector("#custom-reset");
customButton.addEventListener('click', () => {
fileUploader6.uploadFiles(); // Calling uploadFiles from the custom submit
});
customReset.addEventListener('click', () => {
fileUploader6.reset(); // To return component to initial state
});
fileUploader6.addEventListener('fwFilesUploaded', (event) => {
console.log(event);
});
```  

---
>title: file-uploader-2 - File upload - custom upload and reset buttons in React
>tags: 
>context: file-uploader-2, react
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload - custom upload and reset buttons in React
  
```jsx
import { useRef } from 'react';
import { FwFileUploader2 } from "@freshworks/crayons/react";

function App() {

const fileUploader = useRef(null);

return (
<>
<FwFileUploader2
name="sample"
id="file-uploader-06"
description="We support .png, .jpeg and .jpg upto 25MB"
maxFileSize="5"
accept=".png,.jpeg,.jpg"
actionURL="https://mocktarget.apigee.net/echo"
isBatchUpload="true"
ref={fileUploader}
>
</FwFileUploader2>
<br/>
<button onClick={(e) => fileUploader.current.uploadFiles()}>Submit</button>
<br/>
<button onClick={(e) => fileUploader.current.reset()}>Reset</button>
</>
);
}
```  

---
>title: File upload - custom upload and reset buttons in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### File upload - custom upload and reset buttons
```html live
<div class="fw-flex fw-flex-column fw-justify-center">
<div style="width: 400px;" class="fw-flex fw-flex-column">
<fw-file-uploader-2
name="sample"
id="file-uploader-06"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="https://mocktarget.apigee.net/echo"
is-batch-upload="true"
>
</fw-file-uploader-2>
<br/>
<button id="custom-submit">Submit</button>
<br/>
<button id="custom-reset">Reset</button>
</div>
</div>

<script type="application/javascript">
var fileUploader6 = document.querySelector("#file-uploader-06");
var customButton = document.querySelector("#custom-submit");
var customReset = document.querySelector("#custom-reset");
customButton.addEventListener('click', () => {
fileUploader6.uploadFiles(); // Calling uploadFiles from the custom submit
});
customReset.addEventListener('click', () => {
fileUploader6.reset(); // To return component to initial state
});
fileUploader6.addEventListener('fwFilesUploaded', (event) => {
console.log(event);
});
</script>
```  

---
>title: file-uploader-2 - Restrict attachment size in HTML
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### Restrict attachment size in HTML
  
```html
<div class="fw-flex fw-flex-column fw-justify-center">
<fw-file-uploader-2
name="sample"
id="file-uploader-07"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="https://mocktarget.apigee.net/echo"
multiple="true"
style="width: 400px; --max-attachment-block-width: auto; --max-attachment-block-height: 120px;"
restrict-attachment-block="true"
>
</fw-file-uploader-2>
</div>
```  
```javascript
var fileUploader7 = document.querySelector("#file-uploader-07");
fileUploader7.initialFiles = [{
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49])
)], 'file1.png', {type: 'png', lastModified: Date.now()})
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file2.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49,0,241,255,15,90,104,8,33,129,83,7,97,163,136,
214,129,93,2,43,2,0,181,31,90,179,225,252,176,37,0,0,0,0,73,69,
78,68,174,66,96,130])
)], 'file3.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file4.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file5.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file6.png', {type: 'png', lastModified: Date.now()}),
}];
```  

---
>title: file-uploader-2 - Restrict attachment size in React
>tags: 
>context: file-uploader-2, react
>content:

# File uploader 2 (fw-file-uploader-2)
### Restrict attachment size in React
  
```jsx
import { FwFileUploader2 } from "@freshworks/crayons/react";
function App() {
const initialFiles = [{
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49])
)], 'file1.png', {type: 'png', lastModified: Date.now()})
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file2.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49,0,241,255,15,90,104,8,33,129,83,7,97,163,136,
214,129,93,2,43,2,0,181,31,90,179,225,252,176,37,0,0,0,0,73,69,
78,68,174,66,96,130])
)], 'file3.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file4.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file5.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file6.png', {type: 'png', lastModified: Date.now()}),
}];
return (
<>
<FwFileUploader2
name="sample"
id="file-uploader-07"
description="We support .png, .jpeg and .jpg upto 25MB"
maxFileSize="5"
accept=".png,.jpeg,.jpg"
actionURL="https://mocktarget.apigee.net/echo"
multiple="true"
style={{
width: '400px',
'--max-attachment-block-width': 'auto',
'--max-attachment-block-height': '80px'
}}
restrictAttachmentBlock="true"
initialFiles={initialFiles}
>
</FwFileUploader2>
</>
);
}
```  

---
>title: Restrict attachment size in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
### Restrict attachment size
```html live
<div class="fw-flex fw-flex-column fw-justify-center">
<fw-file-uploader-2
name="sample"
id="file-uploader-07"
description="We support .png, .jpeg and .jpg upto 25MB"
max-file-size="5"
accept=".png,.jpeg,.jpg"
action-u-r-l="https://mocktarget.apigee.net/echo"
multiple="true"
style="width: 400px; --max-attachment-block-width: auto; --max-attachment-block-height: 120px;"
restrict-attachment-block="true"
>
</fw-file-uploader-2>
</div>

<script type="application/javascript">
var fileUploader7 = document.querySelector("#file-uploader-07");
fileUploader7.initialFiles = [{
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49])
)], 'file1.png', {type: 'png', lastModified: Date.now()})
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file2.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
173,168,135,21,49,0,241,255,15,90,104,8,33,129,83,7,97,163,136,
214,129,93,2,43,2,0,181,31,90,179,225,252,176,37,0,0,0,0,73,69,
78,68,174,66,96,130])
)], 'file3.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file4.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file5.png', {type: 'png', lastModified: Date.now()}),
}, {
file: new File([new Blob(new Uint8Array([
137,80,78,71,13])
)], 'file6.png', {type: 'png', lastModified: Date.now()}),
}];
</script>
```  
  
<!-- Auto Generated Below -->
---
>title: Properties in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
## Properties



Property: `accept`
Attribute: `accept`
Description: accept - comma separated string. tells us what file formats file uploader should accept.
Type: `string`
Default: `''`


Property: `acceptError`
Attribute: `accept-error`
Description: acceptError - Error message to display when format is invalid.
Type: `any`
Default: `TranslationController.t('fileUploader2.acceptError')`


Property: `actionParams`
Attribute: --
Description: actionParams - additional information to send to server other than the file.
Type: `{ [prop: string]: any; }`
Default: `{}`


Property: `actionURL`
Attribute: `action-u-r-l`
Description: actionURL - URL to make server call.
Type: `string`
Default: `''`


Property: `description`
Attribute: `description`
Description: description - file uploader description.
Type: `any`
Default: `undefined`


Property: `errorText`
Attribute: `error-text`
Description: errorText - errorText collection. Mutable as this can be set from form control too based on form validations.
Type: `string`
Default: `''`


Property: `fileUploadError`
Attribute: `file-upload-error`
Description: fileUploadError - Error message when a file upload fails.
Type: `any`
Default: `undefined`


Property: `filesLimit`
Attribute: `files-limit`
Description: Max files allowed to upload.
Type: `number`
Default: `10`


Property: `hideLabel`
Attribute: `hide-label`
Description: Use this prop to show the label on the component.
Type: `boolean`
Default: `true`


Property: `hintText`
Attribute: `hint-text`
Description: Inline information text, hint text.
Type: `string`
Default: `''`


Property: `initialFiles`
Attribute: --
Description: to load default values in file uploader component.
Type: `InitialUploaderFile[]`
Default: `[]`


Property: `isBatchUpload`
Attribute: `is-batch-upload`
Description: Upload all files in one single shot
Type: `boolean`
Default: `false`


Property: `isFormLabel`
Attribute: `is-form-label`
Description: To maintain the same label styling as other form elements.
Type: `boolean`
Default: `false`


Property: `maxFileSize`
Attribute: `max-file-size`
Description: maxFileSize - maximum file size the file uploader must accept.
Type: `number`
Default: `0`


Property: `maxFileSizeError`
Attribute: `max-file-size-error`
Description: maxFileSizeError - Error message to display when file size exceeds limit
Type: `any`
Default: `TranslationController.t('fileUploader2.maxFileSizeError')`


Property: `maxFilesLimitError`
Attribute: `max-files-limit-error`
Description: maxFilesLimitError - Error message when going beyond files limit.
Type: `any`
Default: `TranslationController.t(     'fileUploader2.maxFilesLimitError'   )`


Property: `modifyRequest`
Attribute: --
Description: modify request
Type: `(xhr: XMLHttpRequest) => XMLHttpRequest`
Default: `(xhr) => xhr`


Property: `multiple`
Attribute: `multiple`
Description: multiple - upload multiple files.
Type: `boolean`
Default: `false`


Property: `name`
Attribute: `name`
Description: name - field name
Type: `string`
Default: `''`


Property: `required`
Attribute: `required`
Description: field acts as a mandatory field and displays an asterisk next to the label. If the attribute’s value is undefined, the value is set to false.
Type: `boolean`
Default: `false`


Property: `restrictAttachmentBlock`
Attribute: `restrict-attachment-block`
Description: restrict the width of the attachment in the file uploader
Type: `boolean`
Default: `false`


Property: `simpleInterfaceForSingleMode`
Attribute: `simple-interface-for-single-mode`
Description: Use a simple interface for the single file mode.
Type: `boolean`
Default: `false`


Property: `text`
Attribute: `text`
Description: text - file uploader text.
Type: `any`
Default: `undefined`


Property: `totalFileSizeAllowed`
Attribute: `total-file-size-allowed`
Description: Max total size allowed for upload
Type: `number`
Default: `0`


Property: `totalFileSizeAllowedError`
Attribute: `total-file-size-allowed-error`
Description: totalFileSizeAllowedError - Total file size (combination of all files) allowed for upload.
Type: `any`
Default: `TranslationController.t(     'fileUploader2.totalFileSizeAllowedError'   )`
---
>title: Events in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
## Events



Event: `fwChange`
Description: Triggered whenever files change.
Type: `CustomEvent<any>`


Event: `fwFileChange`
Description: Triggered for a particular file change.
Type: `CustomEvent<any>`


Event: `fwFileReuploaded`
Description: Triggered during a file reupload.
Type: `CustomEvent<any>`


Event: `fwFilesUploaded`
Description: Triggered after batch upload, when all files are uploaded.
Type: `CustomEvent<any>`


Event: `fwFileUploaded`
Description: Triggered after file upload if not a batch upload.
Type: `CustomEvent<any>`
---
>title: CSS Custom Properties in file-uploader-2
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
## CSS Custom Properties



Name: `--fw-file-uploader-border`
Description: border color for file uploader


Name: `--max-attachment-height`
Description: max-height for the attachment block


Name: `--max-attachment-width`
Description: max width for the attachment block
---
>title: How to use file-uploader-2 in crayons ?
>tags: 
>context: file-uploader-2
>content:

# File uploader 2 (fw-file-uploader-2)
<!-- Auto Generated Below -->
## Methods
### `getFiles() => Promise<UploaderFile[]>`
get all locally available files in the component
#### Returns
Type: `Promise<UploaderFile[]>`
FileList of all locally available files in the component
### `getFilesList() => Promise<FileList>`
#### Returns
Type: `Promise<FileList>`
### `reset() => Promise<void>`
reset file uploader
#### Returns
Type: `Promise<void>`
### `setFocus() => Promise<void>`
#### Returns
Type: `Promise<void>`
### `uploadFiles() => Promise<void>`
uploadFile
#### Returns
Type: `Promise<void>`
fileUploadPromise
## Shadow Parts
| Part                                   | Description |
| -------------------------------------- | ----------- |
| `"fw-file-uploader-attachments-block"` |             |
| `"fw-file-uploader-clickable"`         |             |
| `"fw-file-uploader-desc"`              |             |
| `"fw-file-uploader-dropzone"`          |             |
| `"fw-file-uploader-error"`             |             |
| `"fw-file-uploader-text"`              |             |
 

---
