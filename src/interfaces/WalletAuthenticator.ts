import { WALLET_AUTHENTICATOR_TYPE } from "@/constants";

export interface IWalletAuthenticatorOpt {
  icon: JSX.Element;
  name: string;
  type: WALLET_AUTHENTICATOR_TYPE;
  authenticatorId?: string;
  authenticatorName?: string;
  credentialId?: string;
  disabled?: boolean;
  createdAt?: number;
}

export interface IWalletAuthenticatorProvider {
  userWalletAuthenticators: IWalletAuthenticatorOpt[];
  getWalletAuthenticator: () => Promise<IWalletAuthenticatorOpt | undefined>;
  openMnemonicModal: (
    type?: "copy" | "input",
    authenticatorName?: string,
  ) => Promise<string | undefined>;
};