import {defaultStyles as defaultCommonStyles, TCustomStyles as TCustomCommonStyles} from '@/components/LoginForm/Content/CommonStyles';

export type TCustomStyles = {
  otpButtonsContainerStyle?: React.CSSProperties;
  otpButtonStyle?: React.CSSProperties;
  otpButtonIconStyle?: React.CSSProperties;
}& TCustomCommonStyles;

const otpButtonsContainer: React.CSSProperties = {
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.5rem",
};

const otpButton: React.CSSProperties = {
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
  cursor: "pointer"
};

const otpButtonIcon: React.CSSProperties = {
  width: '20px', 
  height: '20px'
};

export const defaultStyles = {
  ...defaultCommonStyles,
  otpButtonsContainer,
  otpButton,
  otpButtonIcon,
}