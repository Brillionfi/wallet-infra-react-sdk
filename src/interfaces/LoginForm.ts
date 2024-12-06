export enum ICON_LIST {
  "apple-logo",
  "discord-logo",
  "email-logo",
  "ethereum",
  "google-logo",
  "logo",
  "polygon",
  "brillion-dark-logo",
  "brillion-dark-logo-circle",
  "twitter-logo",
  "vanar",
  "wallet-connect",
  "zilliqa",
  "telos",
  "base",
}

export type TLocalIcons = keyof typeof ICON_LIST;

type TLoginOptions = {
  label: LoginMethods;
  icon: TLocalIcons;
  disabled: boolean;
  onClick: () => void;
}[];

export interface ILoginOptions {
  loginOptions: TLoginOptions;
}

export enum LoginMethods {
  Google = "Google",
  Twitter = "Twitter",
  Discord = "Discord",
}
