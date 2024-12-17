import {TCustomStyles as TCustomSocialStyles} from '@/components/LoginForm/Content/Social/SocialStyles';
import {TCustomStyles as TCustomOtpStyles} from '@/components/LoginForm/Content/Otp/OtpStyles';
import {TCustomStyles as TCustomWalletStyles} from '@/components/LoginForm/Content/Wallet/WalletStyles';
import {defaultStyles as commonDefaultStyles, TCustomStyles as TCustomCommonStyles} from '@/components/LoginForm/Content/CommonStyles';

export type TCustomStyles = {
  contentContainerStyle?: React.CSSProperties;
} & TCustomCommonStyles & TCustomSocialStyles & TCustomOtpStyles & TCustomWalletStyles;

const contentContainer: React.CSSProperties = {
  display: "flex",
  width: "100%",
  flexDirection: "row",
  gap: "0.5rem",
  overflow: "hidden",
};

export const defaultStyles = {
  ...commonDefaultStyles,
  contentContainer,
}