import { AuthProvider } from "@brillionfi/wallet-infra-sdk";
import { useUser } from "hooks";
import { ILoginOptions, LoginMethods, TLocalIcons } from "interfaces";

// Full width and height so it fits parent component

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
          Log in
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
              <button
                key={`login-option-${option.label.toLocaleLowerCase()}`}
                id={`login-option-${option.label.toLocaleLowerCase()}`}
                style={{
                  width: "100%",
                  cursor: option.disabled ? "not-allowed" : "pointer",
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
                    justifyContent: "center",
                    gap: "7px",
                  }}
                >
                  <img src={`/icons/${option.icon}.svg`} width="16" height="16"/>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      lineHeight: "16.44px",
                      color: "#fff",
                    }}
                  >
                    {option.label}
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
  const options = [
    {
      label: LoginMethods.Google,
      icon: "google-logo" as TLocalIcons,
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
      icon: "discord-logo" as TLocalIcons,
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
      icon: "twitter-logo" as TLocalIcons,
      disabled: false,
      onClick: async () => {
        const url = await login(AuthProvider.TWITTER, redirectUrl);
        if (url) {
          window.location.href = url;
        }
      },
    },
    // TODO: prepare an email input window
    // {
    //   label: "Continue-with Email",
    //   icon: "email-logo" as TLocalIcons,
    //   disabled: false,
    //   onClick: () => {
    //     activateOtpLogin(OTP_LOGIN_OPTIONS.EMAIL);
    //   },
    // },
  ];
  const methods = loginMethods.map(method=>options.find(option=>option.label===method)!)
  return (
    <LoginOptions loginOptions={methods} />
  );
};