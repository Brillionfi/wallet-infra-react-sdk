import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WALLET_AUTHENTICATOR_TYPE } from "@/constants";
// import {
//   ApproveWalletAuthenticatorModal,
//   MnemonicModal,
//   useWalletAuthenticatorOptions,
// } from "@/features/walletAuthenticator";
import type {
  IWalletAuthenticatorOpt,
  IWalletAuthenticatorProvider
} from "@/interfaces";
import { ethers } from "ethers";

import { ApproveWalletAuthenticatorModal, MnemonicModal, useBrillionContext } from "@/components";
import { useWalletAuthenticatorOptions } from "@/hooks";

/* Default Values */
const defaultValues: IWalletAuthenticatorProvider = {
  userWalletAuthenticators: [],
  getWalletAuthenticator: () => Promise.resolve(undefined),
  openMnemonicModal: () => Promise.resolve(undefined),
};

/* Context */
export const WalletAuthenticatorContext =
  React.createContext<IWalletAuthenticatorProvider>(defaultValues);

export const useWalletAuthenticator = () =>
  useContext(WalletAuthenticatorContext);

/* Provider */
export const WalletAuthenticatorProvider = ({
  children,
}: { children: ReactNode }) => {
  const [walletAuthenticator, setWalletAuthenticator] =
    useState<IWalletAuthenticatorOpt | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const [isMnemonicModalOpen, setIsMnemonicModalOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authenticatorName, setAuthenticatorName] = useState<string>("");
  const [resolveApprovePromise, setResolveApprovePromise] = useState<
    ((value: IWalletAuthenticatorOpt | null) => void) | null
  >(null);
  const [resolveMnemonicPromise, setResolveMnemonicPromise] = useState<
    ((value: string | null) => void) | null
  >(null);
  const [mnemonicType, setMnemonicType] = useState<"copy" | "input">("input");
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string[]>();
  const { isReady, sdk } = useBrillionContext();
  const { userWalletAuthenticators } = useWalletAuthenticatorOptions();

  const canApprove = useMemo(
    () => !!walletAuthenticator && !!sdk,
    [walletAuthenticator, sdk],
  );

  useEffect(() => {
    if (!isReady || !sdk) onApproveCancel();
  }, [isReady, sdk]);

  const getWalletAuthenticator = useCallback(async () => {
    resetData();
    setIsApproveModalOpen(true);

    try {
      const authenticator = await new Promise<IWalletAuthenticatorOpt>(
        (resolve) => {
          setResolveApprovePromise(() => resolve);
        },
      );

      return authenticator;
    } catch (error) {
      console.error("Error getting authenticator: ", error);
    } finally {
      onApproveCancel();
    }
  }, [walletAuthenticator, sdk]);

  const handleWalletAthenticator = (walletAuth: IWalletAuthenticatorOpt) => {
    setWalletAuthenticator(walletAuth);
  };

  const resetData = () => {
    setAuthenticatorName("");
    setWalletAuthenticator(null);
    setMnemonicPhrase(undefined);
  };

  const onApprove = async () => {
    setIsLoading(true);
    if (!walletAuthenticator) return;

    let authenticator = walletAuthenticator;
    if (walletAuthenticator.type === WALLET_AUTHENTICATOR_TYPE.MNEMONIC) {
      const mnemonic = await openMnemonicModal(
        "input",
        authenticator.authenticatorName,
      );
      authenticator = { ...authenticator, credentialId: mnemonic };
    }
    if (resolveApprovePromise) resolveApprovePromise(authenticator);
  };

  const onApproveCancel = () => {
    if (resolveApprovePromise) resolveApprovePromise(null);
    if (resolveMnemonicPromise) resolveMnemonicPromise(null);
    setIsLoading(false);
    setIsApproveModalOpen(false);
    setIsMnemonicModalOpen(false);
    resetData();
  };

  const onHideMnemonicModal = () => {
    setIsMnemonicModalOpen(false);
    setIsLoading(false);
    resetData();
    if (mnemonicType === "copy" && resolveMnemonicPromise)
      resolveMnemonicPromise(null);
  };

  const openMnemonicModal = async (
    type: "copy" | "input" = "input",
    authName?: string,
  ) => {
    let wallet;
    setAuthenticatorName(authName || "");

    if (type === "copy") {
      wallet = ethers.Wallet.createRandom();
      if (!wallet.mnemonic?.phrase)
        throw new Error("Mnemonic phrase not found");
      setMnemonicPhrase(wallet.mnemonic?.phrase?.split(" "));
    }

    setMnemonicType(type);
    setIsMnemonicModalOpen(true);

    const mnemonic = await new Promise<string | null>((resolve) => {
      setResolveMnemonicPromise(() => resolve);
    });

    if (!mnemonic) throw new Error("Invalid Mnemonic");

    return type === "input"
      ? mnemonic
      : wallet?.publicKey.replace("0x", "") || "";
  };

  const onFinishMnemonicFlow = (mnemonic: string[]) => {
    setIsMnemonicModalOpen(false);
    if (resolveMnemonicPromise) {
      resolveMnemonicPromise(mnemonic.join(" "));
    }
  };

  return (
    <WalletAuthenticatorContext.Provider
      value={{
        ...defaultValues,
        userWalletAuthenticators,
        getWalletAuthenticator,
        openMnemonicModal,
      }}
    >
      <MnemonicModal
        authenticatorName={authenticatorName}
        isVisible={isMnemonicModalOpen}
        phrase={mnemonicPhrase}
        onFinish={onFinishMnemonicFlow}
        onHide={onHideMnemonicModal}
        type={mnemonicType}
      />
      <ApproveWalletAuthenticatorModal
        onAuthenticatorChange={handleWalletAthenticator}
        onClick={onApprove}
        onHide={onApproveCancel}
        isVisible={isApproveModalOpen}
        authenticatorSelected={walletAuthenticator}
        disableButton={!canApprove}
        isLoading={isLoading}
      />
      {children}
    </WalletAuthenticatorContext.Provider>
  );
};
