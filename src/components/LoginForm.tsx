// Copy button from b2c
// It shall export the same 6 buttons as on app.brillion.finance
// Full width and height so it fits parent component
// Pass redirectUrl as prop


import { AuthProvider } from "@brillionfi/wallet-infra-sdk";
import { useUser } from "hooks";
import * from "./LoginForm.css"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum ICON_LIST {
  "apple-logo",
  "discord-logo",
  "email-logo",
  "ethereum",
  "google-logo",
  "logo",
  "polygon",
  "brillion-dark-logo",
  "brillion-dark-logo-circle",
  "twitter-logo",
  "vanar",
  "wallet-connect",
  "zilliqa",
  "telos",
  "base",
}

type TLocalIcons = keyof typeof ICON_LIST;

type TLoginOptions = {
  label: LoginMethods;
  icon: TLocalIcons;
  disabled: boolean;
  onClick: () => void;
}[];

const Icon = ({
  localIcon,
}: {localIcon: string}) => {
  const image =`/icons/${localIcon}.svg`
  return (<img src={image} width="16" height="16"/>)
};

interface ILoginOptions {
  loginOptions: TLoginOptions;
}

const LoginOptions = ({
  loginOptions,
}: ILoginOptions) => {
  return (
    <section className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center">
        <span className="mb-4 text-4xl font-bold text-text-primary">
          Log in
        </span>
        <section className="flex flex-col zero:w-full md:w-4/6 2xl:w-5/12">
          <section className="flex w-full flex-col items-start gap-2">
            {loginOptions.map((option) => (
                <button
                  key={`login-option-${option.label.toLocaleLowerCase()}`}
                  id={`login-option-${option.label.toLocaleLowerCase()}`}
                  className="w-full"
                  disabled={option.disabled}
                  onClick={option.onClick}
                >
                  <section
                    className={"flex w-full flex-row items-center justify-center gap-[7px]"}
                  >
                    <Icon localIcon={option.icon} />
                    <span className="text-sm font-bold leading-[16.44px] text-text-primary">
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

export enum LoginMethods {
  Google = "Google",
  Twitter = "Twitter",
  Discord = "Discord"
}

export const LoginForm = ({loginMethods, redirectUrl}: {loginMethods: LoginMethods[], redirectUrl: string}) => {
  const {login}=useUser()
  const options = [
    {
      label: LoginMethods.Google,
      icon: "google-logo" as TLocalIcons,
      disabled: false,
      onClick: async () => {
        const url = await login(AuthProvider.GOOGLE,redirectUrl);
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
        const url = await login(AuthProvider.DISCORD,redirectUrl);
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
        const url = await login(AuthProvider.TWITTER,redirectUrl);
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