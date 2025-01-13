import { AuthProvider, WalletInfra } from '@brillionfi/wallet-infra-sdk';
import { ChainNotConfiguredError, createConnector } from '@wagmi/core'
import { jwtDecode } from '@/utils/jwtDecode';
import { IAuthURLParams, SUPPORTED_CHAINS } from '@brillionfi/wallet-infra-sdk/dist/models';
import { 
  type EIP1193RequestFn, 
  Chain, 
  custom, 
  RpcRequestError,
  SwitchChainError
} from 'viem';
import { rpc } from 'viem/utils'
import { AxiosError } from 'axios';

const hexToString = (hex: string) => {
  return parseInt(hex || "0x0", 16).toString()
}

const numberToHex = (number: number) => {
  return `0x${number.toString(16)}`
}

type BrillionProviderProps = {
  appId: string;
  baseUrl: string;
  WcProjectId: string;
  defaultNetwork?: number;
};

type eth_sendTransaction = {
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  data: string;
}

type wallet_switchEthereumChain = {
  chainId: string;
}

export type ConnectBrillionProps = {
  provider: AuthProvider,
  redirectUrl: string,
  email?: string,
};

export function BrillionConnector({appId, baseUrl, defaultNetwork, WcProjectId}: BrillionProviderProps) {
  const sdk = new WalletInfra(appId, baseUrl);

  const checkLogged = () =>{
    const params = new URLSearchParams(new URL(window.location.href).search);
    const code = params.get('code');
    if(code) {
      document.cookie = `brillion-session-wallet=${code}`;
    }
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find((strings) => strings.includes('brillion-session-wallet'));
    const jwt = sessionCookie?.split('=')[1];
    if (jwt) {
      const data = JSON.parse(jwtDecode(jwt.split(".")[1])) as Record<
        string,
        string
      >;
      if(Number(data.exp) * 1000 > Date.now()){
        sdk.authenticateUser(jwt);
        return true;
      }
    }
    document.cookie = 'brillion-session-wallet=';
    return false
  };

  return createConnector((config) => ({
    id: 'brillion',
    name: 'Brillion Connector',
    type: 'brillion',

    localData: {
      store: {} as Record<string, number | string | boolean | object>,
      set(key: string, value: number | string | boolean | object) {
        console.log("setea", key, value)
        this.store[key] = value;
      },
      get(key: string) {
        console.log("Get", key)
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
      this.localData.set('connectedChain', defaultNetwork!);
      const isLogged = checkLogged();
      if(isLogged){
        this.localData.set('connectedChain', defaultNetwork!);
        const wallets = await sdk.Wallet.getWallets();
        const connectedWallets = wallets.map((wallet) => wallet.address) as `0x${string}`[];
        this.localData.set('connectedWallets', connectedWallets);
      }
    },
    
    // FUNCTIONS
    async connect({ chainId, ...rest } = {}) {
      this.localData.set('connectedChain', chainId! || defaultNetwork!);
      const connectedChain = this.localData.get('connectedChain') as number;
      const isLogged = checkLogged();

      if(isLogged){
        const wallets = await sdk.Wallet.getWallets();
        const connectedWallets = wallets.map((wallet) => wallet.address) as `0x${string}`[];
        this.localData.set('connectedWallets', connectedWallets);
        return {
          accounts: connectedWallets,
          chainId: Number(connectedChain)
        };
      }else{
        if (!sdk) {
          throw new Error("AppId is not valid");
        }
        const data = rest as ConnectBrillionProps;
        let uri: string | undefined
        if (data.provider === AuthProvider.WALLET_CONNECT) {
          uri = await sdk.generateWalletConnectUri(
            WcProjectId,
            data.redirectUrl,
          );
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
        if(!uri) throw new Error("Error on login");
        window.location.href = uri;
        return {
          accounts: [],
          chainId: Number(1)
        };
      }
    },

    async disconnect() {
      document.cookie = 'brillion-session-wallet=';
      this.localData.clear();
    },

    async getAccounts() {
      const wallets = await sdk.Wallet.getWallets();
      this.localData.set('connectedWallets', wallets.map((wallet) => wallet.address) as `0x${string}`[]);
      const connectedWallets = this.localData.get('connectedWallets') as `0x${string}`[];
      return connectedWallets;
    },

    async getChainId () {
      const connectedChain = this.localData.get('connectedChain') as number;
      return connectedChain;
    },

    async getProvider({ chainId } = {}) {
      const connectedWallets = this.localData.get('connectedWallets') as `0x${string}`[];
      const connectedChain = this.localData.get('connectedChain') as number;

      console.log('getProvider :>> ', chainId);
      console.log('connectedWallets :>> ', connectedWallets);
      console.log('connectedChain :>> ', connectedChain);

      const chain = config.chains.find((x) => x.id === chainId) ?? config.chains[0]
      const url = chain.rpcUrls.default.http[0]!

      const request: EIP1193RequestFn = async ({ method, params }) => {
        console.log('request method:>> ', method);
        console.log('request params:>> ', params);

        switch (method) {
          case "eth_sendTransaction":
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
            const data = (params as eth_sendTransaction[])[0];
            try {
              return await sdk.Transaction.createTransaction({
                transactionType: "unsigned",
                from: connectedWallets[0],
                to: data.to,
                value: hexToString(data.value),
                data: hexToString(data.data),
                chainId: connectedChain.toString(),
              });
            } catch (error) {
              if(error instanceof AxiosError && error.response?.data.message.includes('Gas settings are not set')){
                // TODO - setGasConfig
                await sdk.Wallet.setGasConfig(connectedWallets[0], connectedChain as unknown as SUPPORTED_CHAINS, {
                  gasLimit: '1',
                  maxFeePerGas: '1',
                  maxPriorityFeePerGas: '1'
                })
                return await sdk.Transaction.createTransaction({
                  transactionType: "unsigned",
                  from: connectedWallets[0],
                  to: data.to,
                  value: hexToString(data.value),
                  data: hexToString(data.data),
                  chainId: connectedChain.toString(),
                });
              }
            }
          break;
          
          case 'eth_accounts': //Returns an array of accounts currently connected to the provider
          break;

          case 'eth_chainId': //Retrieves the current chain ID of the provider.
          break;

          case 'eth_blockNumber': //Returns the latest block number.
          break;

          case 'eth_getBalance': //Retrieves the balance of a given account.
            // "params": ["0xYourAddress", "latest"]
          break;

          case 'eth_getTransactionCount': //Retrieves the transaction count (nonce) for an account.
            // "params": ["0xYourAddress", "latest"]
          break;

          case 'eth_call': //Executes a read-only call on a smart contract.
            // "params": [
            //   {
            //     "to": "0xContractAddress",
            //     "data": "0xYourData"
            //   },
            //   "latest"
            // ]
          break;

          case 'eth_getTransactionReceipt': //Retrieves the receipt of a specific transaction.
            // "params": ["0xTransactionHash"]
          break;

          case 'eth_requestAccounts': //Prompts the user to connect their wallet and returns the selected accounts
          break;

          case 'eth_subscribe': //Subscribes to an event (e.g., new blocks or logs).
            // "params": ["newHeads"]
          break;

          case 'eth_unsubscribe': //Unsubscribes from an event.
            // "params": ["0xSubscriptionId"]
          break;

          case 'eth_sign': //Signs arbitrary data using the user’s private key
            // "params": ["0xYourAddress", "0xYourData"]
          break;

          case 'personal_sign': //Signs a message, adding a user-readable prefix for security.
            // "params": ["0xYourData", "0xYourAddress"]
          break;

          case 'eth_signTransaction': //Signs a transaction without sending it.
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
          break;

          case 'wallet_addEthereumChain': //Requests the wallet to add a new blockchain to its list of available networks
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
          break;

          case 'wallet_switchEthereumChain': //Requests to switch the user’s wallet to a different network
            // "params": [{ "chainId": "0x1" }]
            const chain = (params as wallet_switchEthereumChain[])[0].chainId;
            this.localData.set('connectedChain', hexToString(chain));
            this.onChainChanged(chain.toString())
            return chain;

          case 'net_version': //Retrieves the current network ID.
          break;

          case 'web3_clientVersion': //Returns the client software version.
          break;

          case 'web3_sha3': //Computes the Keccak-256 hash of the given data.
            // "params": ["0xYourData"]
          break;

          case 'eth_signTypedData_v4': //This is a standardized Ethereum JSON-RPC method for signing typed data using the user’s private key
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
          break;

          case 'wallet_watchAsset': //Allows users to add custom tokens (e.g., ERC-20) to their wallet for tracking balances
            // "params": {
            //   "type": "ERC20",
            //   "options": {
            //     "address": "0xTokenAddress",
            //     "symbol": "TKN",
            //     "decimals": 18,
            //     "image": "https://example.com/token-logo.png"
            //   }
            // }
          break;

          case 'wallet_requestPermissions': //Used to gain access to specific wallet functionality or data (e.g., accounts, methods).
            // "params": [{ "eth_accounts": {} }]
          break;

          case 'wallet_scanQRCode': //Facilitates interactions like scanning wallet addresses or connecting to other wallets.
          break;

          case 'wallet_getPermissions': //Checks what permissions the application currently has.
          break;

          case 'wallet_registerOnboarding': //Guides users to install or onboard with a specific wallet.
          break;

          case 'wallet_invokeSnap': //Extends wallet functionality using external scripts (Snaps).
            // "params": {
            //   "snapId": "npm:@metamask/example-snap",
            //   "request": { "method": "exampleMethod", "params": {} }
            // }
          break;

          case 'wallet_enable': //Deprecated method for connecting to the wallet.
          break;

          case 'wallet_getCapabilities':
          break;

          case 'wallet_sendCalls':
          break;

          case 'wallet_getCallsStatus': //Likely used to retrieve the status of calls (e.g., pending, successful, or failed transactions) associated with the wallet or dApp.
          break;

          case 'wallet_showCallsStatus':
          break;

          default:
            const body = { method, params }
            const { error, result } = await rpc.http(url, { body })
            if (error) throw new RpcRequestError({ body, error, url })
            return result
        }

      }
      return custom({ request })({ retryCount: 1 })
    },

    async isAuthorized () {
      return checkLogged();
    },

    // ---- OPTIONALS
    async getAccount () {
      const wallets = await sdk.Wallet.getWallets();
      return wallets[0].address as `0x${string}`;
    },

    // async getSigner () {
    //   // Implement your getSigner logic here
    // },

    async switchChain ({ chainId }) {
      console.log('switchChain chainId :>> ', chainId);
      const connectedChain = this.localData.get('connectedChain') as number;
      console.log('switchChain connectedChain :>> ', connectedChain);

      const provider = await this.getProvider();
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError())

      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: numberToHex(chainId) }] });
      
      return chain;
    },

    //EVENTS
    onAccountsChanged (accounts: `0x${string}`[]) {
      console.log('onAccountsChanged :>> ', accounts);
      if (accounts.length === 0) this.onDisconnect()
      else{
        this.localData.set('connectedWallets', accounts);
        config.emitter.emit('change', {
          accounts,
        })
      }
    },

    onChainChanged (chainId: string) {
      console.log('onChainChanged :>> ', chainId);
      this.localData.set('connectedChain', chainId);
      config.emitter.emit('change', { chainId: Number(chainId) })
    },

    onDisconnect () {
      document.cookie = 'brillion-session-wallet=';
      config.emitter.emit('disconnect');
    },
  
    // ---- OPTIONALS
    // onConnect (_message){
    //   // Implement your onMessage logic here
    // },
    // onMessage (_message){
    //   // Implement your onMessage logic here
    // },
  }))
}