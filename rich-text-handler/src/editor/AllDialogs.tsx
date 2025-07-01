import { useRef, useState } from "react";
import { Icons } from "./exportIcons";

interface TableDialogProps {
  onInsert: (rows: number, cols: number, includeHeader: boolean) => void;
  onClose: () => void;
}

export const TableDialog = ({ onInsert, onClose }: TableDialogProps) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [hoveredCells, setHoveredCells] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const renderTablePreview = () => (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          {includeHeader && (
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <th
                    key={colIndex}
                    style={{
                      border: "1px solid #d1d5db",
                      padding: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      width: "40px",
                      height: "20px",
                    }}
                  >
                    H{colIndex + 1}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: cols }).map((_, colIndex) => {
                  const isHovered =
                    hoveredCells &&
                    rowIndex < hoveredCells.row &&
                    colIndex < hoveredCells.col;

                  return (
                    <td
                      key={colIndex}
                      style={{
                        border: "1px solid #d1d5db",
                        padding: "8px",
                        fontSize: "12px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        backgroundColor: isHovered ? "#dbeafe" : "#ffffff",
                        width: "40px",
                        height: "20px",
                      }}
                      onMouseEnter={() =>
                        setHoveredCells({
                          row: rowIndex + 1,
                          col: colIndex + 1,
                        })
                      }
                      onMouseOver={(e) => {
                        if (!isHovered) {
                          e.currentTarget.style.backgroundColor = "#f9fafb";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isHovered) {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                        }
                      }}
                      onClick={() => {
                        setRows(rowIndex + 1);
                        setCols(colIndex + 1);
                      }}
                    >
                      {rowIndex + 1},{colIndex + 1}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#6b7280",
          marginTop: "8px",
        }}
      >
        {includeHeader ? `${rows} × ${cols} (+ header)` : `${rows} × ${cols}`}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title">
          {Icons.table}
          Insert Table
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px",
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
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                outline: "none",
                fontSize: "14px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "4px",
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
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                outline: "none",
                fontSize: "14px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={includeHeader}
              onChange={(e) => setIncludeHeader(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Include header row
            </span>
          </label>
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
            className="btn-secondary"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#e2e8f0";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onInsert(rows, cols, includeHeader)}
            className="btn-primary"
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#3b82f6";
            }}
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableDialog;

interface ImageUploadDialogProps {
  onInsert: (imageUrl: string) => void;
  onClose: () => void;
  imageUploadAPIUrl?: string;
}

export const ImageUploadDialog = ({
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

export const IframeDialog = ({ onInsert, onClose }: IframeDialogProps) => {
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

export const PasteDialog = ({
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
