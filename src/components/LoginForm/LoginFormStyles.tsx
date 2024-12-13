export type TCustomProps = {
  buttonStyle?: React.CSSProperties;
  buttonTextStyle?: React.CSSProperties;
  buttonIconStyle?: React.CSSProperties;
  buttonsContainerStyle?: React.CSSProperties;
  buttonText?: string;
  containerStyle?: React.CSSProperties;
  tittleStyle?: React.CSSProperties;
  tittleText?: string;
  errorContainerStyle?: React.CSSProperties;
  errorTextStyle?: React.CSSProperties;
};

const container: React.CSSProperties = {
  backgroundColor: "#444444",
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  padding: "1rem",
};

const buttonsContainer: React.CSSProperties = {
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.5rem",
};

const button: React.CSSProperties = {
  width: "100%",
  color: "#fefefe",
  background: "#292d27",
  border: "1px solid #292d27",
  padding: "1rem 1.5rem",
  fontSize: "1rem",
  transition: "background-color .2s, color .2s, border-color .2s, box-shadow .2s",
  borderRadius: "6px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "left",
  gap: "7px",
};

const buttonIconStyle: React.CSSProperties = {
  width: '20px', 
  height: '20px'
};

const buttonTextStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontWeight: "bold",
  lineHeight: "16.44px",
  color: "#fff",
};

const tittle: React.CSSProperties = {
  marginBottom: "1rem",
  fontSize: "2.25rem",
  fontWeight: "bold",
  color: "#fff",
}

const errorContainer: React.CSSProperties = {
  marginTop: "1rem",
}

const errorStyle: React.CSSProperties = {  
  color: "red",
}

export const defaultStyles = {
  container,
  buttonsContainer,
  button,
  buttonIconStyle,
  buttonTextStyle,
  tittle,
  errorContainer,
  errorStyle,
}