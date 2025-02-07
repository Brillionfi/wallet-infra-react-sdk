import { TLoginOption } from "interfaces";
import { SocialButton, SocialButtonIcon, SocialButtonsContainer, TCustomClassNames } from "@/components/LoginForm/Content/Social/SocialStyles";

export const Social = ({options, customClassNames}: {options: TLoginOption[], customClassNames?: TCustomClassNames}) => {

  return (
    <SocialButtonsContainer className={customClassNames?.socialButtonsContainer}>
      {options.map((option) => (
        <SocialButton
          key={`social-login-option-${option.label!.toLocaleLowerCase()}`}
          id={`social-login-option-${option.label!.toLocaleLowerCase()}`}
          className={customClassNames?.socialButton}
          onClick={() => option.onClick!()}
        >
          <SocialButtonIcon className={customClassNames?.socialButtonIcon}>
            {option.icon}
          </SocialButtonIcon>
        </SocialButton>
      ))}
    </SocialButtonsContainer>
  );
};