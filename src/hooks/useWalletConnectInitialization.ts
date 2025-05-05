import { createWalletKit } from "@/utils/walletConnect";
import { useCallback, useEffect, useState } from "react";

export function useWalletConnectInitialization(WCProjectId?: string) {
  const [wcInitialized, setWcInitialized] = useState<boolean>(false);
  const [walletConnectProjectId, setWalletConnectProjectId] = useState<string>("");
  
  
  const onInitializeWC = useCallback(async () => {
      if (!WCProjectId) return;
      try {
        await createWalletKit(WCProjectId);
        setWcInitialized(true);
        setWalletConnectProjectId(WCProjectId);
      } catch (error) {
        console.error("Failed to initialize WalletConnect: ", error);
      }
    }, [WCProjectId]);

    useEffect(() => {
        if (!wcInitialized) {
          onInitializeWC();
        }
      }, [wcInitialized, onInitializeWC, WCProjectId]);

  return {
    walletConnectProjectId,
    wcInitialized,
  }
};
