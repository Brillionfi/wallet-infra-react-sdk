import { useBrillionContext } from "components/BrillionContext";
import BrillionEip1193Bridge from "@/utils/wagmi/brillionEip1193Bridge";

export const useWalletConnect = () => {
  const { sdk, wallet, chain } = useBrillionContext();

  if(!sdk || !wallet || !chain) {
    throw new Error("Missing sdk, wallet or chain");
  }

  let eip1193 = new BrillionEip1193Bridge(wallet, Number(chain), sdk);
};
