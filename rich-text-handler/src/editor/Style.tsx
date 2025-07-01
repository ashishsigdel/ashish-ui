interface StyleProps {
  theme: string;
  lightBorderColor: string;
  darkBorderColor: string;
  lightColorPanelBg: string;
  darkColorPanelBg: string;
  lightColorPanelText: string;
  darkColorPanelText: string;
  lightEditorBgColor: string;
  darkEditorBgColor: string;
  showFooter: boolean;
}
export default function Style({
  theme,
  lightBorderColor,
  darkBorderColor,
  lightColorPanelBg,
  darkColorPanelBg,
  lightColorPanelText,
  darkColorPanelText,
  lightEditorBgColor,
  darkEditorBgColor,
  showFooter,
}: StyleProps) {
  return (
    <style>{`.editor-container {
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
          list-style: initial;
        }

        .editor-content ul {
            list-style-type: disc;
        }
        .editor-content ol {
            list-style-type: decimal;
        }
        .editor-content li {
            margin-bottom: 0.25em;
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
        }`}</style>
  );
}
