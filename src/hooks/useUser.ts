import { AuthProvider } from "@brillionfi/wallet-infra-sdk";
import { IAuthURLParams } from "@brillionfi/wallet-infra-sdk/dist/models";

import { useBrillionContext } from "../components/BrillionContext";

export const useUser = () => {
  const { sdk, walletConnectProjectId } = useBrillionContext();

  const authenticateUser = (jwt: string) => {
    return sdk?.authenticateUser(jwt);
  };

  const login = async (
    provider: AuthProvider,
    redirectUrl: string,
    email?: string,
  ) => {
    let uri;

    if (provider === AuthProvider.WALLET_CONNECT) {
      uri = sdk?.generateWalletConnectUri(walletConnectProjectId, redirectUrl);
      sdk?.onConnectWallet((authUrl: unknown) => {
        window.location.href = authUrl as string;
      });
    } else {
      const params: IAuthURLParams = {
        provider,
        redirectUrl,
      };
      if (email) params.email = email;
      uri = await sdk?.generateAuthUrl(params);
    }

    return uri;
  };

  return { login, authenticateUser };
};
