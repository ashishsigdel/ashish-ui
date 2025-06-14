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
          Built with{" "}
          <svg
            stroke="none"
            fill="red"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="16px"
            width="16px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
          </svg>{" "}
          by{" "}
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
