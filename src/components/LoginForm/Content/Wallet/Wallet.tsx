import { TLoginOptions } from "interfaces";
import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Content/Wallet/WalletStyles";

export const Wallet = ({options, customStyles}: {options: TLoginOptions, customStyles?: TCustomStyles}) => {

  const walletButtonsContainerStyle = customStyles?.walletButtonsContainerStyle ?? defaultStyles.walletButtonsContainer;
  const walletButtonStyle = customStyles?.walletButtonStyle ?? defaultStyles.walletButton;
  const walletButtonIconStyle = customStyles?.walletButtonIconStyle ?? defaultStyles.walletButtonIcon;

  const buttonTextStyle = customStyles?.buttonTextStyle ?? defaultStyles.buttonText;

  return (
    <section style={walletButtonsContainerStyle}>
      {options.map((option) => (
        option.html ? option.html :
        <button
          key={`login-option-${option.label!.toLocaleLowerCase()}`}
          id={`login-option-${option.label!.toLocaleLowerCase()}`}
          style={walletButtonStyle}
          onClick={() => option.onClick}
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