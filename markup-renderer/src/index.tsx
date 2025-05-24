import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  content: string | undefined;
  isDark: boolean;
}

type CodeBlockProps = {
  children: string;
  language?: string;
  isDark: boolean;
};

type InlineCodeProps = {
  children: string;
};

type TableProps = {
  children: React.ReactNode;
};

type BlockquoteProps = {
  children: React.ReactNode;
};

type AlertProps = {
  type?: "info" | "warning" | "error" | "success";
  children: React.ReactNode;
};

// Code block component with syntax highlighting simulation and copy functionality
const CodeBlock = ({ children, language, isDark }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const theme = isDark ? "dark" : "light";

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-200 dark:bg-gray-800 border-b border-white dark:border-gray-700 rounded-t-lg">
        <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
          {language || "text"}
        </span>
        <button
          onClick={handleCopy}
          className="transition-opacity duration-200 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {copied ? (
            <span className="flex item-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="green"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </span>
          ) : (
            <span className="flex item-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </span>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        customStyle={{
          margin: 0,
        }}
        language={language}
        style={theme === "dark" ? atomDark : prism}
        showLineNumbers
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

// Inline code component
const InlineCode = ({ children }: InlineCodeProps) => (
  <code className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono">
    {children}
  </code>
);

// Table component
const Table = ({ children }: TableProps) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {children}
    </table>
  </div>
);

// Blockquote component
const Blockquote = ({ children }: BlockquoteProps) => (
  <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic">
    {children}
  </blockquote>
);

// Alert/Note component
const Alert = ({ type = "info", children }: AlertProps) => {
  const styles = {
    info: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200",
    warning:
      "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200",
    error:
      "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 text-red-800 dark:text-red-200",
    success:
      "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 text-green-800 dark:text-green-200",
  };

  return (
    <div className={`border-l-4 p-4 my-4 rounded-r-lg ${styles[type]}`}>
      {children}
    </div>
  );
};

// Main markdown parser
const parseMarkdown = (content: string, isDark: boolean) => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Headers
    if (line.startsWith("#")) {
      const level = line.match(/^#+/)?.[0]?.length || 1;
      const text = line.replace(/^#+\s*/, "");
      const HeaderTag = `h${Math.min(level, 6)}` as
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6";
      const sizes = {
        h1: "text-3xl font-bold mb-4 mt-6 pb-2 border-b border-gray-200 dark:border-gray-700",
        h2: "text-2xl font-bold mb-3 mt-5 pb-2 border-b border-gray-200 dark:border-gray-700",
        h3: "text-xl font-bold mb-3 mt-4",
        h4: "text-lg font-bold mb-2 mt-3",
        h5: "text-base font-bold mb-2 mt-3",
        h6: "text-sm font-bold mb-2 mt-3",
      };

      elements.push(
        React.createElement(
          HeaderTag,
          {
            key: i,
            className: `${sizes[HeaderTag]} text-gray-900 dark:text-white`,
          },
          text
        )
      );
    }

    // Code blocks
    else if (line.startsWith("```")) {
      const language = line.replace("```", "").trim();
      const codeLines = [];
      i++; // Skip opening ```

      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }

      elements.push(
        <div key={i} className="my-4">
          <CodeBlock language={language} isDark={isDark}>
            {codeLines.join("\n")}
          </CodeBlock>
        </div>
      );
    }

    // Tables
    else if (line.includes("|") && line.trim().startsWith("|")) {
      const tableRows = [];
      let j = i;

      while (j < lines.length && lines[j].includes("|")) {
        if (!lines[j].trim().match(/^[\|\s\-]+$/)) {
          // Skip separator rows
          tableRows.push(lines[j]);
        }
        j++;
      }

      if (tableRows.length > 0) {
        const [headerRow, ...bodyRows] = tableRows;
        const headers = headerRow
          .split("|")
          .map((h) => h.trim())
          .filter((h) => h);

        elements.push(
          <Table key={i}>
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rowIdx) => {
                const cells = row
                  .split("|")
                  .map((c) => c.trim())
                  .filter((c) => c);
                return (
                  <tr
                    key={rowIdx}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {cells.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300"
                      >
                        {parseInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        );
        i = j - 1; // Adjust index
      }
    }

    // Lists
    else if (line.match(/^[\s]*[-\*\+]\s/) || line.match(/^[\s]*\d+\.\s/)) {
      const listItems = [];
      let j = i;
      const isOrdered = line.match(/^\s*\d+\.\s/);

      const listRegex = isOrdered ? /^[\s]*\d+\.\s/ : /^[\s]*[-\*\+]\s/;

      while (
        j < lines.length &&
        (lines[j].match(listRegex) || lines[j].trim() === "")
      ) {
        if (lines[j].trim()) {
          const text = lines[j].replace(/^[\s]*(?:[-\*\+]|\d+\.)\s/, "");
          listItems.push(text);
        }
        j++;
      }

      const ListTag = isOrdered ? "ol" : "ul";
      const listClass = isOrdered
        ? "list-decimal list-inside"
        : "list-disc list-inside";

      elements.push(
        React.createElement(
          ListTag,
          {
            key: i,
            className: `${listClass} my-4 space-y-1 text-gray-700 dark:text-gray-300 ml-4`,
          },
          listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {parseInlineMarkdown(item)}
            </li>
          ))
        )
      );
      i = j - 1;
    }

    // Blockquotes
    else if (line.startsWith(">")) {
      const quoteLines = [];
      let j = i;

      while (j < lines.length && lines[j].startsWith(">")) {
        quoteLines.push(lines[j].replace(/^>\s?/, ""));
        j++;
      }

      elements.push(<Blockquote key={i}>{quoteLines.join(" ")}</Blockquote>);
      i = j - 1;
    }

    // Alerts/Notes (GitHub style)
    else if (line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i)) {
      const match = line.match(
        /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i
      );
      const type = match?.[1]?.toLowerCase() || "note";
      const alertType =
        type === "caution" || type === "warning"
          ? "warning"
          : type === "important"
          ? "error"
          : "info";

      let content = line.replace(/^>\s*\[![^\]]+\]\s*/, "");
      let j = i + 1;

      while (j < lines.length && lines[j].startsWith(">")) {
        content += " " + lines[j].replace(/^>\s?/, "");
        j++;
      }

      elements.push(
        <Alert key={i} type={alertType}>
          <strong className="capitalize">{type}:</strong>{" "}
          {parseInlineMarkdown(content)}
        </Alert>
      );
      i = j - 1;
    }

    // Horizontal rules
    else if (line.match(/^[\-\*\_]{3,}$/)) {
      elements.push(
        <hr
          key={i}
          className="my-6 border-t border-gray-200 dark:border-gray-700"
        />
      );
    }

    // Regular paragraphs
    else {
      elements.push(
        <p
          key={i}
          className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300"
        >
          {parseInlineMarkdown(line)}
        </p>
      );
    }

    i++;
  }

  return elements;
};

