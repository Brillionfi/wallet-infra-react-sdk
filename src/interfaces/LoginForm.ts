import { AuthProvider } from "@brillionfi/wallet-infra-sdk";

export type TLoginOptions = {
  label: LoginMethods;
  icon?: JSX.Element;
  disabled?: boolean;
  onClick?: () => void;
  html?: JSX.Element;
}[];

export interface ILoginOptions {
  loginOptions: TLoginOptions;
}

export enum LoginMethods {
  Google = AuthProvider.GOOGLE,
  Twitter = AuthProvider.TWITTER,
  Discord = AuthProvider.DISCORD,
  Metamask = AuthProvider.METAMASK,
  WalletConnect = AuthProvider.WALLET_CONNECT,
  Email = AuthProvider.EMAIL
}
