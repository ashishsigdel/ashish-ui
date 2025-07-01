import React, { useRef, useState, useEffect } from "react";
import { Header } from "./Header";
import Footer from "./Footer";
import {
  TableDialog,
  IframeDialog,
  ImageUploadDialog,
  PasteDialog,
} from "./AllDialogs";
import { Icons } from "./exportIcons";
import Style from "./Style";

interface Props {
  content: string;
  setContent: (content: string) => void;
  theme?: "light" | "dark";
  lightColorPanelBg?: string;
  lightColorPanelText?: string;
  darkColorPanelBg?: string;
  darkColorPanelText?: string;
  lightEditorBgColor?: string;
  darkEditorBgColor?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
  imageUploadAPIUrl?: string;
  showFooter?: boolean;
}
export const RichTextEditor = ({
  content,
  setContent,
  imageUploadAPIUrl,
  theme = "light",
  lightColorPanelBg = "#f8f9fa",
  lightColorPanelText = "#333",
  darkColorPanelBg = "#333",
  darkColorPanelText = "#F0EFF4",
  lightEditorBgColor = "#ffffff",
  darkEditorBgColor = "#444",
  lightBorderColor = "#e0e0e0",
  darkBorderColor = "#555",
  showFooter = true,
}: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showIframeDialog, setShowIframeDialog] = useState(false);
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const isInitialMount = useRef(true);
  const [showPasteDialog, setShowPasteDialog] = useState(false);
  const [pasteData, setPasteData] = useState<{
    html: string;
    text: string;
  } | null>(null);
  const savedPasteEvent = useRef<ClipboardEvent | null>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);

  // Initialize content on mount
  useEffect(() => {
    if (isInitialMount.current && editorRef.current) {
      if (content) {
        editorRef.current.innerHTML = content;
      } else {
        editorRef.current.innerHTML = "<p><br></p>";
      }

      // Set cursor at the end of the content
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);

      isInitialMount.current = false;
    }
  }, [content]);

  // Add mutation observer to clean up unwanted attributes
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Function to clean unwanted attributes from an element
    const cleanElement = (element: Element) => {
      // Remove Bitdefender and similar security extension attributes
      element.removeAttribute("bis_skin_checked");

      // Clean child elements recursively
      element.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          cleanElement(child as Element);
        }
      });
    };

    // Create mutation observer
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName?.startsWith("bis_")
        ) {
          const element = mutation.target as Element;
          element.removeAttribute(mutation.attributeName);
          shouldUpdate = true;
        }

        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              cleanElement(node as Element);
              shouldUpdate = true;
            }
          });
        }
      });

      // Only update content if we cleaned something
      if (shouldUpdate && editor.innerHTML) {
        setContent(editor.innerHTML);
      }
    });

    // Start observing
    observer.observe(editor, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["bis_skin_checked"],
    });

    // Cleanup on unmount
    return () => observer.disconnect();
  }, [setContent]);

  const updateCounts = () => {
    if (editorRef.current) {
      const editor = editorRef.current;

      // Ensure text nodes are wrapped in paragraphs
      const wrapTextNodesInParagraphs = () => {
        const walk = document.createTreeWalker(
          editor,
          NodeFilter.SHOW_TEXT,
          null
        );
        const textNodes = [];
        let node;
        while ((node = walk.nextNode())) {
          if (node.parentElement === editor && node.textContent?.trim()) {
            textNodes.push(node);
          }
        }

        textNodes.forEach((textNode) => {
          const p = document.createElement("p");
          textNode.parentNode?.insertBefore(p, textNode);
          p.appendChild(textNode);
        });
      };

      wrapTextNodesInParagraphs();

      const text = editor.innerText;
      setCharCount(text.length);
      setWordCount(
        text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length
      );
      // Update content in parent component
      setContent(editor.innerHTML);
    }
  };

  // Add keydown handler to handle Enter key for block elements
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        if (!range) return;

        // Get the current block element (heading, blockquote, etc.)
        const startContainer = range.startContainer;
        let blockElement = startContainer;
        while (
          blockElement.parentNode !== editor &&
          blockElement.parentNode !== null
        ) {
          blockElement = blockElement.parentNode as Node;
        }

        // Check if we're at the end of a block element
        const isAtEnd =
          range.endOffset ===
          (startContainer.nodeType === Node.TEXT_NODE
            ? startContainer.textContent?.length
            : startContainer.childNodes.length);

        if (isAtEnd && blockElement && blockElement !== editor) {
          const blockTags = [
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "BLOCKQUOTE",
            "PRE",
          ];

          if (blockTags.includes((blockElement as Element).tagName)) {
            e.preventDefault();

            // Create a new paragraph after the block element
            const newParagraph = document.createElement("p");
            newParagraph.innerHTML = "<br>";

            // Insert after the block element
            blockElement.parentNode?.insertBefore(
              newParagraph,
              blockElement.nextSibling
            );

            // Move cursor to the new paragraph
            const newRange = document.createRange();
            newRange.selectNodeContents(newParagraph);
            newRange.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(newRange);
            return;
          }
        }
      }
    };

    editor.addEventListener("keydown", handleKeyDown);
    return () => editor.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const checkFormats = () => {
      const formats = new Set<string>();
      ["bold", "italic", "underline", "strikeThrough"].forEach((format) => {
        if (document.queryCommandState(format)) {
          formats.add(format);
        }
      });

      const block = document.queryCommandValue("formatBlock");
      if (block) formats.add(block.toLowerCase().replace(/[<>]/g, ""));

      const alignment = [
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
      ].find((align) => document.queryCommandState(align));
      if (alignment) formats.add(alignment);

      setActiveFormats(formats);
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("keyup", checkFormats);
      editor.addEventListener("mouseup", checkFormats);
      editor.addEventListener("input", updateCounts);
    }

    return () => {
      if (editor) {
        editor.removeEventListener("keyup", checkFormats);
        editor.removeEventListener("mouseup", checkFormats);
        editor.removeEventListener("input", updateCounts);
      }
    };
  }, []);

  const exec = (command: string, value?: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    // Handle custom commands
    if (command === "inlineCode") {
      handleInlineCode();
      return;
    }

    if (command === "formatBlock" && value === "pre") {
      handleCodeBlock("code");
      return;
    }

    if (command === "blockquote") {
      handleBlockquote();
      return;
    }

    document.execCommand(command, false, value);

    // Update format tracking
    const formats = new Set(activeFormats);
    if (["bold", "italic", "underline", "strikeThrough"].includes(command)) {
      if (formats.has(command)) {
        formats.delete(command);
      } else {
        formats.add(command);
      }
    }
    setActiveFormats(formats);
  };

  const handleInlineCode = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    // Check if we're already in an inline code element
    const existingCode = commonAncestor.parentElement?.closest(
      "code:not(.inline-code-icon)"
    );
    if (existingCode && !existingCode.parentElement?.closest("pre")) {
      // Remove the code element but keep its content
      const textContent = existingCode.textContent;
      const textNode = document.createTextNode(textContent || "");
      existingCode.parentNode?.replaceChild(textNode, existingCode);

      // Update selection
      const newRange = document.createRange();
      newRange.selectNode(textNode);
      selection.removeAllRanges();
      selection.addRange(newRange);

      // Update formats
      const formats = new Set(activeFormats);
      formats.delete("code");
      setActiveFormats(formats);
    } else {
      // Create new inline code
      const codeElement = document.createElement("code");

      // If no text is selected, create an empty code element
      if (range.collapsed) {
        codeElement.textContent = "\u200B"; // Zero-width space
        range.insertNode(codeElement);

        // Place cursor inside the code element
        const newRange = document.createRange();
        newRange.setStart(codeElement.firstChild!, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        // Wrap selected text in code element
        const fragment = range.extractContents();
        codeElement.appendChild(fragment);
        range.insertNode(codeElement);
      }

      // Update formats
      const formats = new Set(activeFormats);
      formats.add("code");
      setActiveFormats(formats);
    }
    updateCounts();
  };

  const handleCodeBlock = (language = "code") => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;
    const existingPre = commonAncestor.parentElement?.closest("pre");

    if (existingPre) {
      // Convert <pre><code> back to <p>
      const textContent = existingPre.textContent || "";
      const p = document.createElement("p");
      p.textContent = textContent;
      existingPre.replaceWith(p);

      // Reset selection
      const newRange = document.createRange();
      newRange.selectNodeContents(p);
      selection.removeAllRanges();
      selection.addRange(newRange);

      const formats = new Set(activeFormats);
      formats.delete("pre");
      setActiveFormats(formats);
    } else {
      // Create <pre><code class="language-...">
      const pre = document.createElement("pre");
      pre.setAttribute("data-language", language);
      const code = document.createElement("code");
      code.className = `language-${language}`;

      if (range.collapsed) {
        code.textContent = "\u200B";
      } else {
        const fragment = range.extractContents();
        code.appendChild(fragment);
      }

      pre.appendChild(code);
      range.insertNode(pre);

      const newRange = document.createRange();
      if (range.collapsed) {
        newRange.setStart(code.firstChild!, 1);
      } else {
        newRange.selectNodeContents(code);
      }

      selection.removeAllRanges();
      selection.addRange(newRange);

      const formats = new Set(activeFormats);
      formats.add("pre");
      setActiveFormats(formats);
    }

    updateCounts();
  };

  const handleBlockquote = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;
    const existingBlockquote =
      commonAncestor.parentElement?.closest("blockquote");

    if (existingBlockquote) {
      // Convert blockquote back to paragraph
      const textContent = existingBlockquote.textContent || "";
      const p = document.createElement("p");
      p.textContent = textContent;
      existingBlockquote.replaceWith(p);

      // Reset selection
      const newRange = document.createRange();
      newRange.selectNodeContents(p);
      selection.removeAllRanges();
      selection.addRange(newRange);

      const formats = new Set(activeFormats);
      formats.delete("blockquote");
      setActiveFormats(formats);
    } else {
      // Create new blockquote
      const blockquote = document.createElement("blockquote");

      if (range.collapsed) {
        blockquote.innerHTML = "<p><br></p>";
        range.insertNode(blockquote);

        // Place cursor inside the blockquote
        const newRange = document.createRange();
        newRange.setStart(blockquote.querySelector("p")!, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        // Wrap selected content in blockquote
        const fragment = range.extractContents();
        blockquote.appendChild(fragment);
        range.insertNode(blockquote);
      }

      // Update formats
      const formats = new Set(activeFormats);
      formats.add("blockquote");
      setActiveFormats(formats);
    }
    updateCounts();
  };

  const createLink = () => {
    if (isLinkDialogOpen) {
      if (linkUrl && selectedRange) {
        const selection = window.getSelection();
        if (selection) {
          // Restore the previously saved selection
          selection.removeAllRanges();
          selection.addRange(selectedRange);

          const content = linkText || selectedRange.toString() || linkUrl;
          const link = document.createElement("a");
          link.href = linkUrl;
          link.textContent = content;
          link.style.color = "#2196F3";
          link.style.textDecoration = "none";
          link.style.cursor = "pointer";

          selectedRange.deleteContents();
          selectedRange.insertNode(link);

          // Move cursor after the link
          const newRange = document.createRange();
          newRange.setStartAfter(link);
          newRange.setEndAfter(link);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
      setIsLinkDialogOpen(false);
      setLinkUrl("");
      setLinkText("");
      setSelectedRange(null);
    } else {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        // Save the current selection
        setSelectedRange(selection.getRangeAt(0).cloneRange());
        const selectedText = selection.toString();
        if (selectedText) {
          setLinkText(selectedText);
        }
        setIsLinkDialogOpen(true);
      }
    }
  };

  const removeLink = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    // Find the link element that contains the selection
    const findLinkElement = (node: Node): HTMLAnchorElement | null => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as Element).tagName === "A"
      ) {
        return node as HTMLAnchorElement;
      }
      if (node.parentElement) {
        return findLinkElement(node.parentElement);
      }
      return null;
    };

    const linkElement = findLinkElement(commonAncestor);

    if (linkElement) {
      // Create a new text node with the link's text content
      const textNode = document.createTextNode(linkElement.textContent || "");
      // Replace the link with the text node
      linkElement.parentNode?.replaceChild(textNode, linkElement);

      // Update selection to cover the new text
      range.selectNode(textNode);
      selection.removeAllRanges();
      selection.addRange(range);

      updateCounts();
    }
  };

  const handleShowImageDialog = () => {
    saveCurrentSelection();
    setShowImageDialog(true);
  };

  const handleShowTableDialog = () => {
    saveCurrentSelection();
    setShowTableDialog(true);
  };

  const insertImage = (imageUrl: string) => {
    try {
      const editor = editorRef.current;
      if (!editor) return;

      // Restore the saved selection
      restoreSelection();

      // Get the current selection
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        // If no selection, place at the end
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      // Create image element
      const img = document.createElement("img");
      img.src = imageUrl;
      img.style.maxWidth = "100%";

      // Insert at current position
      const range = selection?.getRangeAt(0);
      if (range) {
        range.deleteContents();
        range.insertNode(img);

        // Move cursor after image
        range.setStartAfter(img);
        range.setEndAfter(img);
        selection?.removeAllRanges();
        selection?.addRange(range);

        // Add a line break after image if not at the end
        const br = document.createElement("br");
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      // Clear the saved selection
      savedSelectionRef.current = null;
      updateCounts();
    } catch (error) {
      console.error("Error inserting image:", error);
    }
  };

  const createTable = (rows: number, cols: number, includeHeader: boolean) => {
    try {
      const editor = editorRef.current;
      if (!editor) return;

      // Restore the saved selection
      restoreSelection();

      // Get the current selection
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        // If no selection, place at the end
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      // Create table HTML
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";

      if (includeHeader) {
        // Create thead section
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        for (let j = 0; j < cols; j++) {
          const headerCell = document.createElement("th");
          headerCell.innerHTML = "&nbsp;";
          headerRow.appendChild(headerCell);
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);
      }

      // Create tbody section
      const tbody = document.createElement("tbody");

      for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
          const cell = document.createElement("td");
          cell.innerHTML = "&nbsp;";
          row.appendChild(cell);
        }
        tbody.appendChild(row);
      }

      table.appendChild(tbody);

      // Insert at current position
      const range = selection?.getRangeAt(0);
      if (range) {
        range.deleteContents();
        range.insertNode(table);

        // Move cursor after table
        range.setStartAfter(table);
        range.setEndAfter(table);
        selection?.removeAllRanges();
        selection?.addRange(range);

        // Add a line break after table
        const br = document.createElement("br");
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      // Clear the saved selection
      savedSelectionRef.current = null;
      updateCounts();
    } catch (error) {
      console.error("Error inserting table:", error);
    }
    setShowTableDialog(false);
  };

  const modifyTable = (
    action:
      | "insertColumnLeft"
      | "insertColumnRight"
      | "insertRowAbove"
      | "insertRowBelow"
      | "deleteColumn"
      | "deleteRow"
  ) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    let cell = range.startContainer as Node;

    while (cell && cell.nodeName !== "TD" && cell.nodeName !== "TH") {
      cell = cell.parentNode as Node;
      if (!cell) return;
    }

    if (!cell) return;

    const tableCell = cell as HTMLTableCellElement;
    const tableRow = tableCell.parentElement as HTMLTableRowElement;
    if (!tableRow) return;

    const table = tableRow.closest("table") as HTMLTableElement;
    if (!table) return;

    const cellIndex = tableCell.cellIndex;
    const rowIndex = tableRow.rowIndex;

    switch (action) {
      case "insertColumnLeft":
      case "insertColumnRight": {
        const newIndex =
          action === "insertColumnLeft" ? cellIndex : cellIndex + 1;
        Array.from(table.rows).forEach((row) => {
          // Check if this row is in thead (header row)
          const isHeaderRow = row.parentElement?.tagName === "THEAD";

          if (isHeaderRow) {
            // Create th element for header row
            const newCell = document.createElement("th");
            if (newIndex >= row.cells.length) {
              row.appendChild(newCell);
            } else {
              row.insertBefore(newCell, row.cells[newIndex]);
            }
          } else {
            // Create td element for body row
            const newCell = document.createElement("td");
            newCell.innerHTML = "&nbsp;";
            if (newIndex >= row.cells.length) {
              row.appendChild(newCell);
            } else {
              row.insertBefore(newCell, row.cells[newIndex]);
            }
          }
        });
        break;
      }
      case "insertRowAbove":
      case "insertRowBelow": {
        const newRow = document.createElement("tr");

        // Check if we're inserting in thead area
        const isInsertingInHeader =
          rowIndex === 0 && table.tHead && action === "insertRowAbove";
        const targetParent = isInsertingInHeader
          ? table.tHead
          : table.tBodies[0] || table;

        // Create cells based on the reference row
        for (let i = 0; i < tableRow.cells.length; i++) {
          const newCell = isInsertingInHeader
            ? document.createElement("th")
            : document.createElement("td");
          newCell.innerHTML = "&nbsp;";
          newRow.appendChild(newCell);
        }

        // Insert the row
        if (action === "insertRowAbove") {
          if (isInsertingInHeader && targetParent) {
            targetParent.insertBefore(newRow, targetParent.firstChild);
          } else {
            tableRow.parentElement?.insertBefore(newRow, tableRow);
          }
        } else {
          if (tableRow.nextSibling) {
            tableRow.parentElement?.insertBefore(newRow, tableRow.nextSibling);
          } else {
            tableRow.parentElement?.appendChild(newRow);
          }
        }
        break;
      }
      case "deleteColumn": {
        if (table.rows[0].cells.length > 1) {
          Array.from(table.rows).forEach((row) => {
            if (row.cells[cellIndex]) {
              row.removeChild(row.cells[cellIndex]);
            }
          });
        }
        break;
      }
      case "deleteRow": {
        if (table.rows.length > 1) {
          tableRow.parentElement?.removeChild(tableRow);
        }
        break;
      }
    }
  };

  const insertIframe = (iframeHtml: string) => {
    try {
      const editor = editorRef.current;
      if (!editor) return;

      // Restore the saved selection
      restoreSelection();

      // Get the current selection
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        // If no selection, place at the end
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      // Create a temporary div to hold the iframe
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = iframeHtml;
      const iframe = tempDiv.firstChild;

      // Insert at current position
      const range = selection?.getRangeAt(0);
      if (range) {
        range.deleteContents();
        range.insertNode(iframe as Node);

        // Move cursor after iframe
        range.setStartAfter(iframe as Node);
        range.setEndAfter(iframe as Node);
        selection?.removeAllRanges();
        selection?.addRange(range);

        // Add a line break after iframe if not at the end
        const br = document.createElement("br");
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      // Clear the saved selection
      savedSelectionRef.current = null;
    } catch (error) {
      console.error("Error inserting iframe:", error);
    }
  };

  const handleShowIframeDialog = () => {
    saveCurrentSelection();
    setShowIframeDialog(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Add copy handler
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const container = document.createElement("div");
      container.appendChild(range.cloneContents());

      // Set both HTML and plain text in clipboard
      e.clipboardData?.setData("text/html", container.innerHTML);
      e.clipboardData?.setData("text/plain", container.textContent || "");

      e.preventDefault();
    };

    editor.addEventListener("copy", handleCopy);
    return () => editor.removeEventListener("copy", handleCopy);
  }, []);

  // Modify paste handler
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();

      const html = e.clipboardData?.getData("text/html");
      const text = e.clipboardData?.getData("text/plain") || "";

      // If content has HTML tags, show the paste dialog
      if (
        html &&
        (/<[a-z][\s\S]*>/i.test(html) ||
          (text.includes("<") && text.includes(">")))
      ) {
        savedPasteEvent.current = e;
        setPasteData({
          html: html || text, // Use text as fallback if html is empty
          text,
        });
        setShowPasteDialog(true);
      }
      // For plain text, just insert it as a paragraph
      else {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const p = document.createElement("p");
          p.textContent = text;
          range.deleteContents();
          range.insertNode(p);
          range.setStartAfter(p);
          selection.removeAllRanges();
          selection.addRange(range);
          updateCounts();
        }
      }
    };

    editor.addEventListener("paste", handlePaste);
    return () => editor.removeEventListener("paste", handlePaste);
  }, []);

  const handleKeepHtml = () => {
    if (pasteData?.html) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Clean and decode the HTML before inserting
        const tempDiv = document.createElement("div");

        // First try to decode if it's encoded
        let cleanHtml = pasteData.html;
        try {
          // Check if the content is encoded
          if (cleanHtml.includes("&lt;")) {
            tempDiv.innerHTML = cleanHtml;
            cleanHtml = tempDiv.textContent || "";
          }
        } catch (e) {
          console.error("Error decoding HTML:", e);
        }

        // Clear and set the decoded or original HTML
        tempDiv.innerHTML = cleanHtml;

        // Remove any scripts or unwanted elements
        const scripts = tempDiv.getElementsByTagName("script");
        while (scripts[0]) scripts[0].parentNode?.removeChild(scripts[0]);

        // Create fragment from cleaned HTML
        const fragment = range.createContextualFragment(tempDiv.innerHTML);
        range.deleteContents();
        range.insertNode(fragment);

        // Move cursor to end
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        updateCounts();
      }
    }
    setShowPasteDialog(false);
    setPasteData(null);
    savedPasteEvent.current = null;
  };

  const handleTextOnly = () => {
    if (pasteData) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Create text node directly without wrapping in paragraph
        const textNode = document.createTextNode(pasteData.text);
        range.deleteContents();
        range.insertNode(textNode);

        // Move cursor after inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        updateCounts();
      }
    }
    setShowPasteDialog(false);
    setPasteData(null);
    savedPasteEvent.current = null;
  };

  const handleInsertAsText = () => {
    if (pasteData) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Create paragraph and insert text
        const p = document.createElement("p");
        p.textContent = pasteData.text;
        range.deleteContents();
        range.insertNode(p);

        // Move cursor after paragraph
        range.setStartAfter(p);
        range.setEndAfter(p);
        selection.removeAllRanges();
        selection.addRange(range);
        updateCounts();
      }
    }
    setShowPasteDialog(false);
    setPasteData(null);
    savedPasteEvent.current = null;
  };

  const saveCurrentSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelectionRef.current);
    }
  };

  // Add key handler for code block and inline code escape
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const commonAncestor = range.commonAncestorContainer;

      // Find code or pre element
      const codeElement = commonAncestor.parentElement?.closest("code");
      const preElement = commonAncestor.parentElement?.closest("pre");
      const blockquoteElement =
        commonAncestor.parentElement?.closest("blockquote");

      // Handle Enter in blockquotes
      if (blockquoteElement && e.key === "Enter") {
        if (e.shiftKey) {
          // Shift+Enter: insert line break inside blockquote
          e.preventDefault();
          document.execCommand("insertLineBreak");
        } else {
          // Enter: exit blockquote and create new paragraph
          const isAtEnd =
            range.collapsed &&
            range.startOffset === range.startContainer.textContent?.length;

          if (isAtEnd) {
            e.preventDefault();

            // Create and insert a new paragraph after the blockquote
            const newParagraph = document.createElement("p");
            newParagraph.innerHTML = "<br>";

            blockquoteElement.parentNode?.insertBefore(
              newParagraph,
              blockquoteElement.nextSibling
            );

            // Move cursor to the new paragraph
            const newRange = document.createRange();
            newRange.selectNodeContents(newParagraph);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
        return;
      }

      // Handle code blocks
      if (codeElement || preElement) {
        // Handle Enter key for escaping code block
        if (e.key === "Enter" && !e.shiftKey) {
          const isAtEnd =
            range.collapsed &&
            range.startOffset === range.startContainer.textContent?.length;

          if (isAtEnd) {
            e.preventDefault();

            // Create and insert a new paragraph after the code element
            const newParagraph = document.createElement("p");
            newParagraph.innerHTML = "<br>";

            // If we're in a pre block, insert after the pre
            // If we're in an inline code, insert after the parent paragraph
            const targetElement =
              preElement ||
              (codeElement && (codeElement.closest("p") || codeElement));

            if (targetElement && targetElement.parentNode) {
              targetElement.parentNode.insertBefore(
                newParagraph,
                targetElement.nextSibling
              );

              // Move cursor to the new paragraph
              range.selectNodeContents(newParagraph);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);

              // Update formats
              const formats = new Set(activeFormats);
              formats.delete("pre");
              formats.delete("code");
              setActiveFormats(formats);
            }
            return;
          }
        }

        // Handle Space key for inline code escape
        if (e.key === " " && codeElement && !preElement) {
          const isAtEnd =
            range.collapsed &&
            range.startOffset === range.startContainer.textContent?.length;

          if (isAtEnd && codeElement.parentNode) {
            e.preventDefault();

            // Create a text node with a space
            const spaceNode = document.createTextNode(" ");

            // Insert the space after the code element
            codeElement.parentNode.insertBefore(
              spaceNode,
              codeElement.nextSibling
            );

            // Move cursor after the space
            range.selectNode(spaceNode);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);

            // Update formats
            const formats = new Set(activeFormats);
            formats.delete("code");
            setActiveFormats(formats);
            return;
          }
        }

        // Handle Backspace to prevent empty code elements
        if (
          e.key === "Backspace" &&
          range.collapsed &&
          codeElement &&
          codeElement.parentNode
        ) {
          const isEmpty =
            !codeElement.textContent?.trim() ||
            codeElement.textContent === "\u200B";
          if (isEmpty) {
            e.preventDefault();
            const p = document.createElement("p");
            p.innerHTML = "<br>";
            codeElement.parentNode.replaceChild(p, codeElement);
            range.selectNodeContents(p);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            // Update formats
            const formats = new Set(activeFormats);
            formats.delete("pre");
            formats.delete("code");
            setActiveFormats(formats);
            return;
          }
        }
      }
    };

    editor.addEventListener("keydown", handleKeyDown);
    return () => editor.removeEventListener("keydown", handleKeyDown);
  }, [activeFormats]);

  const toggleMode = () => {
    if (!isSourceMode && editorRef.current) {
      // Switching to source mode - update content from the editor
      setContent(editorRef.current.innerHTML);
    } else if (isSourceMode && editorRef.current) {
      // Switching to visual mode - update editor from content
      editorRef.current.innerHTML = content;
    }
    setIsSourceMode(!isSourceMode);
  };

  // Handle source editor changes
  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (editorRef.current) {
      editorRef.current.innerHTML = newContent;
    }
  };

  return (
    <div className={`editor-container ${isFullscreen ? "fullscreen" : ""}`}>
      <Header
        activeFormats={activeFormats}
        isFullscreen={isFullscreen}
        isLinkDialogOpen={isLinkDialogOpen}
        exec={exec}
        createLink={createLink}
        removeLink={removeLink}
        setShowImageDialog={handleShowImageDialog}
        handleShowIframeDialog={handleShowIframeDialog}
        setShowTableDialog={handleShowTableDialog}
        modifyTable={modifyTable}
        toggleFullscreen={toggleFullscreen}
        isSourceMode={isSourceMode}
        toggleMode={toggleMode}
        theme={theme}
        lightColorPanelBg={lightColorPanelBg}
        lightColorPanelText={lightColorPanelText}
        darkColorPanelBg={darkColorPanelBg}
        darkColorPanelText={darkColorPanelText}
        lightBorderColor={lightBorderColor}
        darkBorderColor={darkBorderColor}
        handleCodeBlock={handleCodeBlock}
      />

      {isLinkDialogOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {Icons.link}
              Insert Link
            </h3>
            <div className="url-section">
              <span className="span-title">Link text (optional)</span>
              <div className="input-group">
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="url-input"
                />
              </div>
              <span className="span-title">Enter URL</span>
              <div className="input-group">
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Enter URL"
                  className="url-input"
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "10px",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <button className="btn-primary" onClick={createLink}>
                Apply
              </button>
              <button
                className="btn-secondary"
                onClick={() => setIsLinkDialogOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showTableDialog && (
        <TableDialog
          onInsert={createTable}
          onClose={() => setShowTableDialog(false)}
        />
      )}

      {showImageDialog && (
        <ImageUploadDialog
          onInsert={insertImage}
          onClose={() => setShowImageDialog(false)}
          imageUploadAPIUrl={imageUploadAPIUrl}
        />
      )}

      {showIframeDialog && (
        <IframeDialog
          onInsert={insertIframe}
          onClose={() => setShowIframeDialog(false)}
        />
      )}

      {showPasteDialog && pasteData && (
        <PasteDialog
          htmlContent={pasteData.html}
          textContent={pasteData.text}
          onKeepHtml={handleKeepHtml}
          onInsertAsText={handleInsertAsText}
          onTextOnly={handleTextOnly}
          onCancel={() => {
            setShowPasteDialog(false);
            setPasteData(null);
            savedPasteEvent.current = null;
          }}
        />
      )}

      <div className="editor-main">
        <div
          ref={editorRef}
          contentEditable
          className={`editor-content ${isSourceMode ? "hidden" : ""}`}
          onInput={updateCounts}
          onBlur={updateCounts}
        />
        <textarea
          value={content}
          onChange={handleSourceChange}
          className={`source-editor ${isSourceMode ? "" : "hidden"}`}
        />
      </div>

      {showFooter && (
        <Footer
          wordCount={wordCount}
          charCount={charCount}
          theme={theme}
          lightColorPanelBg={lightColorPanelBg}
          lightColorPanelText={lightColorPanelText}
          darkColorPanelBg={darkColorPanelBg}
          darkColorPanelText={darkColorPanelText}
          lightBorderColor={lightBorderColor}
          darkBorderColor={darkBorderColor}
        />
      )}

      <Style
        theme={theme}
        lightBorderColor={lightBorderColor}
        darkBorderColor={darkBorderColor}
        lightColorPanelBg={lightColorPanelBg}
        darkColorPanelBg={darkColorPanelBg}
        lightColorPanelText={lightColorPanelText}
        darkColorPanelText={darkColorPanelText}
        lightEditorBgColor={lightEditorBgColor}
        darkEditorBgColor={darkEditorBgColor}
        showFooter={showFooter}
      />
    </div>
  );
};
