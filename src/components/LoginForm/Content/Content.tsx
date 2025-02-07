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
import { ContentContainer, DivederMiddleSection, Divider, DividerSidesSection, TCustomClassNames } from "@/components/LoginForm/Content/ContentStyles";
import { Social } from "@/components/LoginForm/Content/Social/Social";
import { Otp } from "@/components/LoginForm/Content/Otp/Otp";
import { Wallet } from "@/components/LoginForm/Content/Wallet/Wallet";
import { Button, ButtonIcon, ButtonText } from "@/components/LoginForm/Content/CommonStyles";

export const Content = (
{
  loginMethods, 
  redirectUrl, 
  setErrorText, 
  showInnerContent, 
  toggleInnerContent, 
  customClassNames
}:{
  loginMethods: LoginMethods[], 
  redirectUrl: string, 
  setErrorText: (error: string) => void, 
  showInnerContent: boolean,
  toggleInnerContent: () => void, customClassNames?: TCustomClassNames
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

  return (
    <ContentContainer className={customClassNames?.contentContainer}>
      <div style={{
          width: !showInnerContent ? '100%' : '0%',
          opacity: !showInnerContent ? 1 : 0,
          transition: `width 500ms ease`,
        }}
      >
        <Social options={socialMethods} customClassNames={customClassNames}/>
        <Otp options={otpMethods} customClassNames={customClassNames}/>
        {walletMethods.length > 0 ? 
          <>
            <Divider>
              <DividerSidesSection/>
              <DivederMiddleSection>OR</DivederMiddleSection>
              <DividerSidesSection/>
            </Divider>
            <Button
              className={customClassNames?.button}
              onClick={toggleInnerContent}
            >
              <ButtonIcon className={customClassNames?.buttonIcon}>
                <WalletLogo />
              </ButtonIcon>
              <ButtonText className={customClassNames?.buttonText}>
                Connect Wallet
              </ButtonText>
            </Button>
          </>
        : null}
      </div>
      <div style={{
          width: showInnerContent ? '100%' : '0%',
          opacity: showInnerContent ? 1 : 0,
          transition: `width 500ms ease`,
        }}
      >
        <Wallet options={walletMethods} customClassNames={customClassNames}/>
      </div>
    </ContentContainer>
  );
};