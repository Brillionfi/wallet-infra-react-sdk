import { TLoginOption } from "interfaces";
import { TCustomClassNames } from "@/components/LoginForm/Content/Social/SocialStyles";

export const Social = ({options, customClassNames}: {options: TLoginOption[], customClassNames?: TCustomClassNames}) => {

  return (
    <section className={`brlkit_social_buttons_container ${customClassNames?.socialButtonsContainer ?? ""}`}>
      {options.map((option) => (
        <button
          key={`social-login-option-${option.label!.toLocaleLowerCase()}`}
          id={`social-login-option-${option.label!.toLocaleLowerCase()}`}
          className={`brlkit_social_button ${customClassNames?.socialButton ?? ""}`}
          onClick={() => option.onClick!()}
        >
          <span className={`brlkit_social_buttons_icon ${customClassNames?.socialButtonIcon}`}>
            {option.icon}
          </span>
        </button>
      ))}
    </section>
  );
};