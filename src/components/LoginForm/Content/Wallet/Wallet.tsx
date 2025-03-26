import { TLoginOption } from "interfaces";
import { TCustomClassNames } from "@/components/LoginForm/Content/Wallet/WalletStyles";

export const Wallet = ({options, customClassNames}: {options: TLoginOption[], customClassNames?: TCustomClassNames}) => {

  return (
    <section className={`brlkit_wallet_buttons_container ${customClassNames?.walletButtonsContainer ?? ""}`}>
      {options.map((option) => (
        <button
          key={`wallet-login-option-${option.label!.toLocaleLowerCase()}`}
          id={`wallet-login-option-${option.label!.toLocaleLowerCase()}`}
          className={`brlkit_wallet_button ${customClassNames?.walletButton ?? ""}`}
          onClick={() => option.onClick!()}
        >
          <span className={`brlkit_wallet_button_icon ${customClassNames?.walletButtonIcon ?? ""}`}>
            {option.icon}
          </span>
          <span className={`brlkit_wallet_button_text ${customClassNames?.walletButtonText ?? ""}`}>
            {option.label}
          </span>
        </button>
      ))}
    </section>
  );
};