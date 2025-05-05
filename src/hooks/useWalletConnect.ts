import { useBrillionContext } from "@/components/BrillionContext";
import { parseUri } from "@walletconnect/utils"

export const useWalletConnect = ({
  onError
}: {
  onError: (message: string) => void;
}) => {
  const { wcClient } = useBrillionContext();  
  const connect = async (uri: string) => {
    if (!wcClient) {
      onError("WalletConnect client is not initialized");
      return;
    }
    if (!uri) {
      onError("Connection URI is missing");
      return;
    }
    
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
  
    try {
      console.log("WC: Connect URI: ", uri);
      await wcClient.pair({ uri });
    } catch (error) {
      console.error("Error during pairing:", error);
      onError("Failed to pair with the provided URI");
    }
  };

  return {
    connect,
  };
};
