# @ashish-ui/markup-renderer

A modern, lightweight Markdown renderer for React that supports:

## 📄 Markdown Support

You can see a demo [here](https://markup-renderer.asigdel.com.np/).

| Feature                             | Supported                              |
| ----------------------------------- | -------------------------------------- |
| Headings                            | ✅                                     |
| Paragraphs                          | ✅                                     |
| Inline code                         | ✅                                     |
| Code blocks                         | ✅                                     |
| Tables                              | ✅                                     |
| Blockquotes                         | ✅                                     |
| GitHub Alerts                       | ✅ (`> [!NOTE]`, `> [!WARNING]`, etc.) |
| Lists                               | ✅                                     |
| Links                               | ✅                                     |
| Image                               | ✅                                     |
| Emphasis (bold, italic, bolditalic) | ✅                                     |
| Strikethrough                       | ✅                                     |
| Horizontal rule                     | ✅                                     |

---

## 🚀 Installation

```bash
npm install @ashish-ui/markup-renderer
```

---

## 🔧 Usage

```tsx
import MarkupRenderer from "@ashish-ui/markup-renderer";

const markdownContent = \`
# Hello World

This is a **Markdown** renderer with \`inline code\`.

> A simple blockquote.

> [!WARNING] This is a warning alert.

\`\`\`js
const hello = "world";
console.log(hello);
\`\`\`
\`;

export default function App() {
  return (
    <MarkupRenderer
      content={markdownContent}
    />
  );
}
```

---

## 🧩 Props

| Prop           | Type      | Required | Description                                                               |
| -------------- | --------- | -------- | ------------------------------------------------------------------------- |
| `content`      | `string`  | Yes      | The Markdown text you want to render.                                     |
| `isDark`       | `boolean` | No       | If `true`, renders the content in dark mode; if `false`, uses light mode. |
| `primaryColor` | `string`  | No       | Sets the main accent color for elements.                                  |

---

## 🎨 Theming

To support your code for dark and light mode you should pass isDark props:

- for only light mode you can leave isDark props. For only dark mode you can use `isDark` props. fully funcitonal dark mode with toggling is :

```tsx
import MarkupRenderer from "@ashish-ui/markup-renderer";
import { useState } from "react";

interface Props {
  content: string;
  theme: "dark" | "light";
}

export default function Display({ content, theme }: Props) {
  return (
    <MarkupRenderer
      content={content}
      isDark={theme === "dark" ? true : false}
    />
  );
}
```

---

## 📃 License

MIT © [Ashish](https://github.com/ashishsigdel)
