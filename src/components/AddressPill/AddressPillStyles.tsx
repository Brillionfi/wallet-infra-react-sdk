export type TCustomAddressPillStyles = {
  containerStyle?: React.CSSProperties;
  textContainerStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
};

const container: React.CSSProperties = {
  backgroundColor: "#444444",
  padding: "1rem",
};

const textContainer: React.CSSProperties = {
  width: "fit-content",
  display: "inline-flex",
  alignItems: "center",
  gap: "1rem",
  borderWidth: "1px",
  height: "2.5rem",
  padding: "0.5rem",
  paddingLeft: "1rem",
  borderRadius: "0.375rem",
  backgroundColor: "#292d27",
  cursor: "pointer",
};

const text: React.CSSProperties = {
  color: "white",
};

const icon: React.CSSProperties = {
};

export const defaultAddressPillStyles = {
  container,
  textContainer,
  text,
  icon
}