export type TCustomStyles = {
  footerStyle?: React.CSSProperties;
  footerTextStyle?: React.CSSProperties;
  footerText?: string;
};

const footer: React.CSSProperties = {
  backgroundColor: "#FCFCFC",
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  padding: "1rem",
};

const footerText: React.CSSProperties = {
  marginBottom: "1rem",
  fontSize: "2.25rem",
  fontWeight: "bold",
  color: "#fff",
}

export const defaultStyles = {
  footer,
  footerText,
}