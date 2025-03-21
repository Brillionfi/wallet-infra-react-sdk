import { useBrillionContext } from "components/BrillionContext";
import BrillionEip1193Bridge from "@/utils/wagmi/brillionEip1193Bridge";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";
import { ErrorResponse } from "@walletconnect/jsonrpc-types/dist/types/jsonrpc";

export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction'
}

export const useWalletConnect = () => {
  const { sdk, signer, chain, wcClient } = useBrillionContext();
  if(!sdk || !signer || !chain) {
    throw new Error("Missing configuration");
  }

  const eip1193 = new BrillionEip1193Bridge(signer, Number(chain), sdk);

  const connect = async (uri: string) => {
    if(!wcClient) {
      throw new Error("Client not initialized");
    }
    
    wcClient.on("session_proposal", async (proposal) => {
      const accounts = Object.values(SUPPORTED_CHAINS).map(chain => `eip155:${chain}:${signer}`)
      const methods =  ['eth_sendTransaction', 'eth_accounts', 'eth_chainId', 'eth_estimateGas', 'eth_blockNumber', 'eth_getBalance', 'eth_getTransactionCount', 'wallet_switchEthereumChain', 'eth_signTransaction', 'eth_signTypedData_v4', 'eth_sign', 'personal_sign'];
      const events = ['connect', 'disconnect'];
      await wcClient.approveSession({
        id: proposal.id,
        namespaces: {
          eip155: {
            accounts,
            methods,
            events
          }
        },
      });
    });

    wcClient.on('session_request', async (requestEvent) => {
      try {
        console.log('session_request', requestEvent)
        const { params } = requestEvent
        const { request } = params
        const response = await eip1193.send(request.method, request.params);
        console.log('response :>> ', response);
        await wcClient.respondSessionRequest({
          topic: requestEvent.topic,
          response: {
            id: requestEvent.id,
            jsonrpc: "2.0",
            result: response
          }
        })
      } catch (error) {
        await wcClient.respondSessionRequest({
          topic: requestEvent.topic,
          response: {
            id: requestEvent.id,
            jsonrpc: "2.0",
            error: error as ErrorResponse
          }
        })
      }
    })

    wcClient.on('session_delete', data => {
      console.log('session_delete', data)
    })

    await wcClient.pair({ uri });
  }

  return {
    connect,
    eip1193
  }
};
