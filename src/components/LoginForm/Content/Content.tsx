import { AuthProvider } from "@brillionfi/wallet-infra-sdk";
import { LoginMethods, TLoginOptions } from "interfaces";
import { useUser } from "hooks";
import GoogleLogo from "@/components/icons/google-logo";
import TwitterLogo from "@/components/icons/twitter-logo";
import DiscordLogo from "@/components/icons/discord-logo";
import MetamaskLogo from "@/components/icons/metamask-logo";
import WalletConnectLogo from "@/components/icons/walletconnect-logo";
import EmailLogo from "@/components/icons/email-logo";
import QRCodeModal from "@walletconnect/qrcode-modal"; 
import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Content/ContentStyles";
import { Social } from "./Social/Social";
import { Otp } from "./Otp/Otp";
import { Wallet } from "./Wallet/Wallet";

export const Content = ({loginMethods, redirectUrl, setErrorText, customStyles}: {loginMethods: LoginMethods[], redirectUrl: string, setErrorText: (error: string) => void, customStyles?: TCustomStyles}) => {
  const { login } = useUser();

  const makeLogin = async (provider: AuthProvider, redirectUrl: string, redirect: boolean, email?: string) => {
    try {
      const url = await login(provider, redirectUrl, email);
      if (url) {
        if(redirect){
          window.location.href = url;
        }else{
          QRCodeModal.open(url, () => {});
        }
      }
    } catch (error) {
      setErrorText((error as Error).message);
      QRCodeModal.close();
    }
  }

  const socialOptions: TLoginOptions = [
    {
      label: LoginMethods.Google,
      icon: <GoogleLogo />,
      onClick: async () => {
        await makeLogin(AuthProvider.GOOGLE, redirectUrl, true);
      },
    },
    {
      label: LoginMethods.Discord,
      icon: <DiscordLogo />,
      onClick: async () => {
        await makeLogin(AuthProvider.DISCORD, redirectUrl, true);
      },
    },
    {
      label: LoginMethods.Twitter,
      icon: <TwitterLogo />,
      onClick: async () => {
        await makeLogin(AuthProvider.TWITTER, redirectUrl, true);
      },
    },
  ];

  const otpOptions: TLoginOptions = [
    {
      label: LoginMethods.Email,
      icon: <EmailLogo />,
      onClick: async (loginAs?: string) => {
        if(loginAs) await makeLogin(AuthProvider.EMAIL, redirectUrl, true, loginAs);
      },
    },
  ];

  const walletOptions: TLoginOptions = [
    {
      label: LoginMethods.Metamask,
      icon: <MetamaskLogo />,
      onClick: async () => {
        await makeLogin(AuthProvider.METAMASK, redirectUrl, true);
      },
    },
    {
      label: LoginMethods.WalletConnect,
      icon: <WalletConnectLogo />,
      onClick: async () => {
        await makeLogin(AuthProvider.WALLET_CONNECT, redirectUrl, false);
      },
    }
  ];

  const socialMethods = socialOptions.filter(option=> loginMethods.includes(option.label))
  const otpMethods = otpOptions.filter(option=> loginMethods.includes(option.label))
  const walletMethods = walletOptions.filter(option=> loginMethods.includes(option.label))

  const contentContainerStyle = customStyles?.contentContainerStyle ?? defaultStyles.contentContainer;

  return (
    <section style={contentContainerStyle}>
      <Social options={socialMethods} customStyles={customStyles}/>
      <Otp options={otpMethods} customStyles={customStyles}/>
      <Wallet options={walletMethods} customStyles={customStyles}/>
    </section>
  );
};