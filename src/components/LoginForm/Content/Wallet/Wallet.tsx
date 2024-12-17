import { TLoginOption } from "interfaces";
import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Content/Wallet/WalletStyles";

export const Wallet = ({options, customStyles}: {options: TLoginOption[], customStyles?: TCustomStyles}) => {

  const walletButtonsContainerStyle = customStyles?.walletButtonsContainerStyle ?? defaultStyles.walletButtonsContainer;
  const walletButtonStyle = customStyles?.walletButtonStyle ?? defaultStyles.walletButton;
  const walletButtonIconStyle = customStyles?.walletButtonIconStyle ?? defaultStyles.walletButtonIcon;

  const buttonTextStyle = customStyles?.walletButtonTextStyle ?? defaultStyles.walletButtonText;

  return (
    <section style={walletButtonsContainerStyle}>
      {options.map((option) => (
        <button
          key={`wallet-login-option-${option.label!.toLocaleLowerCase()}`}
          id={`wallet-login-option-${option.label!.toLocaleLowerCase()}`}
          style={walletButtonStyle}
          onClick={() => option.onClick!()}
        >
          <span style={walletButtonIconStyle}>
            {option.icon}
          </span>
          <span style={buttonTextStyle}>
            {option.label}
          </span>
        </button>
      ))}
    </section>
  );
};