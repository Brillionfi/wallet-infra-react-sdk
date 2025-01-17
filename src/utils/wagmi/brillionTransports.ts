import { custom } from 'wagmi';
import { BrillionProviderProps, parseChain } from '.';
import { WalletInfra } from '@brillionfi/wallet-infra-sdk';

export const BrillionTransport = (
  config: Pick<BrillionProviderProps, 'appId' | 'baseUrl'>,
  chainId: number,
) => {
  const sdk = new WalletInfra(config.appId!, config.baseUrl!);

  return custom({
    async request(body) {
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find((strings) => strings.includes('brillion-session-wallet'));
      const jwt = sessionCookie?.split('=')[1];
      if(!jwt) throw new Error('Login first');

      sdk.authenticateUser(jwt);

      const response = await sdk.Wallet.rpcRequest({ method: body.methods, params: body.params}, { chainId: parseChain(chainId) });
      return response;
    },
  });
}