import { generateColorScale } from "./colorUtils";

export const getStyles = (
  primaryColor: string,
  isDark: boolean = false,
  noMarginInParagraphs: boolean = false
): {
  [key: string]: React.CSSProperties;
} => {
  const colors = generateColorScale(primaryColor);

  return {
    codeBlock: {
      position: "relative",
    },
    codeHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.5rem 1rem",
      backgroundColor: isDark ? colors[900] : colors[100],
      borderBottom: "1px solid",
      borderColor: isDark ? colors[800] : colors[200],
      borderTopLeftRadius: "0.5rem",
      borderTopRightRadius: "0.5rem",
    },
    languageLabel: {
      fontSize: "0.875rem",
      color: isDark ? colors[300] : colors[700],
      fontFamily: "monospace",
    },
    copyButton: {
      transitionProperty: "opacity",
      transitionDuration: "200ms",
      padding: "0.25rem 0.75rem",
      borderRadius: "0.25rem",
      cursor: "pointer",
      backgroundColor: isDark ? colors[800] : colors[200],
      color: isDark ? colors[100] : colors[900],
    },

    copyText: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.875rem",
    },
    inlineCode: {
      padding: "0.25rem 0.5rem",
      backgroundColor: isDark ? colors[800] : colors[200],
      color: isDark ? colors[100] : colors[900],
      borderRadius: "0.25rem",
      fontSize: "0.875rem",
      fontFamily: "monospace",
    },

    tableContainer: {
      overflowX: "auto",
      margin: "1rem 0",
    },
    table: {
      minWidth: "100%",
      border: `1px solid ${isDark ? colors[800] : colors[200]}`,
      borderRadius: "0.5rem",
      overflow: "hidden",
    },

    tableHeaderRow: {
      padding: "0.5rem 1rem",
      backgroundColor: isDark ? colors[900] : colors[100],
      borderBottom: "1px solid",
      borderColor: isDark ? colors[800] : colors[200],
      borderTopLeftRadius: "0.5rem",
      borderTopRightRadius: "0.5rem",
    },

    tableHeaderCell: {
      padding: "0.5rem 1rem",
      textAlign: "left",
      fontWeight: 600,
      color: isDark ? colors[200] : colors[800],
    },

    tableRow: {
      padding: "0.5rem 1rem",
      borderBottom: "1px solid",
      borderColor: isDark ? colors[800] : colors[200],
    },

    tableCell: {
      padding: "0.5rem 1rem",
      textAlign: "left",
      fontWeight: 500,
      color: isDark ? colors[200] : colors[800],
    },

    blockquote: {
      borderLeft: "4px solid #3b82f6",
      paddingLeft: "1rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      margin: "1rem 0",
      backgroundColor: isDark ? colors[800] : colors[100],
      color: isDark ? colors[100] : colors[900],
      fontStyle: "italic",
    },

    alert: {
      borderLeftWidth: "4px",
      borderLeftStyle: "solid",
      padding: "1rem",
      margin: "1rem 0",
      borderTopRightRadius: "0.5rem",
      borderBottomRightRadius: "0.5rem",
    },
    alertInfo: {
      borderLeftColor: "#2f67ff",
      backgroundColor: isDark ? "#b3d8ff" : "#d5ebff",
      color: isDark ? "#0a195c" : "#0a195c",
    },

    alertWarning: {
      borderLeftColor: "#ff2323",
      backgroundColor: isDark ? "#ff9494" : "#ffc0c0",
      color: isDark ? "#500000" : "#920a0a",
    },

    alertError: {
      borderLeftColor: "#fecaca",
      backgroundColor: "#fef2f2",
      color: "#991b1b",
    },

    alertSuccess: {
      borderLeftColor: "#bbf7d0",
      backgroundColor: "#f0fdf4",
      color: "#166534",
    },

    heading: {
      color: isDark ? "#ffffff" : "#111827",
      marginBottom: "1rem",
      marginTop: "1.5rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid",
      borderColor: isDark ? colors[600] : colors[400],
      fontWeight: 700,
    },

    h1: {
      fontSize: "1.875rem",
      lineHeight: "2.25rem",
    },
    h2: {
      fontSize: "1.5rem",
      lineHeight: "2rem",
    },
    h3: {
      fontSize: "1.25rem",
      lineHeight: "1.75rem",
    },
    h4: {
      fontSize: "1.125rem",
      lineHeight: "1.75rem",
    },
    h5: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
    },
    h6: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
    },
    paragraph: {
      marginBottom: noMarginInParagraphs ? 0 : "1rem",
      lineHeight: 1.75,
      color: isDark ? "#d1d5db" : "#374151",
    },

    horizontalRule: {
      margin: "1.5rem 0",
      borderTop: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
      borderTopWidth: "1px",
      borderTopStyle: "solid",
    },

    orderedList: {
      listStyleType: "decimal",
      listStylePosition: "inside",
      margin: "1rem 0",
      paddingLeft: "1rem",
    },
    unorderedList: {
      listStyleType: "disc",
      listStylePosition: "inside",
      margin: "1rem 0",
      paddingLeft: "1rem",
    },
    listItem: {
      margin: "0.25rem 0",
      lineHeight: 1.75,
      color: isDark ? "#d1d5db" : "#374151",
    },
    link: {
      color: "#0c3fff",
      textDecoration: "none",
    },
    linkHover: {
      textDecoration: "underline",
      color: "#2f6eff",
    },
    image: {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "8px",
      margin: "0.5em 0",
    },

    container: {
      maxWidth: "none",
    },
  };
};
