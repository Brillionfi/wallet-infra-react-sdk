import {
  Address,
  ChainId,
  ICreateWalletAuthenticatorResponse,
  IExecRecovery,
  ITransaction,
  IWallet,
  IWalletAuthenticator,
  IWalletAuthenticatorResponse,
  IWalletGasConfiguration,
  IWalletGasConfigurationAPI,
  IWalletGasEstimation,
  IWalletRecovery,
  IWalletSignTransaction,
  IWalletSignTransactionResponse,
  TNotifications,
} from "@brillionfi/wallet-infra-sdk/dist/models";
import { useQuery } from "@tanstack/react-query";
import { useBrillionContext } from "components/BrillionContext";

export const useWallet = () => {
  const { sdk, changeWallet } = useBrillionContext();

  const createWallet = async (data: IWallet): Promise<IWallet | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    const wallet = await sdk.Wallet.createWallet(data);
    if (wallet) changeWallet(wallet.address ?? "");

    return wallet;
  };

  const createWalletAuthnticator = async (authenticator: IWalletAuthenticator): Promise<ICreateWalletAuthenticatorResponse | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }

    return await sdk.Wallet.createWalletAuthenticator(authenticator);
  };

  const getWalletAuthnticator = async (): Promise<IWalletAuthenticatorResponse | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }

    return await sdk.Wallet.getWalletAuthenticator();
  };

  const wallets = useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      if (!sdk) {
        throw new Error("AppId is not valid");
      }
      return (await sdk.Wallet.getWallets()) as IWallet[];
    },
  });

  const signTransaction = async (
    address: Address,
    data: IWalletSignTransaction,
    fromOrigin: string,
  ): Promise<IWalletSignTransactionResponse | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.signTransaction(address, data, fromOrigin);
  };

  const approveSignTransaction = async (
    address: Address,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
  ): Promise<IWalletSignTransactionResponse | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.approveTransaction(
      address,
      organizationId,
      fingerprint,
      fromOrigin,
    );
  };

  const rejectSignTransaction = async (
    address: Address,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
  ): Promise<IWalletSignTransactionResponse | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.rejectTransaction(
      address,
      organizationId,
      fingerprint,
      fromOrigin,
    );
  };

  const getTransactionHistory = async (
    address: Address,
    chainId: ChainId,
    page = 0,
    indexer?: "internal" | "external",
  ): Promise<
    { transactions: Partial<ITransaction>[]; currentPage: number } | undefined
  > => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.getTransactionHistory(
      address,
      chainId,
      page,
      indexer,
    );
  };

  const getGasConfig = async (
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletGasConfiguration | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.getGasConfig(address, chainId);
  };

  const setGasConfig = async (
    address: Address,
    chainId: ChainId,
    configuration: IWalletGasConfiguration,
  ): Promise<IWalletGasConfigurationAPI | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.setGasConfig(address, chainId, configuration);
  };

  const getGasFees = async (
    chainId: ChainId,
    from: Address,
    to: Address,
    value: string,
    data: string,
  ): Promise<IWalletGasEstimation | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.getGasFees(chainId, from, to, value, data);
  };

  const getNonce = async (
    address: Address,
    chainId: ChainId,
  ): Promise<number | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.getNonce(address, chainId);
  };

  const initRecovery = async (
    address: Address,
  ): Promise<IWalletRecovery | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.initRecovery(address);
  };

  const execRecovery = async (
    organizationId: string,
    userId: string,
    passkeyName: string,
    bundle: string,
    fromOrigin: string,
  ): Promise<IExecRecovery | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.execRecovery(
      organizationId,
      userId,
      passkeyName,
      bundle,
      fromOrigin,
    );
  };

  const getNotifications = async (
    address: Address,
    chainId: ChainId,
  ): Promise<TNotifications> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Notifications.getNotifications(address, chainId);
  };

  return {
    wallets,
    createWallet,
    signTransaction,
    getTransactionHistory,
    getGasConfig,
    setGasConfig,
    getGasFees,
    getNonce,
    initRecovery,
    execRecovery,
    approveSignTransaction,
    rejectSignTransaction,
    getNotifications,
    getWalletAuthnticator,
    createWalletAuthnticator
  };
};
