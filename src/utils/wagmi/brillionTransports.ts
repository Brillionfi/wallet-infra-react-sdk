import { AuthProvider, WalletInfra } from "@brillionfi/wallet-infra-sdk";
import MetaMaskSDK from "@metamask/sdk";
import Client, { SignClient } from "@walletconnect/sign-client";
import { custom } from "wagmi";

import { BrillionProviderProps, parseChain } from ".";

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

export const BrillionTransport = (
  config: Pick<BrillionProviderProps, "appId" | "baseUrl" | "WcProjectId">,
  chainId: number,
) => {
  const sdk = new WalletInfra(config.appId!, config.baseUrl!);
  const mmSDK = new MetaMaskSDK({
    dappMetadata: {
      name: "Brillion",
      url: "https://brillion.finance",
      iconUrl: "", // TODO add brillion icon
    },
  });
  let wcSDK: Client;

  return custom({
    async request(body) {
      const cookies = document.cookie.split(";");
      const sessionCookie = cookies.find((strings) =>
        strings.includes("brillion-session-jwt"),
      );
      const sessionData = JSON.parse(
        cookies.find((strings) =>
          strings.includes("brillion-session-session"),
        ) || "{}",
      );
      const jwt = sessionCookie?.split("=")[1];
      if (!jwt) throw new Error("Login first");
      sdk.authenticateUser(jwt);

      if (sessionData.loggedInVia === AuthProvider.METAMASK) {
        const ethereum = mmSDK.getProvider();
        if (!ethereum) {
          throw new Error("No MetaMask provider found");
        }
        return ethereum.request(body);
      } else if (sessionData.loggedInVia === AuthProvider.WALLET_CONNECT) {
        wcSDK = await SignClient.init({
          relayUrl: "wss://relay.walletconnect.com",
          projectId: config.WcProjectId!,
          metadata: {
            name: "Brillion",
            description: "Brillion Wallet",
            url: "https://brillion.finance",
            icons: [""], // TODO add brillion icon
          },
        });
        await wcSDK.session.init();
        const lastKeyIndex = wcSDK.session.getAll().length - 1;
        const session = wcSDK.session.getAll()[lastKeyIndex];
        return wcSDK.request({
          topic: session.topic,
          chainId: "eip155:" + chainId,
          request: body,
        });
      } else {
        switch (body.method) {
          // TODO: wagmi useBalance does not support array response
          // case "eth_getBalance": {
          //   const response = await sdk.Wallet.getPortfolio(body.params[0], parseChain(chainId));
          //   return response.portfolio;
          // }
          case "eth_getTransactionCount": {
            return await sdk.Wallet.getNonce(
              body.params[0],
              parseChain(chainId),
            );
          }
          case "eth_signTypedData_v4": {
            //This is a standardized Ethereum JSON-RPC method for signing typed data using the user’s private key
            const response = await sdk.Wallet.signMessage(body.params[0], {
              typedData: JSON.parse((body.params as string[])[1]),
            });
            return response.finalSignature;
          }
          case "eth_sign": {
            //Signs arbitrary data using the user’s private key
            const response = await sdk.Wallet.signMessage(body.params[0], {
              message: hexToText((body.params as `0x${string}`[])[0]),
            });
            return response.finalSignature;
          }
          case "personal_sign": {
            //Signs a message, adding a user-readable prefix for security.
            const response = await sdk.Wallet.signMessage(body.params[0], {
              message: hexToText((body.params as `0x${string}`[])[0]),
            });
            return response.finalSignature;
          }
          default:
            return await sdk.Wallet.rpcRequest(
              { ...body },
              { chainId: parseChain(chainId) },
            );
        }
      }
    },
  });
};
