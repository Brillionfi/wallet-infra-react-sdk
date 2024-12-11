import { AuthProvider } from "@brillionfi/wallet-infra-sdk";
import { useUser } from "hooks";
import { LoginMethods, TLoginOptions } from "interfaces";
import GoogleLogo from "@/components/icons/google-logo";
import TwitterLogo from "@/components/icons/twitter-logo";
import DiscordLogo from "@/components/icons/discord-logo";
import MetamaskLogo from "@/components/icons/metamask-logo";
import WalletConnectLogo from "@/components/icons/walletconnect-logo";
import EmailLogo from "@/components/icons/email-logo";
import { useState } from "react";
import QRCodeModal from "@walletconnect/qrcode-modal"; 
import { defaultStyles, TCustomProps } from "@/components/LoginFormStyles";

export const LoginForm = ({loginMethods, redirectUrl, customProps}: {loginMethods: LoginMethods[], redirectUrl: string, customProps?: TCustomProps}) => {
  const { login } = useUser();

  const [showEmail, setShowEmail] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const makeLogin = async (provider: AuthProvider, redirectUrl: string, redirect: boolean, email?: string) => {
    try {
      const url = await login(provider, redirectUrl, email);
      if (url) {
        redirect ? 
          window.location.href = url 
        : 
          QRCodeModal.open(url, () => {});
      }
    } catch (error) {
      setErrorText((error as Error).message);
    }
  }

  const options: TLoginOptions = [
    {
      label: LoginMethods.Google,
      icon: <GoogleLogo />,
      disabled: false,
      onClick: async () => {
        await makeLogin(AuthProvider.GOOGLE, redirectUrl, true);
      },
    },
    {
      label: LoginMethods.Discord,
      icon: <TwitterLogo />,
      disabled: false,
      onClick: async () => {
        await makeLogin(AuthProvider.DISCORD, redirectUrl, true);
      },
    },
    {
      label: LoginMethods.Twitter,
      icon: <DiscordLogo />,
      disabled: false,
      onClick: async () => {
        await makeLogin(AuthProvider.TWITTER, redirectUrl, true);
      },
    },
    {
      label: LoginMethods.Metamask,
      icon: <MetamaskLogo />,
      disabled: false,
      onClick: async () => {
        await makeLogin(AuthProvider.METAMASK, redirectUrl, true);
      },
    },
    {
      label: LoginMethods.WalletConnect,
      icon: <WalletConnectLogo />,
      disabled: false,
      onClick: async () => {
        await makeLogin(AuthProvider.WALLET_CONNECT, redirectUrl, false);
      },
    },
    {
      label: LoginMethods.Email,
      icon: <EmailLogo />,
      disabled: false,
      onClick: async () => {
        if (isVisible) {
          setIsVisible(false);
          setTimeout(() => setShowEmail(false), 280); // Wait for the transition to complete
        } else {
          setShowEmail(true);
          setTimeout(() => setIsVisible(true), 10); // Delay slightly for the transition to start
        }
      },
    },
  ];
  if(showEmail) {
    options.push({
      label: LoginMethods.Email,
      html: (
        <div
          key={`login-option-email-input`}
          id={`login-option-email-input`}
          className="loginButton"
          style={{
            transition: "opacity 0.3s ease, transform 0.3s ease",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(-20px)",
            width: "100%",
            color: "#fefefe",
            background: "#292d27",
            border: "1px solid #292d27",
            padding: "1rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "6px",
          }}
        >
          <section
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
              gap: "7px",
            }}
          >
            <input
              autoComplete={'off'}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder='Email'
              value={email}
              style={{
                minHeight: '45px',
                borderRadius: '5px',
                background: 'black',
                padding: '8px',
              }}
            />
            <button
              onClick={async () => {
                await makeLogin(AuthProvider.EMAIL, redirectUrl, true, email);
              }
            }
              style={{
                margin: 'auto',
                background: "#444444",
                borderRadius: "5px",
                padding: "8px",
              }}
            >
              Send
            </button>
          </section>
        </div>
      )
    });
  }

  const methods = options.filter(option=> loginMethods.includes(option.label))

  const containerStyle = customProps?.containerStyle ? customProps.containerStyle : defaultStyles.container;
  const tittleStyle = customProps?.tittleStyle ? customProps.tittleStyle : defaultStyles.tittle;
  const tittleText = customProps?.tittleText ? customProps.tittleText : "Welcome";
  const buttonsContainerStyle = customProps?.buttonsContainerStyle ? customProps.buttonsContainerStyle : defaultStyles.buttonsContainer;
  const buttonStyle = customProps?.buttonStyle ? customProps.buttonStyle : defaultStyles.button;
  const buttonText = customProps?.buttonText ? customProps.buttonText : "Continue with";
  const errorContainerStyle = customProps?.errorContainerStyle ? customProps.errorContainerStyle : defaultStyles.errorContainer;
  const errorTextStyle = customProps?.errorTextStyle ? customProps.errorTextStyle : defaultStyles.errorStyle;

  return (
    <div style={containerStyle}>
      <span style={tittleStyle}>
        {tittleText}
      </span>
      <section style={buttonsContainerStyle}>
        {methods.map((option) => (
          option.html ? option.html :
          <button
            key={`login-option-${option.label!.toLocaleLowerCase()}`}
            id={`login-option-${option.label!.toLocaleLowerCase()}`}
            className="loginButton"
            style={{
              ...buttonStyle,
              cursor: option.disabled ? "not-allowed" : "pointer",
            }}
            disabled={option.disabled}
            onClick={option.onClick}
          >
            {option.icon}
            <span style={defaultStyles.buttonText}>
              {buttonText} {option.label}
            </span>
          </button>
        ))}
      </section>
      <section style={errorContainerStyle}>
        <span style={errorTextStyle}>
          {errorText}
        </span>
      </section>
    </div>
  );
};