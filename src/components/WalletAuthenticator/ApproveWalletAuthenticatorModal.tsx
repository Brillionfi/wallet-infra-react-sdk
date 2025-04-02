import { CenterModal } from "@/components";
import { IApproveApproveWalletAuthenticatorModal, IWalletAuthenticatorOpt } from "@/interfaces";

import { useWalletAuthenticatorOptions } from "../../hooks";
import { RadioButton } from "../Input";

export const ApproveWalletAuthenticatorModal = ({
  isVisible,
  authenticatorSelected,
  disableButton = false,
  isLoading = false,
  onAuthenticatorChange,
  onClick,
  onHide,
}: IApproveApproveWalletAuthenticatorModal) => {
  const { userWalletAuthenticators } = useWalletAuthenticatorOptions();

  return (
    <CenterModal
      showButton
      isVisible={isVisible}
      onHide={onHide}
      headerLabel="Wallet Authenticators"
      buttonLabel="Approve"
      isLoadingButton={isLoading}
      disableButton={disableButton}
      onClick={onClick}
      contentStyle={{ minHeight: 200 }}
    >
      <div className="approve-wallet-authenticator-container">
        <p>Please select a wallet authenticator to sign the transaction</p>
        {userWalletAuthenticators.map((auth) => {
          const authId = auth.authenticatorName?.replace(" ", "");
          return (
            <div
              key={`auth-${authId}`}
              className="approve-wallet-authenticator-item"
            >
              <RadioButton
                inputId={authId}
                name="authentication"
                value={auth}
                onChange={(e) =>
                  onAuthenticatorChange(e.target.value as IWalletAuthenticatorOpt)
                }
                checked={
                  authenticatorSelected?.authenticatorName ===
                  auth.authenticatorName
                }
                disabled={auth.disabled || isLoading}
              />
              <label
                htmlFor={authId}
                className="approve-wallet-authenticator-label"
              >
                <span className="approve-wallet-authenticator-name">
                  {auth.icon}
                  {auth.authenticatorName}
                </span>
                <span>{auth.name}</span>
              </label>
            </div>
          );
        })}
      </div>
    </CenterModal>
  );
};
