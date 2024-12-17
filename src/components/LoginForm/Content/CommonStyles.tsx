export type TCustomStyles = {
  buttonStyle?: React.CSSProperties;
  buttonIconStyle?: React.CSSProperties;
  buttonTextStyle?: React.CSSProperties;
  inputContainerStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  inputNextStyle?: React.CSSProperties;
};

const button: React.CSSProperties = {
  width: "100%",
  border: "1px solid #0009321F",
  background: "#fff",
  padding: "0.5rem",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "left",
  gap: "8px",
};

const buttonIcon: React.CSSProperties = {
  width: '16px', 
  height: '16px'
};

const buttonText: React.CSSProperties = {
  color: "#1C2024",
}

const inputContainer: React.CSSProperties = {
  width: "100%",
  display: "flex",
  padding: "0.5rem",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "6px",
  border: "1px solid #0009321F",
};

const input: React.CSSProperties = {
  border: "none",
};

const inputNext: React.CSSProperties = {
  width: "10%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export const defaultStyles = {
  button,
  buttonIcon,
  buttonText,
  inputContainer,
  input,
  inputNext
}