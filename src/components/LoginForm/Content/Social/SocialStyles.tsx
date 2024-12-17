export type TCustomStyles = {
  socialButtonsContainerStyle?: React.CSSProperties;
  socialButtonStyle?: React.CSSProperties;
  socialButtonIconStyle?: React.CSSProperties;
};

const socialButtonsContainer: React.CSSProperties = {
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "1rem",
  marginBottom: "1rem",
  gap: '10px'
};

const socialButton: React.CSSProperties = {
  color: "#fefefe",
  border: "1px solid #A7B3CC",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "left",
  padding: "12px",
  cursor: "pointer"
};

const socialButtonIcon: React.CSSProperties = {
  width: '25px', 
  height: '25px'
};

export const defaultStyles = {
  socialButtonsContainer,
  socialButton,
  socialButtonIcon,
}