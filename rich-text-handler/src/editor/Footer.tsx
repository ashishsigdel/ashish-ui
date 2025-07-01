type Props = {
  isFooterShow?: boolean;
  wordCount: number;
  charCount: number;
  theme?: "light" | "dark";
  lightColorPanelBg?: string;
  lightColorPanelText?: string;
  darkColorPanelBg?: string;
  darkColorPanelText?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
};

export default function Footer({
  isFooterShow = true,
  wordCount,
  charCount,
  theme,
  lightColorPanelBg,
  lightColorPanelText,
  darkColorPanelBg,
  darkColorPanelText,
  lightBorderColor,
  darkBorderColor,
}: Props) {
  if (!isFooterShow) return null;
  return (
    <>
      <div className="editor-footer">
        <div className="text">
          {wordCount} words • {charCount} characters
        </div>
        <div className="text">
          Made by{" "}
          <a
            href="https://ashishsigdel.com.np"
            style={{
              color:
                theme === "light" ? "rgb(14, 10, 150)" : "rgb(129, 125, 246)",
              textDecoration: "none",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ashish Sigdel
          </a>
        </div>
      </div>
      <style>{`
        .editor-footer {
          padding: 8px 16px;
          background-color: ${
            theme === "light" ? lightColorPanelBg : darkColorPanelBg
          };
          border-top: 1px solid ${
            theme === "light" ? lightBorderColor : darkBorderColor
          };
          color: ${
            theme === "light" ? lightColorPanelText : darkColorPanelText
          };
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          border-radius: 0 0 8px 8px;
        }
          .text {
          font-size: 12px;
          color: ${
            theme === "light" ? lightColorPanelText : darkColorPanelText
          };
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </>
  );
}
