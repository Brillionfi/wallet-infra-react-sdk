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

export interface IMnemonicInputProps {
  phrase?: string[];
  type?: "copy" | "input";
  onChange?: (mnemonic: string[]) => void;
}

export interface IMnemonicModal extends IMnemonicInputProps {
  isVisible: boolean;
  onHide: () => void;
  onFinish: (mnemonic: string[]) => void;
  authenticatorName?: string;
  isLoading?: boolean;
}

interface IWalletAuthenticatorModal {
  isVisible: boolean;
  onClick: () => void;
  onHide: () => void;
}


export interface IApproveApproveWalletAuthenticatorModal
  extends IWalletAuthenticatorModal {
  authenticatorSelected: IWalletAuthenticatorOpt | null;
  onAuthenticatorChange: (authName: string) => void;
  isLoading?: boolean;
  disableButton?: boolean;
}
