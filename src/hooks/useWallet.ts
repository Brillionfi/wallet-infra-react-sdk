import {
  Address,
  ChainId,
  IExecRecovery,
  ITransaction,
  IWallet,
  IWalletGasConfiguration,
  IWalletGasConfigurationAPI,
  IWalletGasEstimation,
  IWalletNotifications,
  IWalletPortfolio,
  IWalletRecovery,
  IWalletSignTransaction,
  IWalletSignTransactionResponse,
} from "@brillionfi/wallet-infra-sdk/dist/models";
import { useBrillionContext } from "../BrillionContext";

export const useWallet = () => {
  const sdk = useBrillionContext();

  const createWallet = async (data: IWallet): Promise<IWallet | undefined> => {
    return await sdk?.Wallet.createWallet(data);
  };

  const wallets = async (): Promise<IWallet[] | undefined> => {
    return await sdk?.Wallet.getWallets();
  };

  const signTransaction = async (
    address: Address,
    data: IWalletSignTransaction,
    fromOrigin: string,
  ): Promise<IWalletSignTransactionResponse | undefined> => {
    return await sdk?.Wallet.signTransaction(address, data, fromOrigin);
  };

  const approveSignTransaction = async (
    address: Address,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
  ): Promise<IWalletSignTransactionResponse | undefined> => {
    return await sdk?.Wallet.approveTransaction(
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
    return await sdk?.Wallet.rejectTransaction(
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
    return await sdk?.Wallet.getTransactionHistory(
      address,
      chainId,
      page,
      indexer,
    );
  };

  const getPortfolio = async (
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletPortfolio | undefined> => {
    return await sdk?.Wallet.getPortfolio(address, chainId);
  };

  const getGasConfig = async (
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletGasConfiguration | undefined> => {
    return await sdk?.Wallet.getGasConfig(address, chainId);
  };

  const setGasConfig = async (
    address: Address,
    chainId: ChainId,
    configuration: IWalletGasConfiguration,
  ): Promise<IWalletGasConfigurationAPI | undefined> => {
    return await sdk?.Wallet.setGasConfig(address, chainId, configuration);
  };

  const getGasFees = async (
    chainId: ChainId,
    from: Address,
    to: Address,
    value: string,
    data: string,
  ): Promise<IWalletGasEstimation | undefined> => {
    return await sdk?.Wallet.getGasFees(chainId, from, to, value, data);
  };

  const getNonce = async (
    address: Address,
    chainId: ChainId,
  ): Promise<number | undefined> => {
    return await sdk?.Wallet.getNonce(address, chainId);
  };

  const initRecovery = async (
    address: Address,
  ): Promise<IWalletRecovery | undefined> => {
    return await sdk?.Wallet.initRecovery(address);
  };

  const execRecovery = async (
    organizationId: string,
    userId: string,
    passkeyName: string,
    bundle: string,
    fromOrigin: string,
  ): Promise<IExecRecovery | undefined> => {
    return await sdk?.Wallet.execRecovery(
      organizationId,
      userId,
      passkeyName,
      bundle,
      fromOrigin,
    );
  };

  const getNotifications = async (): Promise<
    IWalletNotifications | undefined
  > => {
    return await sdk?.Wallet.getNotifications();
  };

  return {
    wallets,
    createWallet,
    signTransaction,
    getTransactionHistory,
    getPortfolio,
    getGasConfig,
    setGasConfig,
    getGasFees,
    getNonce,
    initRecovery,
    execRecovery,
    approveSignTransaction,
    rejectSignTransaction,
    getNotifications,
  };
};
