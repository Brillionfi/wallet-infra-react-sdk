import {
  ISignTransactionResponse,
  ITransaction,
  ITransactionSigned,
  ITransactionUnsigned,
} from "@brillionfi/wallet-infra-sdk/dist/models";
import { useBrillionContext } from "components/BrillionContext";

export const useTransaction = () => {
  const { sdk } = useBrillionContext();

  const createTransaction = async (
    transaction: ITransactionSigned | ITransactionUnsigned,
  ): Promise<ITransaction | undefined> => {
    return await sdk?.Transaction.createTransaction(transaction);
  };

  const getTransactionById = async (
    id: string,
  ): Promise<ITransaction | undefined> => {
    return await sdk?.Transaction.getTransactionById(id);
  };

  const cancelTransaction = async (id: string): Promise<void | undefined> => {
    return await sdk?.Transaction.cancelTransaction(id);
  };

  const approveSignTransaction = async (
    id: string,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
  ): Promise<ISignTransactionResponse | undefined> => {
    return await sdk?.Transaction.approveSignTransaction(
      id,
      organizationId,
      fingerprint,
      fromOrigin,
    );
  };

  const rejectSignTransaction = async (
    id: string,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
  ): Promise<ISignTransactionResponse | undefined> => {
    return await sdk?.Transaction.rejectSignTransaction(
      id,
      organizationId,
      fingerprint,
      fromOrigin,
    );
  };

  return {
    createTransaction,
    getTransactionById,
    cancelTransaction,
    approveSignTransaction,
    rejectSignTransaction,
  };
};
