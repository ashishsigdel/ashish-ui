## Rich Text Editor for React

### Installation

```bash
npm install richt-editor
```

### Usage

Import the package and use it in your React component:

```js
import React, { useState } from "react";
import RichTextEditor from "richt-editor";

export default function App() {
  const [content, setContent] = useState("");
  return <RichTextEditor content={content} setContent={setContent} />;
}
```

### Adjusting Height and Width

Wrap the editor in a container with your desired styles:

```js
<div style={{ height: "600px", width: "800px" }}>
  <RichTextEditor content={content} setContent={setContent} />
</div>
```

### Props

All available props:

```js
<RichTextEditor
  content={content}
  setContent={setContent}
  imageUploadAPIUrl="https://your-api-url"
  theme={theme}
  lightColorPanelBg="#f5f5f5"
  darkColorPanelBg="#333"
  lightColorPanelText="#333"
  darkColorPanelText="#f5f5f5"
  lightEditorBgColor="#f5f5f5"
  darkEditorBgColor="#333"
/>
```

### Image Upload API Response

The API response for image uploads should look like:

```json
{
  "data": {
    "url": "https://your-image-url.png"
  }
}
```
