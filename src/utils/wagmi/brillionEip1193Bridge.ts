import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
import {
  TransactionTypeActivityKeys,
  WalletFormats,
  WalletTypes,
} from "@brillionfi/wallet-infra-sdk/dist/models";
import { SDKProvider } from "@metamask/sdk";
import { keccak256, Transaction } from "ethers";
import { custom } from "viem";

import { hexToString, numberToHex, parseChain } from ".";
import {
  CustomProvider,
  eth_call,
  eth_estimateGas,
  eth_sendTransaction,
  eth_signTransaction,
  wallet_switchEthereumChain,
} from "./types";

const constructSignature = (
  data:
    | {
        r: string;
        s: string;
        v: string;
      }
    | undefined,
) => {
  // Ensure r and s are 32 bytes (64 hex chars)
  if (!data) return undefined;

  const { r, s, v } = data;
  if (r.length !== 64 || s.length !== 64) {
    throw new Error("r and s must be 32-byte hex strings with 0x prefix");
  }

  return {
    rawSignature: { r: `0x${r}`, s: `0x${s}`, v: `0x${v}` },
    signature: `0x${r}${s}${parseInt(v) + 27}`,
  };
};

const hexToText = (hex: string) => {
  return new TextDecoder().decode(
    new Uint8Array(
      hex
        .slice(2)
        .match(/.{1,2}/g)!
        .map((byte) => parseInt(byte, 16)),
    ),
  );
};

export class BrillionEip1193Bridge {
  address: string;
  chainId: number;
  provider: SDKProvider | CustomProvider;
  sdk: WalletInfra;

