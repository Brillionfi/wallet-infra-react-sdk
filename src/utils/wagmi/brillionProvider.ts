import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
import {
  WalletFormats,
  WalletTypes,
} from "@brillionfi/wallet-infra-sdk/dist/models";
import { SDKProvider } from "@metamask/sdk";
import {
  keccak256,
  Transaction,
} from "ethers";
import { hexToString, numberToHex, parseChain } from ".";
import { custom, EIP1193RequestFn } from "viem";
import {
  CustomProvider,
  eth_call,
  eth_estimateGas,
  eth_sendTransaction,
  eth_signTransaction,
  wallet_switchEthereumChain,
} from "./types";

const hexToStr = (hex: string) => {
  return new TextDecoder().decode(
    new Uint8Array(
      hex
        .slice(2)
        .match(/.{1,2}/g)!
        .map((byte) => parseInt(byte, 16)),
    ),
  );
};

export class BrillionProvider {
  address: string;
  chainId: number;
  provider: SDKProvider | CustomProvider;
  sdk: WalletInfra;

  constructor(
    address: string,
    chain: number,
    sdk: WalletInfra,
  ) {
    this.address = address;
    this.chainId = chain;
    this.sdk = sdk;
  
    const request: EIP1193RequestFn = async ({
      method,
      params,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }): Promise<any> => {
      switch (method) {
        case "eth_sendTransaction": {
          const sendTransactionData = (params as eth_sendTransaction[])[0];
          try {
            const txData =
              sendTransactionData.data &&
              sendTransactionData.data.toString() !== "0x0"
                ? sendTransactionData.data.toString()
                : "0x";
            const txValue = hexToString(sendTransactionData.value ?? "0x0");

            const gasData = await sdk.Wallet.getGasFees(
              parseChain(this.chainId),
              this.address,
              sendTransactionData.to,
              txValue,
              txData,
            );

            await sdk.Wallet.setGasConfig(
              this.address,
              parseChain(this.chainId),
              {
                gasLimit: (
                  Number(gasData.gasLimit) * Number("1.2")
                ).toFixed(),
                baseFee: ((Number(gasData.maxFeePerGas) - Number(gasData.maxPriorityFeePerGas)) * Number("1.2")).toFixed(),
                maxFeePerGas: (
                  Number(gasData.maxFeePerGas) * Number("1.2")
                ).toFixed(),
                maxPriorityFeePerGas: (
                  Number(gasData.maxPriorityFeePerGas) * Number("1.2")
                ).toFixed(),
              },
            );

            const tx = await sdk.Transaction.createTransaction({
              transactionType: "unsigned",
              from: this.address,
              to: sendTransactionData.to,
              value: txValue,
              data: txData,
              chainId: chain.toString(),
            });
            return new Promise((resolve, reject) => {
              const timer = setInterval(async () => {
                try {
                  const response = await sdk.Transaction.getTransactionById(
                    tx.transactionId,
                  );
                  if (response.transactionHash) {
                    clearInterval(timer);
                    resolve(response.transactionHash);
                  }
                  if (response.reason !== "") {
                    clearInterval(timer);
                    reject(response.reason);
                  }
                } catch (error) {
                  clearInterval(timer);
                  reject(error);
                }
              }, 1000);
            });
          } catch (error) {
            throw new Error(`Unknown tx error: ${JSON.stringify(error)}`);
          }
        }
        case "eth_accounts": {
          return this.address ? [this.address] : [];
        }
        case "eth_chainId": {
          return numberToHex(this.chainId);
        }
        case "eth_estimateGas": {
          return await sdk.Wallet.rpcRequest(
            { method, params: params as eth_estimateGas },
            { chainId: parseChain(this.chainId) },
          );
        }
        case "eth_blockNumber": {
          return await sdk.Wallet.rpcRequest(
            { method },
            { chainId: parseChain(this.chainId) },
          );
        }
        case "eth_getBalance": {
          // TODO: wagmi useBalance does not support array response
          // const balance = await sdk.Wallet.getPortfolio(this.address, parseChain(this.chainId));
          return await sdk.Wallet.rpcRequest(
            { method, params: params as string[] },
            { chainId: parseChain(this.chainId) },
          );
        }
        case "eth_getTransactionCount": {
          return await sdk.Wallet.getNonce(
            this.address,
            parseChain(this.chainId),
          );
        }
        case "eth_call": {
          return await sdk.Wallet.rpcRequest(
            { method, params: params as eth_call },
            { chainId: parseChain(this.chainId) },
          );
        }
        case "eth_getTransactionReceipt": {
          return await sdk.Wallet.rpcRequest(
            { method, params: params as string[] },
            { chainId: parseChain(this.chainId) },
          );
        }
        case "eth_requestAccounts": {
          return this.address ? [this.address] : [];
        }
        case "wallet_switchEthereumChain": {
          const chain = (params as wallet_switchEthereumChain[])[0].chainId;
          this.chainId = Number(chain);
          return chain;
        }
        case "net_version": {
          return await sdk.Wallet.rpcRequest(
            { method },
            { chainId: parseChain(this.chainId) },
          );
        }
        case "web3_clientVersion": {
          return "Brillion Wallet v3";
        }
        case "web3_sha3": {
          const hash = keccak256((params as string[])[0]);
          return hash;
        }
        case "eth_signTransaction": {
          const signTransactionData = (params as eth_signTransaction[])[0];
          const txDetails = Transaction.from(signTransactionData);
          const response = await sdk.Wallet.signTransaction(
            signTransactionData.from,
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
            return response.signedTransaction;
          }
        }
        case "eth_signTypedData_v4": {
          //This is a standardized Ethereum JSON-RPC method for signing typed data using the user’s private key
          const response = await sdk.Wallet.signMessage(this.address, {
            typedData: JSON.parse((params as string[])[1]),
          });
          return response.finalSignature;
        }
        case "eth_sign": {
          //Signs arbitrary data using the user’s private key
          const response = await sdk.Wallet.signMessage(this.address, {
            message: hexToStr((params as `0x${string}`[])[0]),
          });
          return response.finalSignature;
        }
        case "personal_sign": {
          //Signs a message, adding a user-readable prefix for security.
          const response = await sdk.Wallet.signMessage(this.address, {
            message: hexToStr((params as `0x${string}`[])[0]),
          });
          return response.finalSignature;
        }
        case "wallet_watchAsset": {
          throw new Error("method not supported");
        }
        case "wallet_requestPermissions": {
          throw new Error("method not supported");
        }
        case "wallet_scanQRCode": {
          throw new Error("method not supported");
        }
        case "wallet_getPermissions": {
          throw new Error("method not supported");
        }
        case "wallet_registerOnboarding": {
          throw new Error("method not supported");
        }
        case "wallet_invokeSnap": {
          throw new Error("method not supported");
        }
        case "wallet_enable": {
          throw new Error("method not supported");
        }
        case "wallet_getCapabilities": {
          throw new Error("method not supported");
        }
        case "wallet_sendCalls": {
          throw new Error("method not supported");
        }
        case "wallet_getCallsStatus": {
          throw new Error("method not supported");
        }
        case "wallet_showCallsStatus": {
          throw new Error("method not supported");
        }
        case "wallet_addEthereumChain": {
          throw new Error("method not supported");
        }
        default: {
          return await sdk.Wallet.rpcRequest(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { method: method as any, params: params as any },
            { chainId: parseChain(this.chainId) },
          );
        }
      }
    };

    this.provider = custom({ request })({ retryCount: 1 });
    }
  }


export default BrillionProvider;
