import { wcClient } from "@/utils/walletConnect";
import { useCallback, useEffect, useMemo } from "react";
import { useBrillionContext } from "@/components/BrillionContext";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";
import { WalletKitTypes } from "@reown/walletkit";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils"
import BrillionEip1193Bridge from "@/utils/wagmi/brillionEip1193Bridge";
import { useApproveWalletAuthenticator } from "./useApproveWalletAuthenticator";

export const useWalletConnectEventsManager = ({
  onError,
  onSuccess,
}: {
  onError: (message: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (response: any) => void;
}) => {
  const { sdk, signer, chain, wcInitialized, showWCPrompt } = useBrillionContext();
  const { signWalletAuthenticator } = useApproveWalletAuthenticator({
    onError,
  });

  const eip1193 = useMemo(() => {
    if (!wcInitialized || !sdk) {
      return null;
    }
    return new BrillionEip1193Bridge(signer, Number(chain), sdk, signWalletAuthenticator);
  }, [chain, wcInitialized, sdk, signer, signWalletAuthenticator]);

  const onSessionProposal = useCallback(async ({ id, params }: WalletKitTypes.SessionProposal) => {
    const chains = Object.values(SUPPORTED_CHAINS).map((supportedChain) => `eip155:${supportedChain}`);
    const accounts = chains.map((supportedChain) => `${supportedChain}:${signer}`);
    console.log("onSessionProposal", accounts, chains);
    // ------- namespaces builder util ------------ //
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params,
      supportedNamespaces: {
        eip155: {
          chains,
          accounts,
          methods: [
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
          ],
          events: ["chainChanged", "connect", "disconnect"],
        },
      },
    });
    const display = params.proposer.metadata;
    showWCPrompt({
      tittle: `Connect Request: ${display.name}`,
      message: `
        ${display.description}
        \n
        from: ${display.url}
      `,
      rejectAction: async () => {
        await wcClient.rejectSession({
          id,
          reason: getSdkError("USER_REJECTED"),
        });
        onError("User rejected this request");
      },
      approveAction: async () => {
        try {
          await wcClient.approveSession({
            id,
            namespaces: approvedNamespaces,
          });
          onSuccess("Approved");
        } catch (error: Error | unknown) {
          await wcClient.rejectSession({
            id,
            reason: getSdkError("USER_REJECTED"),
          });
          onError("Error approving session: " + (error as Error).message);
        }
      },
    });
  }, [signer]);

  const onSessionRequest = useCallback(async (requestEvent: WalletKitTypes.SessionRequest) => {
    const display = requestEvent?.params?.request;
    console.log("onSessionRequest", requestEvent);
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
        onError("User rejected this request");
      },
      approveAction: async () => {
        const { params } = requestEvent;
        const { request } = params;
        try {
          const response = await eip1193?.send(request.method, request.params);
          console.log("Approve - response", response, request.method, requestEvent.topic);
          await wcClient.respondSessionRequest({
            topic: requestEvent.topic,
            response: {
              id: requestEvent.id,
              jsonrpc: "2.0",
              result: response,
            },
          });
          onSuccess(response);
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
          onError(
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          );
        }
      },
    });
  }, [eip1193]);

  const onSessionDelete = () => {
    console.log("onSessionDelete");
  };

  /******************************************************************************
   * Set up WalletConnect event listeners
   *****************************************************************************/
  useEffect(() => {
    if (wcInitialized && wcClient) {
      wcClient.on('session_proposal', onSessionProposal);
      wcClient.on('session_request', onSessionRequest);
      wcClient.on('session_delete', onSessionDelete);
      // TODOs
      // wcClient.engine.signClient.events.on('session_ping', data => console.log('ping', data));
    }
  
    return () => {
      if (wcClient) {
        wcClient.removeListener('session_proposal', onSessionProposal);
        wcClient.removeListener('session_request', onSessionRequest);
        wcClient.removeListener('session_delete', onSessionDelete);
        // wcClient.engine.signClient.events.ff('session_ping', data => console.log('ping', data));
      }
    };
  }, [wcInitialized, wcClient, onSessionProposal, onSessionRequest, onSessionDelete]);
};