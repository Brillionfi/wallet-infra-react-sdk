import { useBrillionContext } from "@/components/BrillionContext";
import { jwtDecode } from "@/utils/jwtDecode";
import { AuthProvider } from "@brillionfi/wallet-infra-sdk";
import { IAuthURLParams } from "@brillionfi/wallet-infra-sdk/dist/models";

export const useUser = () => {
  const {
    sdk,
    walletConnectProjectId,
    changeWallet,
    changeSigner,
    saveSessionInfo,
  } = useBrillionContext();

  const authenticateUser = async (jwt: string) => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }

    sdk.authenticateUser(jwt);
    const info = JSON.parse(jwtDecode(jwt.split(".")[1])) as Record<
      string,
      string
    >;
    saveSessionInfo(info);

    const wallets = await sdk.Wallet.getWallets();
    if (wallets[0]) {
      changeWallet(wallets[0].address ?? "");
      changeSigner(wallets[0].signer ?? "");
    }
  };

  const login = async (
    provider: AuthProvider,
    redirectUrl: string,
    email?: string,
  ) => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }

    let uri;

    if (provider === AuthProvider.WALLET_CONNECT) {
      uri = await sdk.generateWalletConnectUri({
        projectId: walletConnectProjectId,
        redirectUrl,
      });
      sdk.onConnectWallet((authUrl: unknown) => {
        window.location.href = authUrl as string;
      });
    } else {
      const params: IAuthURLParams = {
        provider,
        redirectUrl,
      };
      if (email) params.email = email;
      uri = await sdk.generateAuthUrl(params);
    }

    return uri;
  };

  return { login, authenticateUser };
};
