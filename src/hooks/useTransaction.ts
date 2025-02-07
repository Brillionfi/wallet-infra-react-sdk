import {
  AuthProvider,
  ISignTransactionResponse,
  ISignTransactionWithPasskey,
  IStamped,
  ITransaction,
  ITransactionSigned,
  ITransactionUnsigned,
  SUPPORTED_CHAINS,
  TransactionTypeActivityKeys,
  TransactionUnsignedSchema,
} from "@brillionfi/wallet-infra-sdk/dist/models";
import { useBrillionContext } from "components/BrillionContext";
import { BrowserProvider } from "ethers";

export const useTransaction = () => {
  const { sdk, sessionInfo, sdkMM } = useBrillionContext();

  const createTransaction = async (
    transaction: ITransactionSigned | ITransactionUnsigned,
  ): Promise<ITransaction | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    const unsignedTx = TransactionUnsignedSchema.safeParse(transaction);
    if (
      sessionInfo.loggedInVia === AuthProvider.METAMASK &&
      unsignedTx.success
    ) {
      if (!sdkMM) throw new Error("MetaMask is not connected");
      const ethereum = sdkMM.getProvider();
      if (!ethereum) {
        throw new Error("No MetaMask provider found");
      }

      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      try {
        const tx = await signer.sendTransaction({
          from: unsignedTx.data.from,
          to: unsignedTx.data.to,
          value: unsignedTx.data.value,
          data: unsignedTx.data.data,
          chainId: unsignedTx.data.chainId,
        });
        await tx.wait();

        const response: ITransaction = {
          transactionType: "unsigned",
          transactionId: tx.hash,
          transactionHash: tx.hash,
          signedTx: "",
          from: tx.from,
          to: tx.to!,
          value: tx.value.toString(),
          gasLimit: tx.gasLimit.toString(),
          gasPrice: tx.gasPrice?.toString(),
          maxFeePerGas: tx.maxFeePerGas?.toString(),
          maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toString(),
          nonce: tx.nonce,
          data: tx.data,
          chainId: unsignedTx.data.chainId as SUPPORTED_CHAINS,
          messageId: "",
          fingerprint: "", // Add appropriate value
          organizationId: "", // Add appropriate value
          userAddress: "", // Add appropriate value
          walletId: "", // Add appropriate value
        };

        return response;
      } catch (error) {
        throw new Error("Transaction failed: " + error);
      }
    } else {
      return await sdk.Transaction.createTransaction(transaction);
    }
  };

  const getTransactionById = async (
    id: string,
  ): Promise<ITransaction | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Transaction.getTransactionById(id);
  };

  const cancelTransaction = async (id: string): Promise<void | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Transaction.cancelTransaction(id);
  };

  const signWithPasskey = async (
    credentialId: string,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
    approveOrReject: boolean,
  ): Promise<ISignTransactionWithPasskey | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }

    return await sdk.Transaction.signWithPasskey(
      credentialId,
      organizationId,
      fingerprint,
      fromOrigin,
      approveOrReject
        ? TransactionTypeActivityKeys.ACTIVITY_TYPE_APPROVE_ACTIVITY
        : TransactionTypeActivityKeys.ACTIVITY_TYPE_REJECT_ACTIVITY,
    );
  };

  const approveTransaction = async (
    id: string,
    organizationId: string,
    timestamp: string,
    stamped: IStamped,
  ): Promise<ISignTransactionResponse | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Transaction.approveSignTransaction(
      id,
      organizationId,
      timestamp,
      stamped,
    );
  };

  const rejectTransaction = async (
    id: string,
    organizationId: string,
    timestamp: string,
    stamped: IStamped,
  ): Promise<ISignTransactionResponse | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Transaction.rejectSignTransaction(
      id,
      organizationId,
      timestamp,
      stamped,
    );
  };

  return {
    signWithPasskey,
    createTransaction,
    getTransactionById,
    cancelTransaction,
    approveTransaction,
    rejectTransaction,
  };
};
