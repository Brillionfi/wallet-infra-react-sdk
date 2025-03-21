import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
import { SDKProvider } from "@metamask/sdk";

import BrillionEip1193Bridge from "./brillionEip1193Bridge";
import { CustomProvider } from "./types";

export class BrillionProvider {
  address: string;
  chainId: number;
  provider: SDKProvider | CustomProvider;
  sdk: WalletInfra;

  constructor(address: string, chain: number, sdk: WalletInfra) {
    this.address = address;
    this.chainId = chain;
    this.sdk = sdk;
    this.provider = new BrillionEip1193Bridge(address, chain, sdk).provider;
  }
}

export default BrillionProvider;
