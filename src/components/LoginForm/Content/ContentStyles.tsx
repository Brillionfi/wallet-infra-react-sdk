import {TCustomStyles as TCustomSocialStyles} from '@/components/LoginForm/Content/Social/SocialStyles';
import {TCustomStyles as TCustomOtpStyles} from '@/components/LoginForm/Content/Otp/OtpStyles';
import {TCustomStyles as TCustomWalletStyles} from '@/components/LoginForm/Content/Wallet/WalletStyles';
import {TCustomStyles as TCustomCommonStyles} from '@/components/LoginForm/Content/CommonStyles';

export type TCustomStyles = {
  contentContainerStyle?: React.CSSProperties;
} & TCustomCommonStyles & TCustomSocialStyles & TCustomOtpStyles & TCustomWalletStyles;

const contentContainer: React.CSSProperties = {
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.5rem",
};

export const defaultStyles = {
  contentContainer,
}