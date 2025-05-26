import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { getStyles } from "./styles";

interface Props {
  content: string | undefined;
  isDark?: boolean;
  primaryColor?: string;
  noMarginInParagraphs?: boolean;
}

type CodeBlockProps = {
  children: string;
  language?: string;
  isDark: boolean;
  styles: any;
};

type InlineCodeProps = {
  children: string;
  styles: any;
};

type TableProps = {
  children: React.ReactNode;
  styles: any;
};

type BlockquoteProps = {
  children: React.ReactNode;
  styles: any;
};

type AlertProps = {
  type?: "info" | "warning" | "error" | "success";
  children: React.ReactNode;
  styles: any;
};

const CodeBlock = ({ children, language, isDark, styles }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const theme = isDark ? "dark" : "light";

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.codeBlock}>
      <div style={styles.codeHeader}>
        <span
          style={{
            ...styles.languageLabel,
          }}
        >
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          style={{
            ...styles.copyButton,
          }}
        >
          {copied ? (
            <span style={styles.copyText}>
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
                style={{ color: "#16a34a" }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </span>
          ) : (
            <span style={styles.copyText}>
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

const InlineCode = ({ children, styles }: InlineCodeProps) => (
  <code style={styles.inlineCode}>{children}</code>
);

const Table = ({ children, styles }: TableProps) => (
  <div style={styles.tableContainer}>
    <table style={styles.table}>{children}</table>
  </div>
);

const Blockquote = ({ children, styles }: BlockquoteProps) => (
  <blockquote style={styles.blockquote}>{children}</blockquote>
);

const Alert = ({ type = "info", children, styles }: AlertProps) => {
  const baseAlertStyle = {
    ...styles.alert,
    borderLeftWidth: "4px",
    borderLeftStyle: "solid",
  };

  const alertStyles = {
    info: {
      ...baseAlertStyle,
      ...styles.alertInfo,
    },
    warning: {
      ...baseAlertStyle,
      ...styles.alertWarning,
    },
    error: {
      ...baseAlertStyle,
      ...styles.alertError,
    },
    success: {
      ...baseAlertStyle,
      ...styles.alertSuccess,
    },
  };

  return <div style={alertStyles[type]}>{children}</div>;
};

const parseList = (
  lines: string[],
  startIndex: number,
  styles: any,
  currentIndent: number = 0
): { element: React.ReactNode; nextIndex: number } => {
  const items: { content: React.ReactNode; nested?: React.ReactNode }[] = [];
  let i = startIndex;
  let isOrdered: boolean | null = null;

  const getIndent = (line: string) => line.match(/^\s*/)?.[0].length ?? 0;
  const listRegex = /^(\s*)([-+*]|\d+\.)\s+/;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    const match = line.match(listRegex);
    const indent = getIndent(line);

    // If no match or indent is less than current, we're done with this list level
    if (!match || indent < currentIndent) break;

    const [, , marker] = match;

    // Check if this line is at the next nesting level
    if (indent > currentIndent) {
      // This is a nested list - attach it to the previous item
      if (items.length > 0) {
        const { element: nested, nextIndex } = parseList(
          lines,
          i,
          styles,
          indent
        );
        // Attach nested list to the last item
        const lastItem = items[items.length - 1];
        items[items.length - 1] = { ...lastItem, nested };
        i = nextIndex;
      } else {
        // No previous item to attach to - skip this line
        i++;
      }
      continue;
    }

    // Determine isOrdered only once, based on the first valid list item marker at current level
    if (isOrdered === null) {
      isOrdered = /^\d+\./.test(marker);
    }

    // Validate that the marker type is consistent with the list type
    const currentIsOrdered = /^\d+\./.test(marker);
    if (currentIsOrdered !== isOrdered) {
      // Marker type changed - this might be a different list
      break;
    }

    const content = line.replace(listRegex, "");
    items.push({
      content: parseInlineMarkdown(content.trim(), styles),
    });

    i++;
  }

  // Don't create empty lists
  if (items.length === 0) {
    return { element: null, nextIndex: i };
  }

  const ListTag = isOrdered ? "ol" : "ul";

  const element = React.createElement(
    ListTag,
    {
      key: startIndex,
      style: isOrdered ? styles.orderedList : styles.unorderedList,
    },
    items.map((item, idx) => (
      <li key={idx} style={styles.listItem}>
        {item.content}
        {item.nested}
      </li>
    ))
  );

  return { element, nextIndex: i };
};

const parseMarkdown = (content: string, isDark: boolean, styles: any) => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

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

      const headingStyles = {
        h1: { ...styles.heading, ...styles.h1 },
        h2: { ...styles.heading, ...styles.h2 },
        h3: { ...styles.heading, ...styles.h3 },
        h4: { ...styles.heading, ...styles.h4 },
        h5: { ...styles.heading, ...styles.h5 },
        h6: { ...styles.heading, ...styles.h6 },
      };

      const currentHeadingStyle = {
        ...headingStyles[HeaderTag],
      };

      elements.push(
        React.createElement(
          HeaderTag,
          {
            key: i,
            style: currentHeadingStyle,
          },
          parseInlineMarkdown(text, styles)
        )
      );
    } else if (line.startsWith("```")) {
      const language = line.replace("```", "").trim();
      const codeLines = [];
      i++;

      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }

      elements.push(
        <div key={i} style={{ margin: "1rem 0" }}>
          <CodeBlock language={language} isDark={isDark} styles={styles}>
            {codeLines.join("\n")}
          </CodeBlock>
        </div>
      );
    } else if (line.includes("|") && line.trim().startsWith("|")) {
      const tableRows = [];
      let j = i;

      while (j < lines.length && lines[j].includes("|")) {
        if (!lines[j].trim().match(/^[\|\s\-]+$/)) {
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
          <Table key={i} styles={styles}>
            <thead>
              <tr
                style={{
                  ...styles.tableHeaderRow,
                }}
              >
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    style={{
                      ...styles.tableHeaderCell,
                    }}
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
                    style={{
                      ...styles.tableRow,
                    }}
                  >
                    {cells.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        style={{
                          ...styles.tableCell,
                        }}
                      >
                        {parseInlineMarkdown(cell, styles)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        );
        i = j - 1;
      }
    } else if (/^\s*([-+*]|\d+\.)\s+/.test(line)) {
      const { element, nextIndex } = parseList(lines, i, styles);
      elements.push(element);
      i = nextIndex - 1;
    } else if (
      line.startsWith(">") &&
      !line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i)
    ) {
      const quoteLines = [];
      let j = i;

      while (j < lines.length && lines[j].startsWith(">")) {
        quoteLines.push(lines[j].replace(/^>\s?/, ""));
        j++;
      }

      elements.push(
        <Blockquote key={i} styles={styles}>
          {quoteLines.join(" ")}
        </Blockquote>
      );
      i = j - 1;
    } else if (line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i)) {
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
        <Alert key={i} type={alertType} styles={styles}>
          <strong style={{ textTransform: "capitalize" }}>{type}:</strong>{" "}
          {parseInlineMarkdown(content, styles)}
        </Alert>
      );
      i = j - 1;
    } else if (line.match(/^[\-\*\_]{3,}$/)) {
      elements.push(
        <hr
          key={i}
          style={{
            ...styles.horizontalRule,
          }}
        />
      );
    } else {
      elements.push(
        <p
          key={i}
          style={{
            ...styles.paragraph,
          }}
        >
          {parseInlineMarkdown(line, styles)}
        </p>
      );
    }

    i++;
  }

  return elements;
};

