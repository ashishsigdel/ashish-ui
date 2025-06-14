import { Icons } from "./exportIcons";

interface HeaderProps {
  activeFormats: Set<string>;
  isFullscreen: boolean;
  isLinkDialogOpen: boolean;
  exec: (command: string, value?: string) => void;
  createLink: () => void;
  removeLink: () => void;
  setShowImageDialog: (show: boolean) => void;
  handleShowIframeDialog: () => void;
  setShowTableDialog: (show: boolean) => void;
  modifyTable: (
    action:
      | "insertColumnLeft"
      | "insertColumnRight"
      | "insertRowAbove"
      | "insertRowBelow"
      | "deleteColumn"
      | "deleteRow"
  ) => void;
  toggleFullscreen: () => void;
  isSourceMode: boolean;
  toggleMode: () => void;
  theme?: "light" | "dark";
  lightColorPanelBg?: string;
  lightColorPanelText?: string;
  darkColorPanelBg?: string;
  darkColorPanelText?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
}

export const Header = ({
  activeFormats,
  isFullscreen,
  isLinkDialogOpen,
  exec,
  createLink,
  removeLink,
  setShowImageDialog,
  handleShowIframeDialog,
  setShowTableDialog,
  modifyTable,
  toggleFullscreen,
  isSourceMode,
  toggleMode,
  theme,
  lightColorPanelBg,
  lightColorPanelText,
  darkColorPanelBg,
  darkColorPanelText,
  lightBorderColor,
  darkBorderColor,
}: HeaderProps) => {
  return (
    <div className="toolbar-container">
      <div className="toolbar">
        <div className="toolbar-group">
          <button
            onClick={() => exec("bold")}
            title="Bold (Ctrl+B)"
            className={`toolbar-button ${
              activeFormats.has("bold") ? "active" : ""
            }`}
          >
            {Icons.bold}
          </button>
          <button
            onClick={() => exec("italic")}
            title="Italic (Ctrl+I)"
            className={`toolbar-button ${
              activeFormats.has("italic") ? "active" : ""
            }`}
          >
            {Icons.italic}
          </button>
          <button
            onClick={() => exec("underline")}
            title="Underline (Ctrl+U)"
            className={`toolbar-button ${
              activeFormats.has("underline") ? "active" : ""
            }`}
          >
            {Icons.underline}
          </button>
          <button
            onClick={() => exec("strikeThrough")}
            title="Strikethrough"
            className={`toolbar-button ${
              activeFormats.has("strikethrough") ? "active" : ""
            }`}
          >
            {Icons.strikethrough}
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => exec("justifyLeft")}
            title="Align Left"
            className={`toolbar-button ${
              activeFormats.has("justifyLeft") ? "active" : ""
            }`}
          >
            {Icons.alignLeft}
          </button>
          <button
            onClick={() => exec("justifyCenter")}
            title="Align Center"
            className={`toolbar-button ${
              activeFormats.has("justifyCenter") ? "active" : ""
            }`}
          >
            {Icons.alignCenter}
          </button>
          <button
            onClick={() => exec("justifyRight")}
            title="Align Right"
            className={`toolbar-button ${
              activeFormats.has("justifyRight") ? "active" : ""
            }`}
          >
            {Icons.alignRight}
          </button>
          <button
            onClick={() => exec("justifyFull")}
            title="Justify"
            className={`toolbar-button ${
              activeFormats.has("justifyFull") ? "active" : ""
            }`}
          >
            {Icons.alignJustify}
          </button>
        </div>

        <div className="toolbar-group">
          <select
            onChange={(e) => exec("formatBlock", e.target.value)}
            value={
              Array.from(activeFormats).find((f) =>
                ["p", "h1", "h2", "h3", "h4", "blockquote", "pre"].includes(f)
              ) || "p"
            }
            className="format-select"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="blockquote">Quote</option>
            <option value="pre">Code Block</option>
          </select>
          <button
            onClick={() => exec("insertHorizontalRule")}
            title="Horizontal Line"
            className="toolbar-button"
          >
            {Icons.minus}
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => exec("insertUnorderedList")}
            title="Bullet List"
            className={`toolbar-button ${
              activeFormats.has("insertUnorderedList") ? "active" : ""
            }`}
          >
            {Icons.list}
          </button>
          <button
            onClick={() => exec("insertOrderedList")}
            title="Numbered List"
            className={`toolbar-button ${
              activeFormats.has("insertOrderedList") ? "active" : ""
            }`}
          >
            {Icons.orderedList}
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => exec("formatBlock", "pre")}
            title="Code Block"
            className={`toolbar-button ${
              activeFormats.has("pre") ? "active" : ""
            }`}
          >
            {Icons.code}
          </button>
          <button
            onClick={() => exec("inlineCode")}
            title="Inline Code"
            className={`toolbar-button ${
              activeFormats.has("code") ? "active" : ""
            }`}
          >
            {Icons.inlinecode}
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={createLink}
            title="Insert Link"
            className={`toolbar-button ${isLinkDialogOpen ? "active" : ""}`}
          >
            {Icons.link}
          </button>
          <button
            onClick={removeLink}
            title="Remove Link"
            className="toolbar-button"
          >
            {Icons.unlink}
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => setShowImageDialog(true)}
            title="Insert Image"
            className="toolbar-button"
          >
            {Icons.image}
          </button>
          <button
            onClick={handleShowIframeDialog}
            title="Insert Iframe"
            className="toolbar-button"
          >
            {Icons.video}
          </button>
        </div>

        <div className="toolbar-group table-operations">
          <button
            onClick={() => setShowTableDialog(true)}
            title="Insert Table"
            className="toolbar-button"
          >
            {Icons.table}
          </button>
          <button
            onClick={() => modifyTable("insertColumnLeft")}
            title="Insert Column Left"
            className="toolbar-button"
          >
            {Icons.insertLeft}
          </button>
          <button
            onClick={() => modifyTable("insertColumnRight")}
            title="Insert Column Right"
            className="toolbar-button"
          >
            {Icons.insertRight}
          </button>
          <button
            onClick={() => modifyTable("insertRowAbove")}
            title="Insert Row Above"
            className="toolbar-button"
          >
            {Icons.insertUp}
          </button>
          <button
            onClick={() => modifyTable("insertRowBelow")}
            title="Insert Row Below"
            className="toolbar-button"
          >
            {Icons.insertDown}
          </button>
          <button
            onClick={() => modifyTable("deleteColumn")}
            title="Delete Column"
            className="toolbar-button"
          >
            {Icons.columns}
          </button>
          <button
            onClick={() => modifyTable("deleteRow")}
            title="Delete Row"
            className="toolbar-button"
          >
            {Icons.rows}
          </button>
        </div>

        <div className="toolbar-group-last actions">
          <button
            onClick={toggleMode}
            title={isSourceMode ? "Visual Mode" : "Source Code"}
            className={`toolbar-button ${isSourceMode ? "active" : ""}`}
          >
            {Icons.source}
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="toolbar-button"
          >
            {isFullscreen ? Icons.minimize2 : Icons.maximize2}
          </button>
        </div>
      </div>
      <style>{`
        .toolbar-container {
        border-radius: 8px 8px 0 0;
        background-color: ${
          theme === "light" ? lightColorPanelBg : darkColorPanelBg
        };
        border: 1px solid ${
          theme === "light" ? lightBorderColor : darkBorderColor
        };
        border-bottom: none;
        padding: 2px;
        overflow-x: auto;
      }

      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
        background-color: transparent;
      }

      .toolbar-group {
        display: flex;
        gap: 4px;
        padding: 2px 3px;
        border-radius: 6px;
        background-color: ${
          theme === "light" ? lightColorPanelBg : darkColorPanelBg
        };
        border: 1px solid ${
          theme === "light" ? lightBorderColor : darkBorderColor
        };
      }

      .toolbar-group-last {
        display: flex;
        gap: 4px;
        padding: 2px 3px;
        margin-left: auto;
        border-radius: 6px;
        background-color: ${
          theme === "light" ? lightColorPanelBg : darkColorPanelBg
        };
        border: 1px solid ${
          theme === "light" ? lightBorderColor : darkBorderColor
        };
      }

      .toolbar-button {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: 1px solid transparent;
        border-radius: 6px;
        color: ${theme === "light" ? lightColorPanelText : darkColorPanelText};
        transition: background-color 0.2s, border-color 0.2s;
        cursor: pointer;
      }

      .toolbar-button:hover {
        background-color: rgba(100, 100, 100, 0.1);
        border-color: ${theme === "light" ? lightBorderColor : darkBorderColor};
      }

      .toolbar-button.active {
        background-color: ${theme === "light" ? "#e0e0e0" : "#444"};
        border-color: ${theme === "light" ? "#ccc" : "#666"};
      }

      .toolbar-button svg {
        width: 18px;
        height: 18px;
      }

      .format-select {
        padding: 6px 10px;
        font-size: 14px;
        border: 1px solid ${
          theme === "light" ? lightBorderColor : darkBorderColor
        };
        border-radius: 6px;
        background-color: ${
          theme === "light" ? lightColorPanelBg : darkColorPanelBg
        };
        color: ${theme === "light" ? lightColorPanelText : darkColorPanelText};
        min-width: 110px;
        cursor: pointer;
      }

      @media (max-width: 768px) {
        .toolbar-container {
          padding: 4px;
        }

        .toolbar-button {
          width: 32px;
          height: 32px;
        }

        .format-select {
          min-width: 100px;
          font-size: 13px;
        }
      }
`}</style>
    </div>
  );
};
