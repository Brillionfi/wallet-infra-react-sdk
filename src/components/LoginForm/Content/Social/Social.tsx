import { TLoginOption } from "interfaces";
import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Content/Social/SocialStyles";

export const Social = ({options, customStyles}: {options: TLoginOption[], customStyles?: TCustomStyles}) => {

  const socialButtonsContainerStyle = customStyles?.socialButtonsContainerStyle ?? defaultStyles.socialButtonsContainer;
  const socialButtonStyle = customStyles?.socialButtonStyle ?? defaultStyles.socialButton;
  const socialButtonIconStyle = customStyles?.socialButtonIconStyle ?? defaultStyles.socialButtonIcon;

  return (
    <section style={socialButtonsContainerStyle}>
      {options.map((option) => (
        <button
          key={`social-login-option-${option.label!.toLocaleLowerCase()}`}
          id={`social-login-option-${option.label!.toLocaleLowerCase()}`}
          style={socialButtonStyle}
          onClick={() => option.onClick!()}
        >
          <span style={socialButtonIconStyle}>
            {option.icon}
          </span>
        </button>
      ))}
    </section>
  );
};