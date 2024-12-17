export type TCustomStyles = {
  headerStyle?: React.CSSProperties;
  headerTextStyle?: React.CSSProperties;
  headerText?: string;
  closeStyle?: React.CSSProperties;
};

const header: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

const headerText: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "#000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.8rem",
}

const close: React.CSSProperties = {
  color: "#000",
}

export const defaultStyles = {
  header,
  headerText,
  close,
}