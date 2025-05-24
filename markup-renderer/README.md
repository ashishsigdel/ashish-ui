# @ashish-ui/markup-renderer

A modern, lightweight Markdown renderer for React that supports:

- Code blocks with syntax highlighting and copy button
- Tables
- Blockquotes
- Alerts / callouts
- Lists, headers, and inline formatting (bold, italic, links, etc.)
- Dark mode support

Built with [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) and Tailwind CSS-friendly styles.

---

## ✨ Features

- 📦 Zero-config drop-in Markdown support
- 🎨 Syntax highlighting with auto dark/light theme detection
- ⚠️ GitHub-style alert blocks
- 📋 Code copy button with feedback
- 🧼 Clean and accessible markup

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
    <div className="prose dark:prose-invert max-w-none">
      <MarkupRenderer content={markdownContent} isDark={false} />
    </div>
  );
}
```

> 🔁 The `isDark` prop is used to toggle themes (e.g. for SSR); otherwise, it reads from `localStorage.theme`.

---

## 🧩 Props

| Prop      | Type      | Required | Description              |
| --------- | --------- | -------- | ------------------------ |
| `content` | `string`  | Yes      | Raw markdown string      |
| `isDark`  | `boolean` | Yes      | Enables dark mode styles |

---

## 📄 Markdown Support

| Feature                 | Supported                              |
| ----------------------- | -------------------------------------- |
| Headings                | ✅                                     |
| Paragraphs              | ✅                                     |
| Inline code             | ✅                                     |
| Code blocks             | ✅                                     |
| Tables                  | ✅                                     |
| Blockquotes             | ✅                                     |
| GitHub Alerts           | ✅ (`> [!NOTE]`, `> [!WARNING]`, etc.) |
| Lists                   | ✅                                     |
| Links                   | ✅                                     |
| Emphasis (bold, italic) | ✅                                     |
| Strikethrough           | ✅                                     |
| Horizontal rule         | ✅                                     |

---

## 🎨 Theming

- Auto-detects light/dark mode via `localStorage.theme`
- Uses `prism` for light theme and `atomDark` for dark theme
- Style your layout with Tailwind classes like `prose` or `max-w-none` as needed

---

## 📃 License

MIT © [Ashish](https://github.com/your-github-profile)
