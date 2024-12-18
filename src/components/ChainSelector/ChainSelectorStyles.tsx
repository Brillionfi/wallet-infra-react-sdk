export type TCustomChainSelectorStyles = {
  containerStyle?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  dropdownContainerStyle?: React.CSSProperties;
  dropdownListStyle?: React.CSSProperties;
  dropdownOptionStyle?: React.CSSProperties;
  dropdownIconsStyle?: React.CSSProperties;
  errorContainerStyle?: React.CSSProperties;
  errorTextStyle?: React.CSSProperties;
};

const container: React.CSSProperties = {
  backgroundColor: "#444444",
  padding: "1rem",
};

const dropdown: React.CSSProperties = {
  width: "10rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "1rem",
  borderWidth: "1px",
  borderColor: "#e4e4e7",
  height: "2.5rem",
  padding: "0.5rem",
  paddingLeft: "1rem",
  fontSize: "1rem",
  lineHeight: "2rem",
  borderRadius: "0.375rem",
  backgroundColor: "#292d27",
  color: "white",
}

const dropdownIcons: React.CSSProperties = {
  width: '20px', 
  height: '20px'
}

const dropdownContainer: React.CSSProperties = {
  position: "absolute",
  // marginTop: "2.5rem",
  zIndex: 2
}

const dropdownList: React.CSSProperties = {
  width: "10rem",
  height: "auto",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  borderRadius: "0.375rem",
  borderWidth: "1px",
  backgroundColor: "#444444",
};

const dropdownOption: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "0.5rem",
  paddingLeft: "1rem",
  fontSize: "1rem",
  lineHeight: "2rem",
  borderRadius: "0.375rem",
  color: "white",
  cursor: "pointer",
  backgroundColor: "#292d27",
}

const errorContainer: React.CSSProperties = {
  marginTop: "1rem",
}

const errorText: React.CSSProperties = {  
  color: "red",
}

export const defaultChainSelectorStyles = {
  container,
  dropdown,
  dropdownContainer,
  dropdownList,
  dropdownOption,
  dropdownIcons,
  errorContainer,
  errorText,
}