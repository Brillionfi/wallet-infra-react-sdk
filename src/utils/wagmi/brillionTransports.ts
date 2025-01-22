import { custom } from 'wagmi';
import { BrillionProviderProps, parseChain } from '.';
import { AuthProvider, WalletInfra } from '@brillionfi/wallet-infra-sdk';
import MetaMaskSDK from '@metamask/sdk';

export const BrillionTransport = (
  config: Pick<BrillionProviderProps, 'appId' | 'baseUrl'>,
  chainId: number,
) => {
  const sdk = new WalletInfra(config.appId!, config.baseUrl!);
  const mmSDK = new MetaMaskSDK();

  return custom({
    async request(body) {
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find((strings) => strings.includes('brillion-session-jwt'));
      const sessionData = JSON.parse(cookies.find((strings) => strings.includes('brillion-session-session')) || '{}');
      const jwt = sessionCookie?.split('=')[1];
      if(!jwt) throw new Error('Login first');
      sdk.authenticateUser(jwt);

      if(sessionData.loggedInVia === AuthProvider.METAMASK){
        const ethereum = mmSDK.getProvider(); 
        if (!ethereum) {
          throw new Error('No MetaMask provider found');
        }
        return ethereum.request(body)
      }else{
        return await sdk.Wallet.rpcRequest({ method: body.method, params: body.params}, { chainId: parseChain(chainId) });
      }

    },
  });
}