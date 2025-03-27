import { useEffect, useMemo } from "react";
import { useBrillionContext } from "@/components/BrillionContext";
import BrillionEip1193Bridge from "@/utils/wagmi/brillionEip1193Bridge";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

export const useWalletConnect = () => {
  const { sdk, signer, chain, wcClient, showWCPrompt } = useBrillionContext();

  if (!sdk || !signer || !chain) {
    throw new Error("Missing configuration");
  }
  if (!wcClient) return;

  const eip1193 = useMemo(() => {
    return new BrillionEip1193Bridge(signer, Number(chain), sdk);
  }, [chain]);

  const handleProposal = async (proposal: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { proposer: { metadata: any } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any;
  }) => {
    const accounts = Object.values(SUPPORTED_CHAINS).map(
      (chain) => `eip155:${chain}:${signer}`,
    );
    const methods = [
      "eth_sendTransaction",
      "eth_accounts",
      "eth_chainId",
      "eth_estimateGas",
      "eth_blockNumber",
      "eth_getBalance",
      "eth_getTransactionCount",
      "wallet_switchEthereumChain",
      "eth_signTransaction",
      "eth_signTypedData_v4",
      "eth_sign",
      "personal_sign",
    ];
    const events = ["connect", "disconnect"];
    const display = proposal?.params?.proposer?.metadata;
    showWCPrompt({
      tittle: `Connect Request: ${display.name}`,
      message: `
        ${display.description}
        \n
        from: ${display.url}
      `,
      rejectAction: async () => {
        await wcClient.rejectSession({
          id: proposal.id,
          reason: {
            code: 5000,
            message: "User rejected the request",
          },
        });
      },
      approveAction: async () => {
        await wcClient.approveSession({
          id: proposal.id,
          namespaces: {
            eip155: {
              accounts,
              methods,
              events,
            },
          },
        });
      },
    });
  };
  const handleRequest = async (requestEvent: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    topic?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id?: any;
  }) => {
    const display = requestEvent?.params?.request;
    showWCPrompt({
      tittle: `Action requested: ${display.method}`,
      message: `
        ${JSON.stringify(display.params)}
      `,
      rejectAction: async () => {
        await wcClient.respondSessionRequest({
          topic: requestEvent.topic,
          response: {
            id: requestEvent.id,
            jsonrpc: "2.0",
            error: {
              code: 5001,
              message: "User rejected this request",
            },
          },
        });
      },
      approveAction: async () => {
        const { params } = requestEvent;
        const { request } = params;
        try {
          const response = await eip1193.send(request.method, request.params);
          await wcClient.respondSessionRequest({
            topic: requestEvent.topic,
            response: {
              id: requestEvent.id,
              jsonrpc: "2.0",
              result: response,
            },
          });
        } catch (error) {
          await wcClient.respondSessionRequest({
            topic: requestEvent.topic,
            response: {
              id: requestEvent.id,
              jsonrpc: "2.0",
              error: {
                code: 5001,
                message:
                  error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
              },
            },
          });
        }
      },
    });
  };
  const handleLogout = () => {};

  useEffect(() => {
    wcClient.removeListener("session_proposal", handleProposal);
    wcClient.removeListener("session_request", handleRequest);
    wcClient.removeListener("session_delete", handleLogout);

    wcClient.on("session_proposal", handleProposal);
    wcClient.on("session_request", handleRequest);
    wcClient.on("session_delete", handleLogout);
  }, [eip1193]);

  const connect = async (uri: string) => {
    await wcClient.pair({ uri });
  };

  return {
    connect,
  };
};