  constructor(address: string, chain: number, sdk: WalletInfra) {
    this.address = address;
    this.chainId = chain;
    this.sdk = sdk;
    this.provider = custom({ request: this.request })({ retryCount: 1 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async send(method: string, params?: Array<any>): Promise<any> {
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

          const gasData = await this.sdk.Wallet.getGasFees(
            parseChain(this.chainId),
            this.address,
            sendTransactionData.to,
            txValue,
            txData,
          );

          await this.sdk.Wallet.setGasConfig(
            this.address,
            parseChain(this.chainId),
            {
              gasLimit: (Number(gasData.gasLimit) * Number("1.2")).toFixed(),
              baseFee: (
                (Number(gasData.maxFeePerGas) -
                  Number(gasData.maxPriorityFeePerGas)) *
                Number("1.2")
              ).toFixed(),
              maxFeePerGas: (
                Number(gasData.maxFeePerGas) * Number("1.2")
              ).toFixed(),
              maxPriorityFeePerGas: (
                Number(gasData.maxPriorityFeePerGas) * Number("1.2")
              ).toFixed(),
            },
          );

          const tx = await this.sdk.Transaction.createTransaction({
            transactionType: "unsigned",
            from: this.address,
            to: sendTransactionData.to,
            value: txValue,
            data: txData,
            chainId: this.chainId.toString(),
          });
          return new Promise((resolve, reject) => {
            const timer = setInterval(async () => {
              try {
                const response = await this.sdk.Transaction.getTransactionById(
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
        return await this.sdk.Wallet.rpcRequest(
          { method, params: params as eth_estimateGas },
          { chainId: parseChain(this.chainId) },
        );
      }
      case "eth_blockNumber": {
        return await this.sdk.Wallet.rpcRequest(
          { method },
          { chainId: parseChain(this.chainId) },
        );
      }
      case "eth_getBalance": {
        // TODO: wagmi useBalance does not support array response
        // const balance = await this.sdk.Wallet.getPortfolio(this.address, parseChain(this.chainId));
        return await this.sdk.Wallet.rpcRequest(
          { method, params: params as string[] },
          { chainId: parseChain(this.chainId) },
        );
      }
      case "eth_getTransactionCount": {
        return await this.sdk.Wallet.getNonce(
          this.address,
          parseChain(this.chainId),
        );
      }
      case "eth_call": {
        return await this.sdk.Wallet.rpcRequest(
          { method, params: params as eth_call },
          { chainId: parseChain(this.chainId) },
        );
      }
      case "eth_getTransactionReceipt": {
        return await this.sdk.Wallet.rpcRequest(
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
        return await this.sdk.Wallet.rpcRequest(
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
        try {
          const txDetails = Transaction.from({
            value: hexToString(signTransactionData.value ?? "0"),
            to: signTransactionData.to,
            data: signTransactionData.data,
          });
          const unsignedTransaction = txDetails.unsignedSerialized.startsWith(
            "0x",
          )
            ? txDetails.unsignedSerialized.slice(2)
            : txDetails.unsignedSerialized;
          const response = await this.sdk.Wallet.signTransaction(
            signTransactionData.from,
            {
              walletFormat: WalletFormats.ETHEREUM,
              walletType: WalletTypes.EOA,
              unsignedTransaction,
            },
            window.location.origin,
          );
          if (response.needsApproval === true && response.fingerprint) {
            const { authenticators } =
              await this.sdk.Wallet.getWalletAuthenticator();
            const approvedData = await this.sdk.Transaction.signWithPasskey(
              authenticators[0].credentialId,
              response.organizationId,
              response.fingerprint,
              window.location.hostname,
              TransactionTypeActivityKeys.ACTIVITY_TYPE_APPROVE_ACTIVITY,
            );
            const approvedResponse = await this.sdk.Wallet.approveActivity(
              response.fingerprint,
              response.organizationId,
              approvedData.timestamp,
              approvedData.stamped,
            );
            const contructedSignature = constructSignature(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (approvedResponse.data as any).signRawPayloadResult,
            );
            return contructedSignature?.signature;
          } else {
            return "0x" + response.signedTransaction;
          }
        } catch (error) {
          throw new Error(`eth_signTransaction error :>> ${error}`);
        }
      }
      case "eth_signTypedData_v4": {
        //This is a standardized Ethereum JSON-RPC method for signing typed data using the user’s private key
        const response = await this.sdk.Wallet.signMessage(this.address, {
          typedData: JSON.parse((params as string[])[1]),
        });
        if (response.needsApproval === true && response.fingerprint) {
          const { authenticators } =
            await this.sdk.Wallet.getWalletAuthenticator();
          const approvedData = await this.sdk.Transaction.signWithPasskey(
            authenticators[0].credentialId,
            response.organizationId,
            response.fingerprint,
            window.location.hostname,
            TransactionTypeActivityKeys.ACTIVITY_TYPE_APPROVE_ACTIVITY,
          );
          const approvedResponse = await this.sdk.Wallet.approveActivity(
            response.fingerprint,
            response.organizationId,
            approvedData.timestamp,
            approvedData.stamped,
          );
          const contructedSignature = constructSignature(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (approvedResponse.data as any).signRawPayloadResult,
          );
          return contructedSignature?.signature;
        }
        return response.finalSignature;
      }
      case "eth_sign": {
        //Signs arbitrary data using the user’s private key
        const data =
          (params as `0x${string}`[])[0].length === 42
            ? (params as `0x${string}`[])[1]
            : (params as `0x${string}`[])[0];
        const response = await this.sdk.Wallet.signMessage(this.address, {
          message: hexToText(data),
        });
        if (response.needsApproval === true && response.fingerprint) {
          const { authenticators } =
            await this.sdk.Wallet.getWalletAuthenticator();
          const approvedData = await this.sdk.Transaction.signWithPasskey(
            authenticators[0].credentialId,
            response.organizationId,
            response.fingerprint,
            window.location.hostname,
            TransactionTypeActivityKeys.ACTIVITY_TYPE_APPROVE_ACTIVITY,
          );
          const approvedResponse = await this.sdk.Wallet.approveActivity(
            response.fingerprint,
            response.organizationId,
            approvedData.timestamp,
            approvedData.stamped,
          );
          const contructedSignature = constructSignature(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (approvedResponse.data as any).signRawPayloadResult,
          );
          return contructedSignature?.signature;
        }
        return response.finalSignature;
      }
      case "personal_sign": {
        //Signs a message, adding a user-readable prefix for security.
        const data =
          (params as `0x${string}`[])[0].length === 42
            ? (params as `0x${string}`[])[1]
            : (params as `0x${string}`[])[0];
        const response = await this.sdk.Wallet.signMessage(this.address, {
          message: hexToText(data),
        });
        if (response.needsApproval === true && response.fingerprint) {
          const { authenticators } =
            await this.sdk.Wallet.getWalletAuthenticator();
          const approvedData = await this.sdk.Transaction.signWithPasskey(
            authenticators[0].credentialId,
            response.organizationId,
            response.fingerprint,
            window.location.hostname,
            TransactionTypeActivityKeys.ACTIVITY_TYPE_APPROVE_ACTIVITY,
          );
          const approvedResponse = await this.sdk.Wallet.approveActivity(
            response.fingerprint,
            response.organizationId,
            approvedData.timestamp,
            approvedData.stamped,
          );
          const contructedSignature = constructSignature(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (approvedResponse.data as any).signRawPayloadResult,
          );
          return contructedSignature?.signature;
        }
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
        return await this.sdk.Wallet.rpcRequest(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { method: method as any, params: params as any },
          { chainId: parseChain(this.chainId) },
        );
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(request: { method: string; params?: Array<any> }): Promise<any> {
    return this.send(request.method, request.params || []);
  }
}

export default BrillionEip1193Bridge;
