
export type TCustomStyles = {
  walletButtonsContainerStyle?: React.CSSProperties;
  walletButtonStyle?: React.CSSProperties;
  walletButtonIconStyle?: React.CSSProperties;
  walletButtonTextStyle?: React.CSSProperties;
};

const walletButtonsContainer: React.CSSProperties = {
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "16px",
};

const walletButton: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "left",
  height: "48px",
  gap: "11px",
};

const walletButtonIcon: React.CSSProperties = {
  height: "48px",
  width: "48px",
  borderRadius: "8px"
};

const walletButtonText: React.CSSProperties = {
  color: "#1C2024",
};

export const defaultStyles = {
  walletButtonsContainer,
  walletButton,
  walletButtonIcon,
  walletButtonText
}