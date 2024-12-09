import { AuthProvider } from "@brillionfi/wallet-infra-sdk";
import { useUser } from "hooks";
import { ILoginOptions, LoginMethods, TLoginOptions } from "interfaces";
import GoogleLogo from "@/components/icons/google-logo";
import TwitterLogo from "@/components/icons/twitter-logo";
import DiscordLogo from "@/components/icons/discord-logo";
import MetamaskLogo from "@/components/icons/metamask-logo";
import WalletConnectLogo from "@/components/icons/walletconnect-logo";
import EmailLogo from "@/components/icons/email-logo";
import { useState } from "react";
import QRCodeModal from "@walletconnect/qrcode-modal"; 

const LoginOptions = ({
  loginOptions,
}: ILoginOptions) => {
  return (
    <section style={{ display: "flex", width: "100%", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", width: "100%", flexDirection: "column", alignItems: "center" }}>
        <span
          style={{
            marginBottom: "1rem",
            fontSize: "2.25rem",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Welcome
        </span>
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <section
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.5rem",
            }}
          >
            {loginOptions.map((option) => (
              option.html ? option.html :
              <button
                key={`login-option-${option.label!.toLocaleLowerCase()}`}
                id={`login-option-${option.label!.toLocaleLowerCase()}`}
                className="loginButton"
                style={{
                  width: "100%",
                  color: "#fefefe",
                  background: "#292d27",
                  border: "1px solid #292d27",
                  cursor: option.disabled ? "not-allowed" : "pointer",
                  padding: "1rem 1.5rem",
                  fontSize: "1rem",
                  transition: "background-color .2s, color .2s, border-color .2s, box-shadow .2s",
                  borderRadius: "6px",
                  // hover: {
                  //   background: "#343633",
                  //   color: "#b4b4b4",
                  //   borderColor: "#343633"
                  // }
                }}
                disabled={option.disabled}
                onClick={option.onClick}
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
                  {option.icon}
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      lineHeight: "16.44px",
                      color: "#fff",
                    }}
                  >
                    Continue with {option.label}
                  </span>
                </section>
              </button>
            ))}
          </section>
        </section>
      </div>
    </section>
  );
};

export const LoginForm = ({loginMethods, redirectUrl}: {loginMethods: LoginMethods[], redirectUrl: string}) => {
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
      icon: <TwitterLogo />,
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
      icon: <DiscordLogo />,
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
        if(!url) return;
  
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
                const url = await login(AuthProvider.EMAIL, redirectUrl, email);
                if (url) {
                  window.location.href = url;
                }
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

  return (
    <>
      <LoginOptions loginOptions={methods} />
    </>
  );
};