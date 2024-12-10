import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

export interface INetworksSelectorProps {
  enableTestNetworks?: boolean;
  networks?: SUPPORTED_CHAINS[];
}

export const NETWORKS = SUPPORTED_CHAINS;
