import {TCustomClassNames as TCustomSocialClassNames} from '@/components/LoginForm/Content/Social/SocialStyles';
import {TCustomClassNames as TCustomOtpClassNames} from '@/components/LoginForm/Content/Otp/OtpStyles';
import {TCustomClassNames as TCustomWalletClassNames} from '@/components/LoginForm/Content/Wallet/WalletStyles';
import {TCustomClassNames as TCustomCommonClassNames} from '@/components/LoginForm/Content/CommonStyles';

export type TCustomClassNames = {
  contentContainer?: string;
} & TCustomCommonClassNames & TCustomSocialClassNames & TCustomOtpClassNames & TCustomWalletClassNames;
