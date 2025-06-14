import React, { useRef, useState, useEffect } from "react";

import { Header } from "./Header";
import Footer from "./Footer";
import { Icons } from "./exportIcons";

interface TableDialogProps {
  onInsert: (rows: number, cols: number) => void;
  onClose: () => void;
}

const TableDialog = ({ onInsert, onClose }: TableDialogProps) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hoveredCells, setHoveredCells] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const renderTablePreview = () => (
    <div className="table-preview">
      <div
        className="table-grid"
        style={{
          gridTemplateRows: `repeat(${rows}, 20px)`,
          gridTemplateColumns: `repeat(${cols}, 20px)`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const isHovered =
            hoveredCells && row < hoveredCells.row && col < hoveredCells.col;

          return (
            <div
              key={index}
              className={`table-cell ${isHovered ? "hovered" : ""}`}
              onMouseEnter={() =>
                setHoveredCells({ row: row + 1, col: col + 1 })
              }
              onClick={() => {
                setRows(row + 1);
                setCols(col + 1);
              }}
            />
          );
        })}
      </div>
      <div className="table-size">
        {rows} × {cols}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "1000",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          width: "320px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
            fontSize: "18px",
            fontWeight: "600",
            color: "#1e293b",
          }}
        >
          <span style={{ marginRight: "8px" }}>{Icons.table}</span>
          Insert Table
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              Rows:
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={rows}
              onChange={(e) =>
                setRows(
                  Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                )
              }
              className="input-field"
            />
          </div>

          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              Columns:
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={cols}
              onChange={(e) =>
                setCols(
                  Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                )
              }
              className="input-field"
            />
          </div>
        </div>

        {renderTablePreview()}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f1f5f9",
              color: "#64748b",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background-color 0.2s ease",
            }}
          >
            Cancel
          </button>
          <button onClick={() => onInsert(rows, cols)} className="btn-primary">
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
};

interface ImageUploadDialogProps {
  onInsert: (imageUrl: string) => void;
  onClose: () => void;
  imageUploadAPIUrl?: string;
}