const parseInlineMarkdown = (text: string, styles: any): React.ReactNode[] => {
  const patterns = [
    { regex: /```([^`]+)```/, type: "code" },
    { regex: /\^\^([^^]+)\^\^/, type: "superscript" },
    { regex: /~([^~]+)~/, type: "subscript" },
    { regex: /\*\*\*([^*]+)\*\*\*/, type: "bolditalic" },
    { regex: /___([^_]+)___/, type: "bolditalic" },
    { regex: /\*\*([^*]+)\*\*/, type: "bold" },
    { regex: /__([^_]+)__/, type: "bold" },
    { regex: /\*([^*]+)\*/, type: "italic" },
    { regex: /_([^_]+)_/, type: "italic" },
    { regex: /~~([^~]+)~~/, type: "strikethrough" },
    {
      regex: /\[([^\]]+)\]\(([^)]+)\)/,
      type: "link",
    },
    {
      regex: /!\[([^\]]*)\]\(([^)]+)\)/,
      type: "image",
    },
  ];

  const elements: React.ReactNode[] = [];

  let current = text;

  while (current.length > 0) {
    let earliestMatchIndex = current.length;
    let selectedPattern: (typeof patterns)[0] | null = null;
    let selectedMatch: RegExpExecArray | null = null;

    for (const pattern of patterns) {
      const match = pattern.regex.exec(current);
      if (match && match.index < earliestMatchIndex) {
        earliestMatchIndex = match.index;
        selectedPattern = pattern;
        selectedMatch = match;
      }
    }

    if (!selectedMatch || !selectedPattern) {
      elements.push(current);
      break;
    }

    // Add text before the match
    if (selectedMatch.index > 0) {
      elements.push(current.slice(0, selectedMatch.index));
    }

    const [fullMatch, ...groups] = selectedMatch;
    const remaining = current.slice(selectedMatch.index + fullMatch.length);

    // Add the matched styled element
    switch (selectedPattern.type) {
      case "code":
        elements.push(
          <InlineCode key={elements.length} styles={styles}>
            {groups[0]}
          </InlineCode>
        );
        break;
      case "superscript":
        elements.push(<sup key={elements.length}>{groups[0]}</sup>);
        break;
      case "subscript":
        elements.push(<sub key={elements.length}>{groups[0]}</sub>);
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
            <em>{groups[0]}</em>
          </strong>
        );
        break;
      case "strikethrough":
        elements.push(<del key={elements.length}>{groups[0]}</del>);
        break;
      case "link":
        elements.push(
          <MarkdownLink key={elements.length} href={groups[1]} styles={styles}>
            {groups[0]}
          </MarkdownLink>
        );
        break;
      case "image":
        elements.push(
          <img
            key={elements.length}
            src={groups[1]}
            alt={groups[0]}
            style={styles.image}
          />
        );
        break;
    }

    current = remaining;
  }

  return elements;
};
const MarkdownLink = ({ href, children, styles }: any) => {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        ...styles.link,
        ...(hover ? styles.linkHover : {}),
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </a>
  );
};

export default function MarkupRenderer({
  content,
  isDark = false,
  primaryColor = "#ffffff",
  noMarginInParagraphs = false,
}: Props) {
  const styles = getStyles(primaryColor, isDark, noMarginInParagraphs);
  return (
    <div style={styles.container}>
      {parseMarkdown(content || "", isDark, styles)}
    </div>
  );
}
