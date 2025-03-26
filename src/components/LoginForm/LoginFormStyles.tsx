import { TCustomClassNames as TCustomContentClassNames } from '@/components/LoginForm/Content/ContentStyles';
import { TCustomClassNames as TCustomHeaderClassNames } from '@/components/LoginForm/Header/HeaderStyles';
import { TCustomClassNames as TCustomFooterClassNames } from '@/components/LoginForm/Footer/FooterStyles';

export type TConfig = {
  showClose?: boolean;
  footerText?: string;
  customClassNames: TCustomClassNames;
}

export type TCustomClassNames = {
  mainContainer?: string;
  errorContainer?: string;
  errorText?: string;
} & TCustomFooterClassNames & TCustomHeaderClassNames & TCustomContentClassNames;
