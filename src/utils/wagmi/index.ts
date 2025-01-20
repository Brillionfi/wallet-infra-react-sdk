import { ChainIdSchema } from "@brillionfi/wallet-infra-sdk/dist/models";
import { BrillionConnector } from "./wagmiConnector";
import { BrillionTransport } from "./brillionTransports";

export * from "./wagmiConnector";
export * from "./brillionTransports";

export const parseChain = (chain: number) => {
  return ChainIdSchema.parse(chain);
}

export const hexToString = (hex: string) => {
  return parseInt(hex || "0x0", 16).toString()
}

export const numberToHex = (number: number) => {
  return `0x${number.toString(16)}`
}

export type BrillionProviderProps = {
  appId: string;
  baseUrl: string;
  WcProjectId: string;
  defaultNetwork?: number;
};

export const brillionWagmi = ({appId, baseUrl, defaultNetwork, WcProjectId}: BrillionProviderProps) => {
  const brillionConnector = BrillionConnector({appId, baseUrl, WcProjectId, defaultNetwork});
  const brillionTransport = (chainId: number) => {
    return BrillionTransport({appId, baseUrl}, chainId || defaultNetwork || 1);
  }

  return {
    brillionConnector,
    brillionTransport
  }
}