const ImageUploadDialog = ({
  onInsert,
  onClose,
  imageUploadAPIUrl,
}: ImageUploadDialogProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      if (!imageUploadAPIUrl)
        throw new Error("Image upload API URL is required");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(imageUploadAPIUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      onInsert(data.data.url);
      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlInsert = () => {
    if (imageUrl.trim()) {
      onInsert(imageUrl);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">
          {Icons.image}
          Insert Image
        </h3>

        <div className="image-upload-options">
          {imageUploadAPIUrl && (
            <div className="upload-section">
              <div
                className={`file-upload-container ${
                  isDragging ? "dragging" : ""
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  id="screenshot"
                  name="screenshot"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file-input"
                />
                <label htmlFor="screenshot" className="file-upload-label">
                  <svg className="upload-icon" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                  </svg>
                  <span className="upload-text">
                    {isDragging
                      ? "Drop image here"
                      : "Click to upload or drop here"}
                  </span>
                  <span className="upload-subtext">
                    PNG, JPG, JPEG, WEBP etc.
                  </span>
                  {selectedFile && (
                    <span className="selected-file">
                      Selected: {selectedFile.name}
                    </span>
                  )}
                </label>
                <style>
                  {`
                  .file-upload-container {
                    border: 1px dashed;
                    border-color: #d1d5db;
                    border-radius: 0.375rem;
                    padding: 1rem;
                    transition: all 0.2s ease;
                  }
                  
                  .file-upload-container.dragging {
                    border-color: #3b82f6;
                    background-color: #eff6ff;
                  }
                  
                  .dark .file-upload-container {
                    border-color: #374151;
                  }
                  
                  .dark .file-upload-container.dragging {
                    border-color: #60a5fa;
                    background-color: #1e3a8a;
                  }
                  
                  .file-input {
                    display: none;
                  }
                  
                  .file-upload-label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                  }
                  
                  .upload-icon {
                    width: 2rem;
                    height: 2rem;
                    color: #9ca3af;
                    margin-bottom: 0.5rem;
                  }
                  
                  .upload-text {
                    font-size: 0.875rem;
                    color: #6b7280;
                    text-align: center;
                  }
                  
                  .upload-subtext {
                    font-size: 0.75rem;
                    color: #9ca3af;
                    margin-top: 0.25rem;
                  }
                  
                  .selected-file {
                    font-size: 0.75rem;
                    color: #3b82f6;
                    margin-top: 0.5rem;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  
                  .dark .selected-file {
                    color: #60a5fa;
                  }
                `}
                </style>
              </div>
              {selectedFile && (
                <button
                  className="btn-primary"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              )}
            </div>
          )}

          <div className="url-section">
            <span className="span-title">Or Insert from URL</span>
            <div className="input-group">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="url-input"
              />
              <button
                className="btn-primary"
                onClick={handleUrlInsert}
                disabled={!imageUrl.trim()}
              >
                Insert
              </button>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

interface IframeDialogProps {
  onInsert: (iframeHtml: string) => void;
  onClose: () => void;
}

const IframeDialog = ({ onInsert, onClose }: IframeDialogProps) => {
  const [iframeHtml, setIframeHtml] = useState("");

  const handleInsert = () => {
    if (iframeHtml.trim()) {
      // Clean and validate the input
      let cleanHtml = iframeHtml.trim();

      // If the input is just a URL, convert it to an iframe
      if (cleanHtml.startsWith("http")) {
        cleanHtml = `<iframe src="${cleanHtml}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
      }

      // If the input doesn't contain iframe tags, assume it's a URL and wrap it
      if (!cleanHtml.includes("<iframe")) {
        cleanHtml = `<iframe src="${cleanHtml}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
      }

      onInsert(cleanHtml);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">
          {Icons.video}
          Insert Iframe
        </h3>

        <div className="url-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span className="span-title">Or Insert from URL</span>
            <button
              onClick={() =>
                setIframeHtml(
                  '<iframe src="https://www.your-actual-url.pdf" height="700px" width="100%" title="Iframe Example"></iframe>'
                )
              }
              className="btn-primary"
            >
              Import template
            </button>
          </div>
          <div className="input-group">
            <textarea
              rows={6}
              value={iframeHtml}
              onChange={(e) => setIframeHtml(e.target.value)}
              placeholder="Enter iframe HTML code"
              className="url-input"
              style={{ resize: "none" }}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleInsert}
            disabled={!iframeHtml.trim()}
          >
            Insert Iframe
          </button>
        </div>
      </div>
    </div>
  );
};

interface PasteDialogProps {
  htmlContent: string;
  textContent: string;
  onKeepHtml: () => void;
  onInsertAsText: () => void;
  onTextOnly: () => void;
  onCancel: () => void;
}

const PasteDialog = ({
  htmlContent,
  textContent,
  onKeepHtml,
  onInsertAsText,
  onTextOnly,
  onCancel,
}: PasteDialogProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content paste-dialog">
        <h3 className="modal-title">
          Your code is similar to HTML. Keep as HTML?
        </h3>
        <div className="paste-preview">
          <div className="preview-section">
            <h4>HTML Preview:</h4>
            <div
              className="preview-content html-preview"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
          <div className="preview-section">
            <h4>Text Preview:</h4>
            <div className="preview-content text-preview">{textContent}</div>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onKeepHtml}>
            Keep HTML
          </button>
          <button className="btn-secondary" onClick={onInsertAsText}>
            Insert as Text
          </button>
          <button className="btn-secondary" onClick={onTextOnly}>
            Insert Text Only
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

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
    if (isInitialMount.current) {
      if (editorRef.current) {
        if (content) {
          editorRef.current.innerHTML = content;
        }
        // Set initial paragraph if editor is empty
        if (!editorRef.current.innerHTML.trim()) {
          editorRef.current.innerHTML = "<p><br></p>";
        }
      }
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

  // Add keydown handler to handle Enter key
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (range && !range.startContainer.parentElement?.closest("p")) {
          e.preventDefault();
          const p = document.createElement("p");
          p.innerHTML = "<br>";
          range.insertNode(p);
          range.setStartAfter(p);
          selection?.removeAllRanges();
          selection?.addRange(range);
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
      handleCodeBlock();
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
      codeElement.className = "inline-code";

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

  const handleCodeBlock = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    // Check if we're already in a code block
    const existingPre = commonAncestor.parentElement?.closest("pre");
    if (existingPre) {
      // Convert back to paragraph
      const textContent = existingPre.textContent;
      const p = document.createElement("p");
      p.textContent = textContent || "";
      existingPre.parentNode?.replaceChild(p, existingPre);

      // Update selection
      const newRange = document.createRange();
      newRange.selectNodeContents(p);
      selection.removeAllRanges();
      selection.addRange(newRange);

      // Update formats
      const formats = new Set(activeFormats);
      formats.delete("pre");
      setActiveFormats(formats);
    } else {
      // Create new code block
      const pre = document.createElement("pre");
      const code = document.createElement("code");

      // If no text is selected, create an empty code block
      if (range.collapsed) {
        code.textContent = "\u200B"; // Zero-width space
      } else {
        // Get the selected content
        const fragment = range.extractContents();
        code.appendChild(fragment);
      }

      pre.appendChild(code);
      range.insertNode(pre);

      // Place cursor inside the code block
      const newRange = document.createRange();
      if (range.collapsed) {
        newRange.setStart(code.firstChild!, 1);
      } else {
        newRange.selectNodeContents(code);
      }
      selection.removeAllRanges();
      selection.addRange(newRange);

      // Update formats
      const formats = new Set(activeFormats);
      formats.add("pre");
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

  const createTable = (rows: number, cols: number) => {
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
      for (let i = 0; i < rows; i++) {
        const row = table.insertRow();
        for (let j = 0; j < cols; j++) {
          const cell = row.insertCell();
          cell.innerHTML = "&nbsp;";
        }
      }

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
          const newCell = row.insertCell(newIndex);
          newCell.innerHTML = "&nbsp;";
        });
        break;
      }
      case "insertRowAbove":
      case "insertRowBelow": {
        const newIndex = action === "insertRowAbove" ? rowIndex : rowIndex + 1;
        const newRow = table.insertRow(newIndex);
        for (let i = 0; i < tableRow.cells.length; i++) {
          const newCell = newRow.insertCell(i);
          newCell.innerHTML = "&nbsp;";
        }
        break;
      }
      case "deleteColumn": {
        if (table.rows[0].cells.length > 1) {
          Array.from(table.rows).forEach((row) => {
            row.deleteCell(cellIndex);
          });
        }
        break;
      }
      case "deleteRow": {
        if (table.rows.length > 1) {
          table.deleteRow(rowIndex);
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

      <style>{`
      .editor-container {
          font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          font-weight: 400;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          border-radius: 8px;
        }

        .editor-container.fullscreen {
          width: 100vw;
          height: 100dvh;
          border-radius: 0;
          border: none;
          overflow: hidden;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }

        .editor-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          line-height: 1.6;
          color: ${
            theme === "light" ? lightColorPanelText : darkColorPanelText
          };
        }

        .editor-content:focus {
          outline: none;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: ${
            theme === "light" ? lightEditorBgColor : darkEditorBgColor
          };
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          width: 320px;
        }

        .modal-title {
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: ${
            theme === "light" ? lightColorPanelText : darkColorPanelText
          };
        }

        .modal-title svg {
          width: 20px;
          height: 20px;
        }

        .input-group {
          display: flex;
          gap: 16px;
          margin-bottom: 10px;
          align-items: center;
        }

        .input-field {
          flex: 1;
        }

        .input-field-input {
          background-color: ${
            theme === "light" ? lightEditorBgColor : darkEditorBgColor
          };
          color: ${theme === "light" ? "black" : "white"};
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
        }

        .input-field label {
          display: block;
          margin-bottom: 8px;
          color: ${
            theme === "light" ? lightColorPanelText : darkColorPanelText
          };
          font-size: 14px;
        }

        .input-field input {
          width: 60px;
          padding: 8px;
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          background-color: ${
            theme === "light" ? lightEditorBgColor : darkEditorBgColor
          };
          border-radius: 4px;
          transition: border-color 0.3s;
        }

        .input-field input:focus {
          border-color: #4CAF50;
          outline: none;
        }

        .table-preview {
         display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '20px 0'
        }

        .table-grid {
          display: grid;
          gap: 2px;
          background-color: #f5f5f5;
          padding: 4px;
          border-radius: 4px;
        }

        .table-cell {
          width: 20px;
          height: 20px;
          background-color: ${
            theme === "light" ? lightEditorBgColor : darkEditorBgColor
          };
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .table-cell.hovered {
          background-color: #4CAF50;
        }

        .table-size {
          text-align: center;
          margin-top: 8px;
          font-size: 14px;
          color: ${
            theme === "light" ? lightColorPanelText : darkColorPanelText
          };
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
        }

        .btn-primary {
          padding: 10px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          background-color: #45a049;
        }

        .btn-secondary {
          padding: 8px 16px;
          background-color: ${
            theme === "light" ? darkEditorBgColor : lightEditorBgColor
          };
          color: ${theme === "light" ? "white" : "black"};
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-secondary:hover {
          background-color: ${
            theme === "light" ? darkEditorBgColor : lightEditorBgColor
          };
          color: ${theme === "light" ? "white" : "black"};
        }

        .link-dialog {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 300px;
        }

        .link-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .link-input {
          width: 100%;
          padding: 8px;
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          border-radius: 4px;
        }

        .link-input:focus {
          border-color: #4CAF50;
          outline: none;
        }

        /* Editor Content Styles */
        .editor-content h1 { font-size: 2em; margin: 0.67em 0; }
        .editor-content h2 { font-size: 1.5em; margin: 0.75em 0; }
        .editor-content h3 { font-size: 1.17em; margin: 0.83em 0; }
        .editor-content h4 { font-size: 1em; margin: 1.12em 0; }

        .editor-content p { margin: 1em 0; }

        .editor-content blockquote {
          margin: 1em 0;
          padding-left: 1em;
          border-left: 4px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          color: ${
            theme === "light" ? lightColorPanelText : darkColorPanelText
          };
          font-style: italic;
        }

        .editor-content pre {
          background-color: ${
            theme === "light" ? "rgb(240, 239, 244)" : "rgb(32, 32, 32)"
          };
          color: ${theme === "light" ? "black" : "white"};
          padding: 1em;
          border-radius: 4px;
          overflow-x: auto;
          font-family: 'Courier New', Courier, monospace;
          margin: 1em 0;
          position: relative;
        }

        .editor-content pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
          font-family: inherit;
          font-size: 0.9em;
          white-space: pre;
          display: block;
          color: ${theme === "light" ? "black" : "white"};
        }

        .editor-content code:not(pre code) {
          background-color: ${
            theme === "light" ? lightEditorBgColor : darkEditorBgColor
          };
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.9em;
          color: #d63384;
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          margin: 0 0.2em;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .editor-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }

        .editor-content table td,
        .editor-content table th {
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          padding: 8px;
          vertical-align: top;
        }

        .editor-content img {
          max-width: 100%;
          height: auto;
        }

        .editor-content iframe {
          max-width: 100%;
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          margin: 1em 0;
        }

        .editor-content a {
          color: #2196F3;
          text-decoration: none;
          cursor: pointer;
          pointer-events: all;
        }

        .editor-content a:hover {
          text-decoration: underline;
        }

        .editor-content ul,
        .editor-content ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        .editor-content hr {
          border: none;
          border-top: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          margin: 1em 0;
        }

        .list-icon {
          font-size: 14px;
          margin: 0;
          padding: 0;
        }

        .inline-code-icon {
          font-size: 14px;
          font-family: monospace;
        }

        .upload-section {
          display: flex;
          flex-direction: column;
        }

        .upload-section .btn-primary {
          margin-top: 10px;
          align-self: flex-end;
        }

        .image-upload-options {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 20px 0;
        }

        .url-section {
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          padding: 15px;
          border-radius: 4px;
        }

        .url-section h4 {
          margin: 0 0 10px;
          font-size: 14px;
          color: #666;
        }

        .file-upload-area {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .selected-file {
          font-size: 14px;
          color: ${
            theme === "light" ? lightColorPanelText : darkColorPanelText
          };
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .url-input {
          width: 100%;
          margin-top: 10px;
          padding: 10px 15px;
          background: ${
            theme === "light" ? lightColorPanelBg : darkColorPanelBg
          };
          color: ${
            theme === "light" ? lightColorPanelText : darkColorPanelText
          };
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .url-input:focus {
          border-color: #4CAF50;
          outline: none;
        }

        .modal-content {
          width: 500px;
          max-width: 90vw;
        }

        .paste-dialog {
          width: 600px;
          max-width: 90vw;
        }

        .paste-preview {
          margin: 15px 0;
          display: flex;
          gap: 20px;
        }

        .preview-section {
          flex: 1;
          min-width: 0;
        }

        .preview-section h4 {
          margin: 0 0 10px;
          font-size: 14px;
          color: #666;
        }

        .preview-content {
          border: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          border-radius: 4px;
          padding: 10px;
          max-height: 200px;
          overflow: auto;
          font-size: 13px;
          background: ${
            theme === "light" ? lightEditorBgColor : darkEditorBgColor
          };
        }

        .html-preview {
          white-space: pre-wrap;
        }

        .text-preview {
          white-space: pre-wrap;
          font-family: monospace;
        }

        .editor-main {
          flex: 1;
          position: relative;
          overflow: hidden;
           border-radius: ${showFooter ? "0 0 0 0" : "0 0 8px 8px"} ;
        }

        .editor-content,
        .source-editor {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 20px;
          overflow-y: auto;
          line-height: 1.6;
          background-color: ${
            theme === "light" ? lightEditorBgColor : darkEditorBgColor
          };
          color: ${
            theme === "light" ? lightColorPanelText : darkColorPanelText
          };
        }

        .source-editor {
          width: 100%;
          height: 100%;
          resize: none;
          border: none;
          font-family: 'Courier New', Courier, monospace;
          font-size: 14px;
          white-space: pre-wrap;
          
        }

        .source-editor:focus {
          outline: none;
        }

        .hidden {
          display: none;
        }

        .span-title {
          font-size: 14px;
          font-weight: 600;
          color: ${
            theme === "light" ? "rgb(42, 41, 41)" : "rgb(201, 201, 201)"
          };
        }
      `}</style>
    </div>
  );
};
