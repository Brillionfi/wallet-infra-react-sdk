import { AuthProvider } from "@brillionfi/wallet-infra-sdk";

export type TLoginOption = {
  label: LoginMethods;
  icon?: JSX.Element;
  onClick?: (loginAs?: string) => void;
};

export interface ILoginOptions {
  loginOptions: TLoginOption[];
}

export enum LoginMethods {
  Google = AuthProvider.GOOGLE,
  Twitter = AuthProvider.TWITTER,
  Discord = AuthProvider.DISCORD,
  Metamask = AuthProvider.METAMASK,
  WalletConnect = AuthProvider.WALLET_CONNECT,
  Email = AuthProvider.EMAIL,
}
