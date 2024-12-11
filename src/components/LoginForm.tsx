import { useState } from "react";
import DiscordLogo from "@/components/icons/discord-logo";
import EmailLogo from "@/components/icons/email-logo";
import GoogleLogo from "@/components/icons/google-logo";
import MetamaskLogo from "@/components/icons/metamask-logo";
import TwitterLogo from "@/components/icons/twitter-logo";
import WalletConnectLogo from "@/components/icons/walletconnect-logo";
import { defaultStyles, TCustomProps } from "@/components/LoginFormStyles";
import { AuthProvider } from "@brillionfi/wallet-infra-sdk";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { useUser } from "hooks";
import { LoginMethods, TLoginOptions } from "interfaces";

export const LoginForm = ({
  loginMethods,
  redirectUrl,
  customProps,
}: {
  loginMethods: LoginMethods[];
  redirectUrl: string;
  customProps?: TCustomProps;
}) => {
  const { login } = useUser();

  const [showEmail, setShowEmail] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const options: TLoginOptions = [
    {
      label: LoginMethods.Google,
      icon: <GoogleLogo />,
      disabled: false,
      onClick: async () => {
        const url = await login(AuthProvider.GOOGLE, redirectUrl);
        if (url) {
          window.location.href = url;
        }
      },
    },
    {
      label: LoginMethods.Discord,
      icon: <DiscordLogo />,
      disabled: false,
      onClick: async () => {
        const url = await login(AuthProvider.DISCORD, redirectUrl);
        if (url) {
          window.location.href = url;
        }
      },
    },
    {
      label: LoginMethods.Twitter,
      icon: <TwitterLogo />,
      disabled: false,
      onClick: async () => {
        const url = await login(AuthProvider.TWITTER, redirectUrl);
        if (url) {
          window.location.href = url;
        }
      },
    },
    {
      label: LoginMethods.Metamask,
      icon: <MetamaskLogo />,
      disabled: false,
      onClick: async () => {
        const url = await login(AuthProvider.METAMASK, redirectUrl);
        if (url) {
          window.location.href = url;
        }
      },
    },
    {
      label: LoginMethods.WalletConnect,
      icon: <WalletConnectLogo />,
      disabled: false,
      onClick: async () => {
        const url = await login(AuthProvider.WALLET_CONNECT, redirectUrl);
        if (!url) return;

        QRCodeModal.open(url, () => {});
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
  if (showEmail) {
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
              autoComplete={"off"}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Email"
              value={email}
              style={{
                minHeight: "45px",
                borderRadius: "5px",
                background: "black",
                padding: "8px",
              }}
            />
            <button
              onClick={async () => {
                const url = await login(AuthProvider.EMAIL, redirectUrl, email);
                if (url) {
                  window.location.href = url;
                }
              }}
              style={{
                margin: "auto",
                background: "#444444",
                borderRadius: "5px",
                padding: "8px",
              }}
            >
              Send
            </button>
          </section>
        </div>
      ),
    });
  }

  const methods = options.filter((option) =>
    loginMethods.includes(option.label),
  );

  const containerStyle = customProps?.containerStyle
    ? customProps.containerStyle
    : defaultStyles.container;
  const tittleStyle = customProps?.tittleStyle
    ? customProps.tittleStyle
    : defaultStyles.tittle;
  const tittleText = customProps?.tittleText
    ? customProps.tittleText
    : "Welcome";
  const buttonsContainerStyle = customProps?.buttonsContainerStyle
    ? customProps.buttonsContainerStyle
    : defaultStyles.buttonsContainer;
  const buttonStyle = customProps?.buttonStyle
    ? customProps.buttonStyle
    : defaultStyles.button;
  const buttonText = customProps?.buttonText
    ? customProps.buttonText
    : "Continue with";

  return (
    <div style={containerStyle}>
      <span style={tittleStyle}>{tittleText}</span>
      <section style={buttonsContainerStyle}>
        {methods.map((option) =>
          option.html ? (
            option.html
          ) : (
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
          ),
        )}
      </section>
    </div>
  );
};
