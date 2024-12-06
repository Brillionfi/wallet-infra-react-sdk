import { AuthProvider } from "@brillionfi/wallet-infra-sdk";

import { useBrillionContext } from "../components/BrillionContext";

export const useUser = () => {
  const sdk = useBrillionContext();

  const authenticateUser = (jwt: string) => {
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
