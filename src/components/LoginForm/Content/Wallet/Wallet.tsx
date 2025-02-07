import { TLoginOption } from "interfaces";
import { TCustomClassNames, WalletButton, WalletButtonIcon, WalletButtonsContainer, WalletButtonText } from "@/components/LoginForm/Content/Wallet/WalletStyles";

export const Wallet = ({options, customClassNames}: {options: TLoginOption[], customClassNames?: TCustomClassNames}) => {

  return (
    <WalletButtonsContainer className={customClassNames?.walletButtonsContainer}>
      {options.map((option) => (
        <WalletButton
          key={`wallet-login-option-${option.label!.toLocaleLowerCase()}`}
          id={`wallet-login-option-${option.label!.toLocaleLowerCase()}`}
          className={customClassNames?.walletButton}
          onClick={() => option.onClick!()}
        >
          <WalletButtonIcon className={customClassNames?.walletButtonIcon}>
            {option.icon}
          </WalletButtonIcon>
          <WalletButtonText className={customClassNames?.walletButtonText}>
            {option.label}
          </WalletButtonText>
        </WalletButton>
      ))}
    </WalletButtonsContainer>
  );
};