// Parse inline markdown (bold, italic, code, links)
const parseInlineMarkdown = (text: string) => {
  const patterns = [
    { regex: /```([^`]+)```/, type: "code" },
    { regex: /\*\*\*([^*]+)\*\*\*/, type: "bolditalic" },
    { regex: /\*\*([^*]+)\*\*/, type: "bold" },
    { regex: /\*([^*]+)\*/, type: "italic" },
    { regex: /___([^*]+)___/, type: "bolditalic" },
    { regex: /__([^*]+)__/, type: "bold" },
    { regex: /_([^*]+)_/, type: "italic" },
    { regex: /~~([^~]+)~~/, type: "strikethrough" },
    {
      regex: /\[([^\]]+)\]\(([^)]+)\)/,
      type: "link",
    },
  ];

  const elements: React.ReactNode[] = [];

  while (text) {
    let matched = false;

    for (const { regex, type } of patterns) {
      const match = regex.exec(text);
      if (match) {
        matched = true;

        const [fullMatch, ...groups] = match;
        const before = text.slice(0, match.index);
        const after = text.slice(match.index + fullMatch.length);

        if (before) elements.push(before);

        switch (type) {
          case "code":
            elements.push(
              <InlineCode key={elements.length}>{groups[0]}</InlineCode>
            );
            break;
          case "bold":
            elements.push(<strong key={elements.length}>{groups[0]}</strong>);
            break;
          case "italic":
            elements.push(<em key={elements.length}>{groups[0]}</em>);
            break;
          case "bolditalic":
            elements.push(
              <strong key={elements.length}>
                <em key={elements.length}>{groups[0]}</em>
              </strong>
            );
            break;
          case "strikethrough":
            elements.push(<del key={elements.length}>{groups[0]}</del>);
            break;
          case "link":
            elements.push(
              <a
                key={elements.length}
                href={groups[1]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {groups[0]}
              </a>
            );
            break;
        }

        text = after;
        break;
      }
    }

    if (!matched) {
      elements.push(text);
      break;
    }
  }

  return elements;
};

export default function MarkupRenderer({ content, isDark = false }: Props) {
  return (
    <div className="max-w-none">{parseMarkdown(content || "", isDark)}</div>
  );
}
