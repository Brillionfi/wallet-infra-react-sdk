export type TCustomStyles = {
  headerStyle?: React.CSSProperties;
  headerTextStyle?: React.CSSProperties;
  headerText?: string;
  closeStyle?: React.CSSProperties;
};

const header: React.CSSProperties = {
  backgroundColor: "#FCFCFC",
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  padding: "1rem",
};

const headerText: React.CSSProperties = {
  marginBottom: "1rem",
  fontSize: "2.25rem",
  fontWeight: "bold",
  color: "#fff",
}

const close: React.CSSProperties = {
  marginBottom: "1rem",
  fontSize: "2.25rem",
  fontWeight: "bold",
  color: "#fff",
}

export const defaultStyles = {
  header,
  headerText,
  close,
}