import { AuthProvider } from "@brillionfi/wallet-infra-sdk";
import { LoginMethods, TLoginOption } from "interfaces";
import { useUser } from "hooks";
import GoogleLogo from "@/components/icons/google-logo";
import TwitterLogo from "@/components/icons/twitter-logo";
import DiscordLogo from "@/components/icons/discord-logo";
import MetamaskLogo from "@/components/icons/metamask-logo";
import WalletConnectLogo from "@/components/icons/walletconnect-logo";
import EmailLogo from "@/components/icons/email-logo";
import WalletLogo from "@/components/icons/wallet-logo";
import QRCodeModal from "@walletconnect/qrcode-modal"; 
import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Content/ContentStyles";
import { Social } from "./Social/Social";
import { Otp } from "./Otp/Otp";
import { Wallet } from "./Wallet/Wallet";
import { CSSProperties } from 'react';

const hrStyle: CSSProperties = {
  width: "40%",
  border: '1px solid #BBBBBB'
}
const orStyle: CSSProperties = {
  width: "20%",
  color: '#BBBBBB',
  fontSize: '0.8rem'
}
const dividerStyle: CSSProperties = {
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  width: '100%', 
  textAlign: 'center', 
  margin: '1rem 0rem'
}

export const Content = (
{
  loginMethods, 
  redirectUrl, 
  setErrorText, 
  showInnerContent, 
  toggleInnerContent, 
  customStyles
}:{
  loginMethods: LoginMethods[], 
  redirectUrl: string, 
  setErrorText: (error: string) => void, 
  showInnerContent: boolean,
  toggleInnerContent: () => void, customStyles?: TCustomStyles
}) => {
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

  const socialOptions: TLoginOption[] = [
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

  const otpOptions: TLoginOption[] = [
    {
      label: LoginMethods.Email,
      icon: <EmailLogo />,
      onClick: async (loginAs?: string) => {
        if(loginAs) await makeLogin(AuthProvider.EMAIL, redirectUrl, true, loginAs);
      },
    },
  ];

  const walletOptions: TLoginOption[] = [
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
  const buttonStyle = customStyles?.buttonStyle ?? defaultStyles.button;
  const buttonIconStyle = customStyles?.buttonIconStyle ?? defaultStyles.buttonIcon;
  const buttonTextStyle = customStyles?.buttonTextStyle ?? defaultStyles.buttonText;

  return (
    <section style={contentContainerStyle}>
      <div style={{
          width: !showInnerContent ? '100%' : '0%',
          opacity: !showInnerContent ? 1 : 0,
          transition: `width 500ms ease`,
        }}
      >
        <Social options={socialMethods} customStyles={customStyles}/>
        <Otp options={otpMethods} customStyles={customStyles}/>
        {walletMethods.length > 0 ? 
          <>
            <div style={dividerStyle}>
              <hr style={hrStyle}/>
              <span style={orStyle}>OR</span>
              <hr style={hrStyle}/>
            </div>
            <button
              style={buttonStyle}
              onClick={toggleInnerContent}
            >
              <span style={buttonIconStyle}>
                <WalletLogo />
              </span>
              <span style={buttonTextStyle}>
                Connect Wallet
              </span>
            </button>
          </>
        : null}
      </div>
      <div style={{
          width: showInnerContent ? '100%' : '0%',
          opacity: showInnerContent ? 1 : 0,
          transition: `width 500ms ease`,
        }}
      >
        <Wallet options={walletMethods} customStyles={customStyles}/>
      </div>
    </section>
  );
};