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
  Google = "Google",
  Twitter = "Twitter",
  Discord = "Discord",
  WalletConnect = "WalletConnect",
  Metamask = "Metamask",
  Email = "Email",
}
