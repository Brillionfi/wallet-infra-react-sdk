import {defaultStyles as defaultCommonStyles, TCustomStyles as TCustomCommonStyles} from '@/components/LoginForm/Content/CommonStyles';

export type TCustomStyles = {
  otpButtonsContainerStyle?: React.CSSProperties;
}& TCustomCommonStyles;

const otpButtonsContainer: React.CSSProperties = {
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "16px",
};

export const defaultStyles = {
  ...defaultCommonStyles,
  otpButtonsContainer,
}