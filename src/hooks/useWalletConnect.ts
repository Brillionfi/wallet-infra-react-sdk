import BrillionEip1193Bridge from "@/utils/wagmi/brillionEip1193Bridge";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";
import { ErrorResponse } from "@walletconnect/jsonrpc-types/dist/types/jsonrpc";
import { useBrillionContext } from "components/BrillionContext";

export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: "personal_sign",
  ETH_SIGN: "eth_sign",
  ETH_SIGN_TRANSACTION: "eth_signTransaction",
  ETH_SIGN_TYPED_DATA: "eth_signTypedData",
  ETH_SIGN_TYPED_DATA_V3: "eth_signTypedData_v3",
  ETH_SIGN_TYPED_DATA_V4: "eth_signTypedData_v4",
  ETH_SEND_RAW_TRANSACTION: "eth_sendRawTransaction",
  ETH_SEND_TRANSACTION: "eth_sendTransaction",
};

export const useWalletConnect = () => {
  const { sdk, signer, chain, wcClient } = useBrillionContext();
  if (!sdk || !signer || !chain) {
    throw new Error("Missing configuration");
  }

  const eip1193 = new BrillionEip1193Bridge(signer, Number(chain), sdk);

  const connect = async (uri: string) => {
    if (!wcClient) {
      throw new Error("Client not initialized");
    }

    wcClient.on("session_proposal", async (proposal) => {
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

      // // TODO show modal to approve/reject request
      // const approved = await showPrompt({
      //   title: `Request: ${label}`,
      //   message: `Would you like to approve this request?`,
      //   actionList: [
      //     {
      //       id: "APPROVE",
      //       title: "Approve",
      //       type: "default",
      //     },
      //     {
      //       id: "REJECT",
      //       title: "Reject",
      //       type: "cancel",
      //     },
      //   ],
      // });
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
    });

    wcClient.on("session_request", async (requestEvent) => {
      try {
        // TODO show modal to approve/reject request
        // const approved = await showPrompt({
        //   title: `Request: ${label}`,
        //   message: `Would you like to approve this request?`,
        //   actionList: [
        //     {
        //       id: "APPROVE",
        //       title: "Approve",
        //       type: "default",
        //     },
        //     {
        //       id: "REJECT",
        //       title: "Reject",
        //       type: "cancel",
        //     },
        //   ],
        // });

        const { params } = requestEvent;
        const { request } = params;
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
            error: error as ErrorResponse,
          },
        });
      }
    });

    wcClient.on("session_delete", (_data) => {
      // TODO show modal to approve/reject rdisplay disconnected
      // const approved = await showPrompt({
      //   title: `Request: ${label}`,
      //   message: `Would you like to approve this request?`,
      //   actionList: [
      //     {
      //       id: "APPROVE",
      //       title: "Approve",
      //       type: "default",
      //     },
      //     {
      //       id: "REJECT",
      //       title: "Reject",
      //       type: "cancel",
      //     },
      //   ],
      // });
    });

    await wcClient.pair({ uri });
  };

  return {
    connect,
    eip1193,
  };
};
