export type TCustomStyles = {
  footerStyle?: React.CSSProperties;
  footerTextStyle?: React.CSSProperties;
  footerText?: string;
};

const footer: React.CSSProperties = {
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "auto",
};

const footerText: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#838383",
}

export const defaultStyles = {
  footer,
  footerText,
}