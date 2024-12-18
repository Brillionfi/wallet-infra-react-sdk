export type TCustomAssetsTableStyles = {
  containerStyle?: React.CSSProperties;
  assetsListStyle?: React.CSSProperties;
  assetStyle?: React.CSSProperties;
  assetLeftContainerStyle?: React.CSSProperties;
  assetNameStyle?: React.CSSProperties;
  assetAddressStyle?: React.CSSProperties;
  assetRightContainerStyle?: React.CSSProperties;
  assetMoneyStyle?: React.CSSProperties;
  assetBalanceStyle?: React.CSSProperties;
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

const assetsList: React.CSSProperties = {
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.5rem",
};

const asset: React.CSSProperties = {
  width: "100%",
  color: "#fefefe",
  background: "#292d27",
  border: "1px solid #292d27",
  padding: "1rem",
  fontSize: "1rem",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const assetLeftContainerStyle: React.CSSProperties = {
  display: "grid",
  textAlign: "start"
}
const assetNameStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.5rem"
}
const assetAddressStyle: React.CSSProperties = {}

const assetRightContainerStyle: React.CSSProperties = {
  display: "grid",
  textAlign: "end"
}
const assetMoneyStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.5rem",
}
const assetBalanceStyle: React.CSSProperties = {}

const errorContainer: React.CSSProperties = {
  marginTop: "1rem",
}

const errorText: React.CSSProperties = {  
  color: "red",
}

export const defaultAssetsTableStyles = {
  container,
  assetsList,
  asset,
  assetLeftContainerStyle,
  assetNameStyle,
  assetAddressStyle,
  assetRightContainerStyle,
  assetMoneyStyle,
  assetBalanceStyle,
  errorContainer,
  errorText,
}