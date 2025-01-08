import { AuthProvider, WalletInfra } from '@brillionfi/wallet-infra-sdk';
import { createConnector, custom } from '@wagmi/core'
import { jwtDecode } from '@/utils/jwtDecode';
import { IAuthURLParams } from '@brillionfi/wallet-infra-sdk/dist/models';

type BrillionProviderProps = {
  appId: string;
  baseUrl: string;
  WcProjectId: string;
  defaultNetwork?: number;
};

export type ConnectBrillionProps = {
  provider: AuthProvider,
  redirectUrl: string,
  email?: string,
};

export function BrillionConnector({appId, baseUrl, defaultNetwork, WcProjectId}: BrillionProviderProps) {
  const sdk = new WalletInfra(appId, baseUrl);
  let currentChain = defaultNetwork || 1;
  let currentWallets = [];

  const isLogged = (() =>{
    const params = new URLSearchParams(new URL(window.location.href).search);
    const code = params.get('code');
    if(code) {
      document.cookie = `brillion-session-wallet=${code}`;
    }
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find((strings) => strings.includes('brillion-session-wallet'));
    const jwt = sessionCookie?.split('=')[1];
    if (jwt) {
      console.log('jwt :>> ', jwt);
      const data = JSON.parse(jwtDecode(jwt.split(".")[1])) as Record<
        string,
        string
      >;
      if(Number(data.exp) > Date.now()){
        console.log("authenticated");
        sdk.authenticateUser(jwt);
        return true;
      }
    }
    return false
  })();
  
  return createConnector((_config) => ({
    id: 'brillion',
    name: 'Brillion Connector',
    type: 'brillion',
    
    // FUNCTIONS
    async connect({ chainId, ...rest } = {}) {
        currentChain = chainId || currentChain;
      if(isLogged){
        const wallets = await sdk.Wallet.getWallets();
        console.log('wallets :>> ', wallets);
        currentWallets = wallets.map((wallet) => wallet.address) as `0x${string}`[]

        return {
          accounts: currentWallets,
          chainId: Number(currentChain)
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
    },

    async getAccounts() {
      const wallets = await sdk.Wallet.getWallets();
      console.log('wallets :>> ', wallets);
      currentWallets = wallets.map((wallet) => wallet.address) as `0x${string}`[]
      return currentWallets;
    },

    async getChainId () {
      return currentChain;
    },

    async getProvider() {
      const request = async (data: any) => {
        console.log('data :>> ', data);
        // eth methods
        // if (method === 'eth_chainId') return numberToHex(connectedChainId)
        // if (method === 'eth_requestAccounts') return parameters.accounts
      //   if (method === 'eth_signTypedData_v4')
      //     if (features.signTypedDataError) {
      //       if (typeof features.signTypedDataError === 'boolean')
      //         throw new UserRejectedRequestError(
      //           new Error('Failed to sign typed data.'),
      //         )
      //       throw features.signTypedDataError
      //     }

      //   // wallet methods
      //   if (method === 'wallet_switchEthereumChain') {
      //     if (features.switchChainError) {
      //       if (typeof features.switchChainError === 'boolean')
      //         throw new UserRejectedRequestError(
      //           new Error('Failed to switch chain.'),
      //         )
      //       throw features.switchChainError
      //     }
      //     type Params = [{ chainId: Hex }]
      //     connectedChainId = fromHex((params as Params)[0].chainId, 'number')
      //     this.onChainChanged(connectedChainId.toString())
      //     return
      //   }

      //   if (method === 'wallet_watchAsset') {
      //     if (features.watchAssetError) {
      //       if (typeof features.watchAssetError === 'boolean')
      //         throw new UserRejectedRequestError(
      //           new Error('Failed to switch chain.'),
      //         )
      //       throw features.watchAssetError
      //     }
      //     return connected
      //   }

      //   if (method === 'wallet_getCapabilities')
      //     return {
      //       '0x2105': {
      //         paymasterService: {
      //           supported:
      //             (params as [Hex])[0] ===
      //             '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      //         },
      //         sessionKeys: {
      //           supported: true,
      //         },
      //       },
      //       '0x14A34': {
      //         paymasterService: {
      //           supported:
      //             (params as [Hex])[0] ===
      //             '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      //         },
      //       },
      //     }

      //   if (method === 'wallet_sendCalls') {
      //     const hashes = []
      //     const calls = (params as any)[0].calls
      //     for (const call of calls) {
      //       const { result, error } = await rpc.http(url, {
      //         body: {
      //           method: 'eth_sendTransaction',
      //           params: [call],
      //         },
      //       })
      //       if (error)
      //         throw new RpcRequestError({
      //           body: { method, params },
      //           error,
      //           url,
      //         })
      //       hashes.push(result)
      //     }
      //     const id = keccak256(stringToHex(JSON.stringify(calls)))
      //     transactionCache.set(id, hashes)
      //     return id
      //   }

      //   if (method === 'wallet_getCallsStatus') {
      //     const hashes = transactionCache.get((params as any)[0])
      //     if (!hashes) return null
      //     const receipts = await Promise.all(
      //       hashes.map(async (hash) => {
      //         const { result, error } = await rpc.http(url, {
      //           body: {
      //             method: 'eth_getTransactionReceipt',
      //             params: [hash],
      //             id: 0,
      //           },
      //         })
      //         if (error)
      //           throw new RpcRequestError({
      //             body: { method, params },
      //             error,
      //             url,
      //           })
      //         if (!result) return null
      //         return {
      //           blockHash: result.blockHash,
      //           blockNumber: result.blockNumber,
      //           gasUsed: result.gasUsed,
      //           logs: result.logs,
      //           status: result.status,
      //           transactionHash: result.transactionHash,
      //         } satisfies WalletCallReceipt
      //       }),
      //     )
      //     if (receipts.some((x) => !x))
      //       return { status: 'PENDING', receipts: [] }
      //     return { status: 'CONFIRMED', receipts }
      //   }

      //   if (method === 'wallet_showCallsStatus') return

      //   // other methods
      //   if (method === 'personal_sign') {
      //     if (features.signMessageError) {
      //       if (typeof features.signMessageError === 'boolean')
      //         throw new UserRejectedRequestError(
      //           new Error('Failed to sign message.'),
      //         )
      //       throw features.signMessageError
      //     }
      //     // Change `personal_sign` to `eth_sign` and swap params
      //     method = 'eth_sign'
      //     type Params = [data: Hex, address: Address]
      //     params = [(params as Params)[1], (params as Params)[0]]
      //   }

      //   const body = { method, params }
      //   const { error, result } = await rpc.http(url, { body })
      //   if (error) throw new RpcRequestError({ body, error, url })

        // return result
      }
      return custom({ request })({ retryCount: 0 })
    },

    async isAuthorized () {
      return isLogged;
    },

    // ---- OPTIONALS
    async getAccount () {
      const wallets = await sdk.Wallet.getWallets();
      console.log('wallet :>> ', wallets);
      return wallets[0].address as `0x${string}`;
    },
    // async getSigner () {
    //   // Implement your getSigner logic here
    // },
    // async switchChain ({ chainId }) {
    //   changeChain(chainId as unknown as SUPPORTED_CHAINS);
    // },

    //EVENTS
    onAccountsChanged: (accounts: string[]) => {
      currentWallets = accounts;
    },

    onChainChanged: (chainId: string) => {
      currentChain = Number(chainId);
    },

    onDisconnect: () => {
      document.cookie = 'brillion-session-wallet=';
    },
  
    // ---- OPTIONALS
    // onConnect: (_message) => {
    //   // Implement your onMessage logic here
    // },
    // onMessage: (_message) => {
    //   // Implement your onMessage logic here
    // },
  }))
}