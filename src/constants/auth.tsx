import AuthKeyLogo from "@/components/icons/auth-key";
import AuthMnemonicLogo from "@/components/icons/auth-mnemonic";

export const enum WALLET_AUTHENTICATOR_TYPE {
  PASSKEY = "passkey",
  MNEMONIC = "mnemonic",
}

export const walletAuthenticatorIcon: Record<
  WALLET_AUTHENTICATOR_TYPE,
  JSX.Element
> = {
  [WALLET_AUTHENTICATOR_TYPE.PASSKEY]: <AuthKeyLogo/>,
  [WALLET_AUTHENTICATOR_TYPE.MNEMONIC]: <AuthMnemonicLogo/>,
};