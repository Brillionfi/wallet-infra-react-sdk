import { jwtDecode } from "@/utils/jwtDecode";
import { AuthProvider, WalletInfra } from "@brillionfi/wallet-infra-sdk";
import {
  IAuthURLParams,
  WalletFormats,
  WalletTypes,
} from "@brillionfi/wallet-infra-sdk/dist/models";
import MetaMaskSDK, { SDKProvider } from "@metamask/sdk";
import {
  ChainNotConfiguredError,
  Connector,
  createConnector,
} from "@wagmi/core";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Client, { SignClient } from '@walletconnect/sign-client';
import { AxiosError } from "axios";
import { BrowserProvider, keccak256, Listener, Transaction } from "ethers";
import {
  custom,
  RpcRequestError,
  SwitchChainError,
  type EIP1193RequestFn,
} from "viem";
import { rpc } from "viem/utils";

import { BrillionProviderProps, hexToString, numberToHex, parseChain } from ".";
import { getAuthentication } from "../authentication";

type eth_sendTransaction = {
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  data: string;
};

type eth_signTransaction = {
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  data: string;
};

type wallet_switchEthereumChain = {
  chainId: string;
};

type eth_call = [
  {
    to: string;
    data: string;
  },
  string,
];

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
  const mmSDK = new MetaMaskSDK();
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
      window.history.replaceState({}, '', url.toString());
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
        if(data.loggedInVia === AuthProvider.WALLET_CONNECT) {
          wcSDK = await SignClient.init({
            relayUrl: 'wss://relay.walletconnect.com',
            projectId: WcProjectId,
            metadata: {
              name: 'Brillion',
              description: 'Brillion Wallet',
              url: 'https://brillion.finance',
              icons: [''], // TODO add brillion icon
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
          (wallet) => wallet.address,
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
          (wallet) => wallet.address,
        ) as `0x${string}`[];

        if (!connectedWallets || connectedWallets.length === 0) {
          await sdk.Wallet.createWallet({
            name: data.walletName ?? "Wallet",
            format: WalletFormats.ETHEREUM,
            authentication: await getAuthentication(window.location.hostname),
          });
        }

        connectedWallets = wallets.map(
          (wallet) => wallet.address,
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
                methods: ['eth_chainId', 'eth_sendTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData', 'wallet_switchEthereumChain'],
                chains: ['eip155:1'],
                events: ['connect', 'disconnect', 'accountsChanged', 'chainChanged']
              }
            },
            optionalNamespaces: {
              eip155: {
                methods: ['eth_chainId', 'eth_sendTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData', 'wallet_switchEthereumChain'],
                chains: ['eip155:137', 'eip155:11155111', '80002', 'eip155:1'],
                events: ['connect', 'disconnect', 'accountsChanged', 'chainChanged']
              }
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

    async getProvider({ chainId } = {}) {
      if (chainId) await this.switchChain?.({ chainId });
      const connectedWallets = this.localData.get(
        "connectedWallets",
      ) as `0x${string}`[];
      const connectedChain = this.localData.get("connectedChain") as number;
      const sessionData = getSessionData();

      const chain =
        config.chains.find((x) => x.id === chainId) ?? config.chains[0];
      const url = chain.rpcUrls.default.http[0]!;

      const request: EIP1193RequestFn = async ({ method, params }) => {
        if (!(await await checkLogged())) throw new Error("User not logged in");
        switch (method) {
          case "eth_sendTransaction": {
            // "params": [
            //   {
            //     "from": "0xYourAddress",
            //     "to": "0xRecipientAddress",
            //     "value": "0xValue",
            //     "gas": "0xGasLimit",
            //     "gasPrice": "0xGasPrice",
            //     "data": "0xData"
            //   }
            // ]
            const sendTransactionData = (params as eth_sendTransaction[])[0];
            try {
              return await sdk.Transaction.createTransaction({
                transactionType: "unsigned",
                from: connectedWallets[0],
                to: sendTransactionData.to,
                value: hexToString(sendTransactionData.value),
                data: sendTransactionData.data.toString(),
                chainId: connectedChain.toString(),
              });
            } catch (error) {
              if (
                error instanceof AxiosError &&
                error.response?.data.message.includes(
                  "Gas settings are not set",
                )
              ) {
                // TODO - setGasConfig
                await sdk.Wallet.setGasConfig(
                  connectedWallets[0],
                  parseChain(connectedChain),
                  {
                    gasLimit: "9631345750",
                    maxFeePerGas: "9631345750",
                    maxPriorityFeePerGas: "9631345750",
                  },
                );
                return await sdk.Transaction.createTransaction({
                  transactionType: "unsigned",
                  from: connectedWallets[0],
                  to: sendTransactionData.to,
                  value: hexToString(sendTransactionData.value),
                  data: sendTransactionData.data.toString(),
                  chainId: connectedChain.toString(),
                });
              }
            }
            break;
          }

          case "eth_accounts": {
            //Returns an array of accounts currently connected to the provider
            return connectedWallets;
          }

          case "eth_chainId": {
            //Retrieves the current chain ID of the provider.
            return numberToHex(connectedChain);
          }

          case "eth_blockNumber": {
            //Returns the latest block number.
            return await sdk.Wallet.rpcRequest(
              { method },
              { chainId: parseChain(connectedChain) },
            );
          }

          case "eth_getBalance": {
            //Retrieves the balance of a given account.
            // "params": ["0xYourAddress", "latest"]
            return await sdk.Wallet.rpcRequest(
              { method, params: params as string[] },
              { chainId: parseChain(connectedChain) },
            );
          }

          case "eth_getTransactionCount": {
            //Retrieves the transaction count (nonce) for an account.
            // "params": ["0xYourAddress", "latest"]
            return await sdk.Wallet.getNonce(
              connectedWallets[0],
              parseChain(connectedChain),
            );
          }

          case "eth_call": {
            //Executes a read-only call on a smart contract.
            // "params": [
            //   {
            //     "to": "0xContractAddress",
            //     "data": "0xYourData"
            //   },
            //   "latest"
            // ]
            return await sdk.Wallet.rpcRequest(
              { method, params: params as eth_call },
              { chainId: parseChain(connectedChain) },
            );
          }

          case "eth_getTransactionReceipt": {
            //Retrieves the receipt of a specific transaction.
            // "params": ["0xTransactionHash"]
            return await sdk.Wallet.rpcRequest(
              { method, params: params as string[] },
              { chainId: parseChain(connectedChain) },
            );
          }

          case "eth_requestAccounts": {
            //Prompts the user to connect their wallet and returns the selected accounts
            return connectedWallets;
          }

          case "wallet_switchEthereumChain": {
            //Requests to switch the user’s wallet to a different network
            // "params": [{ "chainId": "0x1" }]
            const chain = (params as wallet_switchEthereumChain[])[0].chainId;
            this.localData.set("connectedChain", hexToString(chain));
            this.onChainChanged(chain.toString());
            return chain;
          }

          case "net_version": {
            //Retrieves the current network ID.
            return await sdk.Wallet.rpcRequest(
              { method },
              { chainId: parseChain(connectedChain) },
            );
          }

          case "web3_clientVersion": {
            //Returns the client software version.
            return "Brillion Wallet v3";
          }

          case "web3_sha3": {
            //Computes the Keccak-256 hash of the given data.
            // "params": ["0xYourData"]
            const hash = keccak256((params as string[])[0]);
            return hash;
          }

          case "eth_signTransaction": {
            //Signs a transaction without sending it.
            // "params": [
            //   {
            //     "from": "0xYourAddress",
            //     "to": "0xRecipientAddress",
            //     "value": "0xValue",
            //     "gas": "0xGasLimit",
            //     "gasPrice": "0xGasPrice",
            //     "data": "0xData"
            //   }
            // ]
            const signTransactionData = (params as eth_signTransaction[])[0];
            const txDetails = Transaction.from(signTransactionData);
            const response = await sdk.Wallet.signTransaction(
              signTransactionData.from,
              {
                walletFormat: WalletFormats.ETHEREUM,
                walletType: WalletTypes.EOA,
                unsignedTransaction: txDetails.serialized,
              },
              window.location.origin,
            );
            if (response.needsApproval) {
              return "Transaction created, but needs another approval";
            } else {
              return response.signedTransaction;
            }
          }
          case "eth_signTypedData_v4": {
            //This is a standardized Ethereum JSON-RPC method for signing typed data using the user’s private key
            // "params": [
            //   "0xYourAddress", // Address of the signer
            //   JSON.stringify({
            //     "types": {
            //       "EIP712Domain": [
            //         { "name": "name", "type": "string" },
            //         { "name": "version", "type": "string" },
            //         { "name": "chainId", "type": "uint256" },
            //         { "name": "verifyingContract", "type": "address" }
            //       ],
            //       "Person": [
            //         { "name": "name", "type": "string" },
            //         { "name": "wallet", "type": "address" }
            //       ]
            //     },
            //     "primaryType": "Person",
            //     "domain": {
            //       "name": "MyApp",
            //       "version": "1",
            //       "chainId": 1,
            //       "verifyingContract": "0xContractAddress"
            //     },
            //     "message": {
            //       "name": "John Doe",
            //       "wallet": "0xWalletAddress"
            //     }
            //   })
            // ]
            throw new Error("method not supported");
          }
          case "eth_sign": {
            //Signs arbitrary data using the user’s private key
            // "params": ["0xYourAddress", "0xYourData"]
            throw new Error("method not supported");
          }
          case "personal_sign": {
            //Signs a message, adding a user-readable prefix for security.
            // "params": ["0xYourData", "0xYourAddress"]
            throw new Error("method not supported");
          }
          case "wallet_watchAsset": {
            //Allows users to add custom tokens (e.g., ERC-20) to their wallet for tracking balances
            // "params": {
            //   "type": "ERC20",
            //   "options": {
            //     "address": "0xTokenAddress",
            //     "symbol": "TKN",
            //     "decimals": 18,
            //     "image": "https://example.com/token-logo.png"
            //   }
            // }
            throw new Error("method not supported");
          }
          case "wallet_requestPermissions": {
            //Used to gain access to specific wallet functionality or data (e.g., accounts, methods).
            // "params": [{ "eth_accounts": {} }]
            throw new Error("method not supported");
          }
          case "wallet_scanQRCode": {
            //Facilitates interactions like scanning wallet addresses or connecting to other wallets.
            throw new Error("method not supported");
          }
          case "wallet_getPermissions": {
            //Checks what permissions the application currently has.
            throw new Error("method not supported");
          }
          case "wallet_registerOnboarding": {
            //Guides users to install or onboard with a specific wallet.
            throw new Error("method not supported");
          }
          case "wallet_invokeSnap": {
            //Extends wallet functionality using external scripts (Snaps).
            // "params": {
            //   "snapId": "npm:@metamask/example-snap",
            //   "request": { "method": "exampleMethod", "params": {} }
            // }
            throw new Error("method not supported");
          }
          case "wallet_enable": {
            //Deprecated method for connecting to the wallet.
            throw new Error("method not supported");
          }
          case "wallet_getCapabilities": {
            throw new Error("method not supported");
          }
          case "wallet_sendCalls": {
            throw new Error("method not supported");
          }
          case "wallet_getCallsStatus": {
            //Likely used to retrieve the status of calls (e.g., pending, successful, or failed transactions) associated with the wallet or dApp.
            throw new Error("method not supported");
          }
          case "wallet_showCallsStatus": {
            throw new Error("method not supported");
          }
          case "wallet_addEthereumChain": {
            //Requests the wallet to add a new blockchain to its list of available networks
            // "params": [
            //   {
            //     "chainId": "0x89",
            //     "chainName": "Polygon Mainnet",
            //     "rpcUrls": ["https://polygon-rpc.com/"],
            //     "nativeCurrency": {
            //       "name": "MATIC",
            //       "symbol": "MATIC",
            //       "decimals": 18
            //     }
            //   }
            // ]
            throw new Error("method not supported");
          }
          default: {
            const body = { method, params };
            const { error, result } = await rpc.http(url, { body });
            if (error) throw new RpcRequestError({ body, error, url });
            return result;
          }
        }
      };

      if (sessionData.loggedInVia === AuthProvider.METAMASK) {
        const ethereum = mmSDK.getProvider();
        if (!ethereum) {
          throw new Error("No MetaMask provider found");
        }
        return ethereum;
      }
      if(sessionData.loggedInVia === AuthProvider.WALLET_CONNECT) {
        const wcRequest: EIP1193RequestFn = async ({ method, params }) => {
          const connectedChain = this.localData.get("connectedChain") as number;
          const lastKeyIndex = wcSDK.session.getAll().length - 1;
          const session = wcSDK.session.getAll()[lastKeyIndex];
          return wcSDK.request({
            topic: session.topic,
            chainId: 'eip155:'+ connectedChain,
            request: {
              method,
              params: params ?? [],
            },
          });
        }
        return custom({ request: wcRequest })({ retryCount: 1 });
      }
      return custom({ request })({ retryCount: 1 });
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
        wallets.map((wallet) => wallet.address) as `0x${string}`[],
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
      return wallets[0].address as `0x${string}`;
    },

    async getSigner() {
      const sessionData = getSessionData();
      if (sessionData.loggedInVia === AuthProvider.METAMASK) {
        const provider = new BrowserProvider((await this.getProvider()) as SDKProvider);
        return await provider.getSigner();
      }
      return "getSigner method not supported";
    },

    async switchChain({ chainId }) {
      const provider = await this.getProvider();
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
      this.localData.set("connectedChain", String(chainId));

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHex(chainId) }],
      });
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
      this.localData.set("connectedChain", chainId);
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
