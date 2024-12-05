import { useBrillionContext } from "../BrillionContext";
import { AuthProvider } from "@brillionfi/wallet-infra-sdk";

export const useUser = (jwt?: string) => {
  const sdk = useBrillionContext();

  if (jwt) {
    sdk?.authenticateUser(jwt);
  }

  const login = async () => {
    const url = await sdk?.generateAuthUrl({
      provider: AuthProvider.GOOGLE,
      redirectUrl: "",
    });
    return url;
  };

  const wallets = async () => {
    return await sdk?.Wallet.getWallets();
  };

  return { login, wallets };
};
