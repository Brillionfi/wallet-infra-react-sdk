import { TLoginOptions } from "interfaces";
import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Content/Social/SocialStyles";

export const Social = ({options, customStyles}: {options: TLoginOptions, customStyles?: TCustomStyles}) => {

  const socialButtonsContainerStyle = customStyles?.socialButtonsContainerStyle ?? defaultStyles.socialButtonsContainer;
  const socialButtonStyle = customStyles?.socialButtonStyle ?? defaultStyles.socialButton;
  const socialButtonIconStyle = customStyles?.socialButtonIconStyle ?? defaultStyles.socialButtonIcon;

  const buttonTextStyle = customStyles?.buttonTextStyle ?? defaultStyles.buttonText;

  return (
    <section style={socialButtonsContainerStyle}>
      {options.map((option) => (
        option.html ? option.html :
        <button
          key={`login-option-${option.label!.toLocaleLowerCase()}`}
          id={`login-option-${option.label!.toLocaleLowerCase()}`}
          style={socialButtonStyle}
          onClick={() => option.onClick}
        >
          <span style={socialButtonIconStyle}>
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