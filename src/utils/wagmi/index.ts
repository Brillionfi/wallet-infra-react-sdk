export * from "./brillionConnector";
export * from "./brillionProvider";
export * from "./brillionTransports";

import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

import { BrillionConnector } from "./brillionConnector";
import { BrillionTransport } from "./brillionTransports";

export const parseChain = (chain: number) => {
  return String(chain) as SUPPORTED_CHAINS;
};

export const hexToString = (hex: string) => {
  return BigInt(hex || "0x0").toString();
};

export const numberToHex = (number: number) => {
  return `0x${number.toString(16)}`;
};

export type BrillionProviderProps = {
  appId: string;
  baseUrl: string;
  WcProjectId: string;
  defaultNetwork?: number;
};

export const brillionWagmi = ({
  appId,
  baseUrl,
  defaultNetwork,
  WcProjectId,
}: BrillionProviderProps) => {
  const brillionConnector = BrillionConnector({
    appId,
    baseUrl,
    WcProjectId,
    defaultNetwork,
  });
  const brillionTransport = (chainId: number) => {
    return BrillionTransport(
      { appId, baseUrl, WcProjectId },
      chainId || defaultNetwork || 1,
    );
  };

  return {
    brillionConnector,
    brillionTransport,
  };
};
