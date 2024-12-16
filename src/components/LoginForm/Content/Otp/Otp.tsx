import { TLoginOptions } from "interfaces";
import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Content/Otp/OtpStyles";

export const Otp = ({options, customStyles}: {options: TLoginOptions, customStyles?: TCustomStyles}) => {

  const otpButtonsContainerStyle = customStyles?.otpButtonsContainerStyle ?? defaultStyles.otpButtonsContainer;
  const otpButtonStyle = customStyles?.otpButtonStyle ?? defaultStyles.otpButton;
  const otpButtonIconStyle = customStyles?.otpButtonIconStyle ?? defaultStyles.otpButtonIcon;

  const buttonTextStyle = customStyles?.buttonTextStyle ?? defaultStyles.buttonText;

  return (
    <section style={otpButtonsContainerStyle}>
      {options.map((option) => (
        option.html ? option.html :
        <button
          key={`login-option-${option.label!.toLocaleLowerCase()}`}
          id={`login-option-${option.label!.toLocaleLowerCase()}`}
          style={otpButtonStyle}
          onClick={() => option.onClick}
        >
          <span style={otpButtonIconStyle}>
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