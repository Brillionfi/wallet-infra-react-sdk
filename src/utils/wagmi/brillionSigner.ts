import { BlockTag, Transaction, TransactionLike, TransactionRequest, TransactionResponse, TypedDataDomain, TypedDataField, Signer } from "ethers";
import { AxiosError } from "axios";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
import { SDKProvider } from "@metamask/sdk";
import { WalletFormats, WalletTypes } from "@brillionfi/wallet-infra-sdk/dist/models";
import { CustomProvider, hexToString, parseChain } from ".";

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
      const tx = await this.sdk.Transaction.createTransaction({
        transactionType: "unsigned",
        from: rawTx.from!,
        to: rawTx.to!,
        value: hexToString(rawTx.value.toString()),
        data: rawTx.data.toString(),
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
              } catch (error) {
                clearInterval(timer);
                reject(error);
              }
            }, 1000);
          });
        },
      } as unknown as TransactionResponse;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.data.message.includes(
          "Gas settings are not set",
        )
      ) {
        await this.sdk.Wallet.setGasConfig(
          rawTx.from!,
          parseChain(Number(rawTx.chainId)),
          {
            gasLimit: "9631345750",
            maxFeePerGas: "9631345750",
            maxPriorityFeePerGas: "9631345750",
          },
        );
        const tx = await this.sdk.Transaction.createTransaction({
          transactionType: "unsigned",
          from: rawTx.from!,
          to: rawTx.to!,
          value: hexToString(rawTx.value.toString()),
          data: rawTx.data.toString(),
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
                } catch (error) {
                  clearInterval(timer);
                  reject(error);
                }
              }, 1000);
            });
          },
        } as unknown as TransactionResponse;
      }else throw new Error("Unknown tx error")
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
  
  // async populateCall(tx: TransactionRequest): Promise<TransactionLike<string>> {

  // }

  // async populateTransaction(tx: TransactionRequest): Promise<TransactionLike<string>> {

  // }

  // async estimateGas(tx: TransactionRequest): Promise<bigint> {

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

function hexToStr(arg0: string): string | undefined {
  throw new Error("Function not implemented.");
}
