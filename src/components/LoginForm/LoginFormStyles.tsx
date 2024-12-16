import {TCustomStyles as TCustomContentStyles} from '@/components/LoginForm/Content/ContentStyles';
import {TCustomStyles as TCustomHeaderStyles} from '@/components/LoginForm/Header/HeaderStyles';
import {TCustomStyles as TCustomFooterStyles} from '@/components/LoginForm/Footer/FooterStyles';

export type TCustomStyles = {
  containerStyle?: React.CSSProperties;
  errorContainerStyle?: React.CSSProperties;
  errorTextStyle?: React.CSSProperties;
} & TCustomFooterStyles & TCustomHeaderStyles & TCustomContentStyles;

const container: React.CSSProperties = {
  backgroundColor: "#FCFCFC",
  borderRadius: "16px",
  border: "1px solid #E8E8E8",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: "2rem",
  width: "314px",
  minHeight: "436px",
};

const errorContainer: React.CSSProperties = {
  marginTop: "1rem",
}

const errorStyle: React.CSSProperties = {  
  color: "red",
}

export const defaultStyles = {
  container,
  errorContainer,
  errorStyle,
}