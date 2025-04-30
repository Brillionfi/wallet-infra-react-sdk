import { useCallback, useEffect, useMemo } from "react";
import { useBrillionContext } from "@/components/BrillionContext";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";
import { WalletKitTypes } from "@reown/walletkit";
import { buildApprovedNamespaces, getSdkError, parseUri } from "@walletconnect/utils"
import BrillionEip1193Bridge from "@/utils/wagmi/brillionEip1193Bridge";
import { useApproveWalletAuthenticator } from "./useApproveWalletAuthenticator";

export const useWalletConnect = ({
  onError,
  onSuccess,
}: {
  onError: (message: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (response: any) => void;
}) => {
  const { sdk, signer, chain, wcClient, wcInitialized, showWCPrompt } = useBrillionContext();
  const { signWalletAuthenticator } = useApproveWalletAuthenticator({
    onError,
  });

  if (!sdk || !signer || !chain) {
    throw new Error("Missing configuration");
  }
  if (!wcClient) return;

  const eip1193 = useMemo(() => {
    return new BrillionEip1193Bridge(signer, Number(chain), sdk, signWalletAuthenticator);
  }, [chain]);

  const onSessionProposal = useCallback(async ({ id, params }: WalletKitTypes.SessionProposal) => {
    const chains = Object.values(SUPPORTED_CHAINS).map((chain) => `eip155:${chain}`);
    const accounts = chains.map((chain) => `${chain}:${signer}`);
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
  }, []);
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
          const response = await eip1193.send(request.method, request.params);
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
  }, []);

  const onSessionDelete = () => {
    console.log("onSessionDelete");
  };

  /******************************************************************************
   * Set up WalletConnect event listeners
   *****************************************************************************/
  useEffect(() => {
    if (wcInitialized && wcClient) {
      //sign
      wcClient.on('session_proposal', onSessionProposal);
      wcClient.on('session_request', onSessionRequest);
      // auth
      //wcClient.on('auth_request', onAuthRequest)
      // TODOs
      wcClient.engine.signClient.events.on('session_ping', data => console.log('ping', data));
      wcClient.on('session_delete', onSessionDelete);
    }
  }, [wcInitialized, onSessionProposal, onSessionRequest, onSessionDelete])
  
  const connect = async (uri: string) => {
    wcClient.once("session_proposal", () => {
      const { topic: pairingTopic } = parseUri(uri);
      const pairingExpiredListener = ({ topic }: { topic: string }) => {
        if (pairingTopic === topic) {
          onError("Pairing expired. Please try again with new Connection URI");
          wcClient.core.pairing.events.removeListener("pairing_expire", pairingExpiredListener);
        }
      }
      wcClient.core.pairing.events.removeListener("pairing_expire", pairingExpiredListener);
    });
    console.log("WC: Connect URI: ", uri);
    await wcClient.pair({ uri });
  };

  return {
    connect,
  };
};
