import { useBrillionContext } from "components/BrillionContext";
import BrillionEip1193Bridge from "@/utils/wagmi/brillionEip1193Bridge";
import WalletConnect from "@walletconnect/client";
import { useState } from "react";

const WALLETCONNECT_RESERVED_EVENTS = [
  "session_request",
  "session_update",
  "exchange_key",
  "connect",
  "disconnect",
  "display_uri",
  "modal_closed",
  "transport_open",
  "transport_close",
  "transport_error",
] as const;

const WALLETCONNECT_SIGNING_METHODS = [
  "eth_sendTransaction",
  "eth_signTransaction",
  "eth_sign",
  "eth_signTypedData",
  "eth_signTypedData_v1",
  "eth_signTypedData_v2",
  "eth_signTypedData_v3",
  "eth_signTypedData_v4",
  "personal_sign",
  "wallet_addEthereumChain",
  "wallet_switchEthereumChain",
  "wallet_getPermissions",
  "wallet_requestPermissions",
  "wallet_registerOnboarding",
  "wallet_watchAsset",
  "wallet_scanQRCode",
] as const;

const WALLETCONNECT_STATE_METHODS = [
  "eth_accounts",
  "eth_chainId",
  "net_version",
] as const;

const appendLog = (log: any) => {
  console.log(JSON.stringify(log));
}

const showPrompt = (log: any) => {
  console.log(JSON.stringify(log));
}

export const useWalletConnect = () => {
  const { sdk, wallet, chain } = useBrillionContext();
  if(!sdk || !wallet || !chain) {
    throw new Error("Missing sdk, wallet or chain");
  }

  const [connector, setConnector] = useState<WalletConnect | null>()
  const eip1193 = new BrillionEip1193Bridge(wallet, Number(chain), sdk);

  const connect = async (uri: string) => {
    const connector = new WalletConnect({uri});
    setConnector(connector);

    [
      ...WALLETCONNECT_RESERVED_EVENTS,
      ...WALLETCONNECT_SIGNING_METHODS,
      ...WALLETCONNECT_STATE_METHODS,
    ].forEach((eventName) => {

      connector.on(eventName, async (error, payload) => {
        console.log("connector event", eventName, error, payload);
        
        const label = "`" + eventName + "`";

        if (error != null) {
          appendLog({
            label,
            data: `Error: ${error.message}`,
          });
          return;
        }

        switch (eventName) {
          case "session_request": {
            appendLog({
              label,
              data: `Handshaking with ${
                payload?.params?.[0]?.peerMeta?.url ?? "<unknown>"
              }`,
            });

            const userInput = await showPrompt({
              title: "WalletConnect Session Request",
              message: `Would you like to connect to the WalletConnect session?`,
              actionList: [
                {
                  id: "APPROVE",
                  title: "Approve",
                  type: "default",
                },
                {
                  id: "REJECT",
                  title: "Reject",
                  type: "cancel",
                },
              ],
            });

            // if (userInput.id === "APPROVE") {
            //   appendLog({
            //     label: "User action",
            //     data: "Approved connection request",
            //   });

              connector.approveSession({
                chainId: Number(chain),
                accounts: [wallet],
              });
            // } else if (userInput.id === "REJECT") {
            //   appendLog({
            //     label: "User action",
            //     data: "Rejected connection request",
            //   });

            //   connector.rejectSession({
            //     message: "User rejected request",
            //   });
            // }
            return;
          }
          case "connect": {
            appendLog({
              label,
              data: `Connected to ${
                payload?.params?.[0]?.peerMeta?.url ?? "<unknown>"
              }`,
            });
            return;
          }
          case "disconnect": {
            appendLog({
              label,
              data: "Session disconnected",
            });
            return;
          }
          case "eth_sendTransaction": {
            appendLog({
              label,
              data: payload,
            });

            const userInput = await showPrompt({
              title: `Request: ${label}`,
              message: `Would you like to approve this request?`,
              actionList: [
                {
                  id: "APPROVE",
                  title: "Approve",
                  type: "default",
                },
                {
                  id: "REJECT",
                  title: "Reject",
                  type: "cancel",
                },
              ],
            });

            // if (userInput.id === "APPROVE") {
              appendLog({
                label: "User action",
                data: "Approved request",
              });

              const { method, params } = payload;

              let txHash: string;
              try {
                txHash = await eip1193.send(
                  method,
                  params
                );
              } catch (error) {
                appendLog({
                  label,
                  data: `Error: ${(error as Error).message}`,
                });
                return;
              }

              connector.approveRequest({
                id: payload.id,
                result: txHash,
              });

              // const etherscanLink = getEtherscanUrl(`/tx/${txHash}`, network);

              appendLog({
                label: "Transaction sent",
                data: txHash,
              });
            // } else if (userInput.id === "REJECT") {
            //   appendLog({
            //     label: "User action",
            //     data: "Rejected request",
            //   });

            //   connector.rejectRequest({
            //     id: payload.id,
            //     error: {
            //       message: "User rejected request",
            //     },
            //   });
            // }
            return;
          }
        }

        appendLog({
          label: label + " (unimplemented)",
          data: payload,
        });
      });
    });
  }

  return {
    connect,
    connector,
    eip1193
  }

};
