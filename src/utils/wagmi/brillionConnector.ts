import { jwtDecode } from "@/utils/jwtDecode";
import { AuthProvider, WalletInfra } from "@brillionfi/wallet-infra-sdk";
import {
  IAuthURLParams,
  WalletFormats,
} from "@brillionfi/wallet-infra-sdk/dist/models";
import MetaMaskSDK, { SDKProvider } from "@metamask/sdk";
import {
  ChainNotConfiguredError,
  Connector,
  createConnector,
} from "@wagmi/core";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Client, { SignClient } from "@walletconnect/sign-client";
import {
  BrowserProvider,
  Listener,
} from "ethers";
import {
  custom,
  SwitchChainError,
  type EIP1193RequestFn,
} from "viem";

import { BrillionProviderProps, numberToHex } from ".";
import { BrillionSigner } from "./brillionSigner";
import {
  CustomProvider,
} from "./types";
import BrillionEip1193Bridge from "./brillionEip1193Bridge";

export type ConnectBrillionProps = {
  provider: AuthProvider;
  redirectUrl: string;
  walletName?: string;
  email?: string;
};

export function BrillionConnector({
  appId,
  baseUrl,
  defaultNetwork,
  WcProjectId,
}: BrillionProviderProps) {
  let accountsChanged: Connector["onAccountsChanged"] | undefined;
  let chainChanged: Connector["onChainChanged"] | undefined;
  let connect: Connector["onConnect"] | undefined;
  let disconnect: Connector["onDisconnect"] | undefined;

  const sdk = new WalletInfra(appId, baseUrl);
  const mmSDK = new MetaMaskSDK({
    dappMetadata: {
      name: "Brillion",
      url: "https://brillion.finance",
      iconUrl: "", // TODO add brillion icon
    },
  });
  let wcSDK: Client;

  const getSessionData = () => {
    const cookies = document.cookie.split(";");
    const rawSession = cookies.find((strings) =>
      strings.includes("brillion-session-data"),
    );
    if (rawSession) return JSON.parse(rawSession.split("=")[1]!);
    return {};
  };

  const checkLogged = async () => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
      document.cookie = `brillion-session-jwt=${code}`;
      url.searchParams.delete("code");
      window.history.replaceState({}, "", url.toString());
    }

    const cookies = document.cookie.split(";");
    const sessionCookie = cookies.find((strings) =>
      strings.includes("brillion-session-jwt"),
    );
    const jwt = sessionCookie?.split("=")[1];
    if (jwt) {
      const data = JSON.parse(jwtDecode(jwt.split(".")[1])) as Record<
        string,
        string
      >;
      document.cookie = `brillion-session-data=${JSON.stringify(data)}`;

      if (Number(data.exp) * 1000 > Date.now()) {
        if (data.loggedInVia === AuthProvider.METAMASK) {
          mmSDK.connect();
        }
        if (data.loggedInVia === AuthProvider.WALLET_CONNECT) {
          wcSDK = await SignClient.init({
            relayUrl: "wss://relay.walletconnect.com",
            projectId: WcProjectId,
            metadata: {
              name: "Brillion",
              description: "Brillion Wallet",
              url: "https://brillion.finance",
              icons: [""], // TODO add brillion icon
            },
          });
          await wcSDK.session.init();
        }
        sdk.authenticateUser(jwt);
        return true;
      }
    }
    document.cookie = "brillion-session-jwt=";
    return false;
  };

  return createConnector((config) => ({
    id: "brillion",
    name: "Brillion Connector",
    type: "brillion",

    localData: {
      store: {} as Record<string, number | string | boolean | object>,
      set(key: string, value: number | string | boolean | object) {
        this.store[key] = value;
      },
      get(key: string) {
        return this.store[key];
      },
      remove(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    },

    async setup() {
      this.localData.set("connectedChain", defaultNetwork!);
      const isLogged = await checkLogged();
      if (isLogged) {
        const wallets = await sdk.Wallet.getWallets();
        const connectedWallets = wallets.map(
          (wallet) => wallet.signer,
        ) as `0x${string}`[];
        this.localData.set("connectedWallets", connectedWallets);
      }
    },

    // FUNCTIONS
    async connect({ chainId, ...rest } = {}) {
      const connectedChain = this.localData.get("connectedChain") as number;

      if (chainId && connectedChain !== chainId) {
        this.localData.set("connectedChain", chainId! || defaultNetwork!);
        await this.switchChain?.({ chainId });
      }
      const isLogged = await checkLogged();
      const data = rest as ConnectBrillionProps;

      if (isLogged) {
        const wallets = await sdk.Wallet.getWallets();
        let connectedWallets = wallets.map(
          (wallet) => wallet.signer,
        ) as `0x${string}`[];

        if (!connectedWallets || connectedWallets.length === 0) {
          await sdk.Wallet.createWallet({
            name: data.walletName ?? "Wallet",
            format: WalletFormats.ETHEREUM,
            // authentication: await getAuthentication(window.location.hostname),
          });
        }

        connectedWallets = wallets.map(
          (wallet) => wallet.signer,
        ) as `0x${string}`[];
        this.localData.set("connectedWallets", connectedWallets);
        return {
          accounts: connectedWallets,
          chainId: Number(connectedChain),
        };
      } else {
        if (!sdk) {
          throw new Error("AppId is not valid");
        }
        let uri: string | undefined;
        if (data.provider === AuthProvider.WALLET_CONNECT) {
          uri = await sdk.generateWalletConnectUri({
            projectId: WcProjectId,
            redirectUrl: data.redirectUrl,
            requiredNamespaces: {
              eip155: {
                methods: [
                  "eth_chainId",
                  "eth_sendTransaction",
                  "eth_sign",
                  "personal_sign",
                  "eth_signTypedData",
                  "wallet_switchEthereumChain",
                ],
                chains: ["eip155:11155111"],
                events: [
                  "connect",
                  "disconnect",
                  "accountsChanged",
                  "chainChanged",
                ],
              },
            },
            optionalNamespaces: {
              eip155: {
                methods: [
                  "eth_chainId",
                  "eth_sendTransaction",
                  "eth_sign",
                  "personal_sign",
                  "eth_signTypedData",
                  "wallet_switchEthereumChain",
                ],
                chains: [
                  "eip155:137",
                  "eip155:11155111",
                  "eip155:80002",
                  "eip155:1",
                ],
                events: [
                  "connect",
                  "disconnect",
                  "accountsChanged",
                  "chainChanged",
                ],
              },
            },
          });
          QRCodeModal.open(uri!, () => {});
          sdk.onConnectWallet((authUrl: unknown) => {
            window.location.href = authUrl as string;
          });
        } else {
          const params: IAuthURLParams = {
            provider: data.provider,
            redirectUrl: data.redirectUrl,
          };
          if (data.email) params.email = data.email;
          uri = await sdk.generateAuthUrl(params);
        }
        if (!uri) throw new Error("Error on login");
        window.location.href = uri;

        return {
          accounts: [],
          chainId: Number(1),
        };
      }
    },

    async getProvider({ chainId } = {}): Promise<SDKProvider | CustomProvider> {
      if (chainId) await this.switchChain?.({ chainId });
      const connectedWallets = this.localData.get(
        "connectedWallets",
      ) as `0x${string}`[];
      const connectedChain = this.localData.get("connectedChain") as number;
      const sessionData = getSessionData();
      if (!(await checkLogged())) throw new Error("User not logged in");

      if (sessionData.loggedInVia === AuthProvider.METAMASK) {
        const ethereum = mmSDK.getProvider();
        if (!ethereum) {
          throw new Error("No MetaMask provider found");
        }
        return ethereum;
      }

      if (sessionData.loggedInVia === AuthProvider.WALLET_CONNECT) {
        const wcRequest: EIP1193RequestFn = async ({ method, params }) => {
          const connectedChain = this.localData.get("connectedChain") as number;
          const lastKeyIndex = wcSDK.session.getAll().length - 1;
          const session = wcSDK.session.getAll()[lastKeyIndex];
          return wcSDK.request({
            topic: session.topic,
            chainId: "eip155:" + connectedChain,
            request: {
              method,
              params: params ?? [],
            },
          });
        };
        return custom({ request: wcRequest })({ retryCount: 1 });
      }

      return new BrillionEip1193Bridge(connectedWallets[0], connectedChain, sdk).provider;
    },

    async disconnect() {
      const sessionData = getSessionData();
      if (sessionData.loggedInVia === AuthProvider.METAMASK) {
        const provider = (await this.getProvider()) as SDKProvider;
        if (chainChanged) {
          provider.removeListener("chainChanged", chainChanged);
          chainChanged = undefined;
        }
        if (disconnect) {
          provider.removeListener("disconnect", disconnect);
          disconnect = undefined;
        }
        if (!connect) {
          connect = this.onConnect.bind(this);
          provider.on("connect", connect as Listener);
        }
      }

      document.cookie = "brillion-session-jwt=";
      this.localData.clear();
      this.onDisconnect();
    },

    async getAccounts() {
      const wallets = await sdk.Wallet.getWallets();
      this.localData.set(
        "connectedWallets",
        wallets.map((wallet) => wallet.signer) as `0x${string}`[],
      );
      const connectedWallets = this.localData.get(
        "connectedWallets",
      ) as `0x${string}`[];
      return connectedWallets;
    },

    async getChainId() {
      const provider = (await this.getProvider()) as SDKProvider;
      const chainId = await provider.request({ method: "eth_chainId" });
      return Number(chainId);
    },

    async isAuthorized() {
      return await checkLogged();
    },

    // ---- OPTIONALS
    async getAccount() {
      const wallets = await sdk.Wallet.getWallets();
      return wallets[0].signer as `0x${string}`;
    },

    async getSigner() {
      const sessionData = getSessionData();
      if (sessionData.loggedInVia === AuthProvider.METAMASK) {
        const provider = new BrowserProvider(
          (await this.getProvider()) as SDKProvider,
        );
        return await provider.getSigner();
      }

      return new BrillionSigner(
        await this.getAccount(),
        await this.getProvider(),
        sdk,
      );
    },

    async switchChain({ chainId }) {
      const provider = await this.getProvider();
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
      this.localData.set("connectedChain", chainId);

      if (typeof provider.request === "function") {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHex(chainId) }],
        });
      } else {
        throw new Error("Provider does not support request method");
      }
      this.onChainChanged(chainId.toString());
      return chain;
    },

    //EVENTS
    onAccountsChanged(accounts: `0x${string}`[]) {
      if (accounts.length === 0) {
        this.onDisconnect();
        this.localData.clear();
      } else {
        this.localData.set("connectedWallets", accounts);
        config.emitter.emit("change", {
          accounts,
        });
      }
    },

    onChainChanged(chainId: string) {
      this.localData.set("connectedChain", Number(chainId));
      config.emitter.emit("change", { chainId: Number(chainId) });
    },

    onDisconnect() {
      document.cookie = "brillion-session-jwt=";
      document.cookie = "brillion-session-data=";
      this.localData.clear();
      config.emitter.emit("disconnect");
    },

    async onConnect(connectInfo) {
      const accounts = await this.getAccounts();
      if (accounts.length === 0) return;
      const chainId = Number(connectInfo.chainId);
      config.emitter.emit("connect", { accounts, chainId });

      const sessionData = getSessionData();
      if (sessionData.loggedInVia === AuthProvider.METAMASK) {
        const provider = (await this.getProvider()) as SDKProvider;
        if (connect) {
          provider.removeListener("connect", connect);
          connect = undefined;
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on("accountsChanged", accountsChanged as Listener);
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this);
          provider.on("chainChanged", chainChanged as Listener);
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this);
          provider.on("disconnect", disconnect as Listener);
        }
      }
    },
  }));
}
