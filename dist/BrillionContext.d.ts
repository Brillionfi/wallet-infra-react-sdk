import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
type BrillionContextType = {
    sdk: WalletInfra;
};
export declare const BrillionContext: import("react").Context<BrillionContextType | null>;
export declare const useBrillionContext: () => BrillionContextType;
export {};
