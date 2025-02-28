import { BlockTag, Transaction, TransactionLike, TransactionRequest, TransactionResponse, TypedDataDomain, TypedDataField } from "ethers";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
import { SDKProvider } from "@metamask/sdk";
import { WalletFormats, WalletTypes } from "@brillionfi/wallet-infra-sdk/dist/models";
import { hexToString, parseChain } from ".";
import { CustomProvider, eth_estimateGas } from "./types";

export class BrillionSigner /*implements Signer*/ {
  address: string;
  provider: SDKProvider | CustomProvider;
  sdk: WalletInfra;
  
  constructor(address: string, provider: SDKProvider | CustomProvider, sdk: WalletInfra) {
    this.address = address;
    this.provider = provider;
    this.sdk = sdk;
  }

  async getAddress(): Promise<string>{
    return this.address;
  }

  async signTransaction(tx: TransactionRequest): Promise<string> {
    const txDetails = Transaction.from(tx as TransactionLike);
    const response = await this.sdk.Wallet.signTransaction(
      (tx as TransactionLike).from!,
      {
        walletFormat: WalletFormats.ETHEREUM,
        walletType: WalletTypes.EOA,
        unsignedTransaction: txDetails.serialized,
      },
      window.location.origin,
    );
    if (response.needsApproval) {
      return "Transaction created, but needs another approval";
    } else {
      return response.signedTransaction!;
    }
  }

  async sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse> {
    const rawTx = Transaction.from(transaction as TransactionLike);
    try {
      const txData = rawTx.data && rawTx.data.toString() !== "0x0" ? rawTx.data.toString() : "0x";
      const txValue = hexToString(rawTx.value.toString() ?? "0x0");
      
      const gasData = await this.sdk.Wallet.getGasFees(parseChain(Number(rawTx.chainId)), rawTx.from!, rawTx.to!, txValue, txData);

      await this.sdk.Wallet.setGasConfig(
        rawTx.from!,
        parseChain(Number(rawTx.chainId)),
        {
          gasLimit: (Number(gasData.gasLimit) * Number("1.2")).toFixed(),
          maxFeePerGas: (Number(gasData.maxFeePerGas) * Number("1.2")).toFixed(),
          maxPriorityFeePerGas: (Number(gasData.maxPriorityFeePerGas) * Number("1.2")).toFixed(),
        },
      );

      const tx = await this.sdk.Transaction.createTransaction({
        transactionType: "unsigned",
        from: rawTx.from!,
        to: rawTx.to!,
        value: txValue,
        data: txData,
        chainId: rawTx.chainId.toString(),
      });
      return {
        ...tx,
        hash: tx.transactionHash,
        confirmations: 0,
        from: tx.from!,
        wait: async () => {
          return new Promise((resolve, reject) => {
            const timer = setInterval(async () => {
              try {
                const response = await this.sdk.Transaction.getTransactionById(tx.transactionId);
                if (response.transactionHash) {
                  clearInterval(timer);
                  resolve(response);
                }
                if (response.reason !== ''){
                  clearInterval(timer);
                  reject(response.reason);
                }
              } catch (error) {
                clearInterval(timer);
                reject(error);
              }
            }, 1000);
          });
        },
      } as unknown as TransactionResponse;
    } catch (error) {
      throw new Error("Unknown tx error")
    }
  }

  async signMessage(message: string | Uint8Array): Promise<string>{
    const response = await this.sdk.Wallet.signMessage(this.address, { message: typeof message === 'string' ? message : new TextDecoder().decode(message) })
    return response.finalSignature!
  }

  async signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, string>): Promise<string> {
    const response =  await this.sdk.Wallet.signMessage(
      this.address, 
      {
        typedData: {
          domain: domain as Record<string, string>, types, message: value,
          primaryType: ""
        }
      }
    )
    return response.finalSignature!
  }

  async getNonce(_blockTag?: BlockTag): Promise<number> {
    const response =  await this.sdk.Wallet.getNonce(
      this.address, 
      await this.provider.request({method: "eth_chainId"})
    )
    return response;
  }

  async estimateGas(tx: TransactionRequest): Promise<bigint> {
    return await this.sdk.Wallet.rpcRequest(
      { method: "eth_estimateGas", params: tx as eth_estimateGas },
      { chainId: parseChain(await this.provider.request({method: "eth_chainId"})) },
    ) as unknown as bigint;
  }
  
  // async populateCall(tx: TransactionRequest): Promise<TransactionLike<string>> {

  // }

  // async populateTransaction(tx: TransactionRequest): Promise<TransactionLike<string>> {

  // }

  // async call(tx: TransactionRequest): Promise<string> {

  // }

  // async resolveName(name: string): Promise<null | string> {

  // }

  connect(provider: null | SDKProvider | CustomProvider): BrillionSigner {
    return new BrillionSigner(this.address, provider || this.provider, this.sdk);
  }
  
}

export default BrillionSigner;