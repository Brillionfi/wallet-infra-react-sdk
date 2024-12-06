import { useBrillionContext } from "../BrillionContext";
import { AuthProvider } from "@brillionfi/wallet-infra-sdk";

export const useUser = () => {
  const sdk = useBrillionContext();

  const authenticateUser = async (jwt: string) => {
    return sdk?.authenticateUser(jwt);
  };

  const login = async (provider: AuthProvider, redirectUrl: string) => {
    const url = await sdk?.generateAuthUrl({
      provider,
      redirectUrl,
    });
    return url;
  };

  return { login, authenticateUser };
};
