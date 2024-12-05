// Copy button from b2c
// It shall export the same 6 buttons as on app.brillion.finance
// Full width and height so it fits parent component
// Pass redirectUrl as prop

export enum ICON_LIST {
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

export type TLocalIcons = keyof typeof ICON_LIST;

export type TLoginOptions = {
  label: string;
  icon: TLocalIcons;
  disabled: boolean;
  onClick: () => void;
}[];

export const Icon = ({
    id,
    icon,
    localIcon,
    type,
    size = "normal",
    ...props
  }: IIcon) => {
    const iconPi = type === "icon" || !localIcon ? icon : undefined;
  
    const image =
      type === "svg" && !!localIcon
        ? localIcon
        : type === "url"
          ? icon?.toString()
          : undefined;
  
    const iconPiClass = twMerge([
      iconPi,
      size === "normal"
        ? "text-3xl h-8 w-8"
        : size === "large"
          ? "text-5xl h-12 w-12"
          : "text-6xl h-16 w-16",
    ]);
  
    return (
      <>
        {image && (
          <Avatar id={id} image={image} icon={iconPi} size={size} {...props} />
        )}
        {iconPi && <span id={id} className={iconPiClass} {...props} />}
      </>
    );
  };

export interface ILoginOptions {
  loginOptions: TLoginOptions;
}
export const LoginOptions = ({
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
                    className={
                      "flex w-full flex-row items-center justify-center gap-[7px]",
                    }
                  >
                    <Icon localIcon={option.icon} size="normal" type="svg" />
                    <span className="text-sm font-bold leading-[16.44px] text-text-primary">
                      {t("method", { method: option.label })}
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

export const LoginForm = () => {
  const { loginOptions, isRedirecting } = useLoginConfigProvider();

  return (
    <LoginOptions loginOptions={loginOptions} isRedirecting={isRedirecting} />
  );
};