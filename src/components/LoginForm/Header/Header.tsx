import { TCustomClassNames } from "@/components/LoginForm/Header/HeaderStyles";
import CloseX from "@/components/icons/close-x";
import BackArrow from "@/components/icons/back-arrow";

export const Header = ({onClose, showClose, customClassNames}: {onClose: () => void, showClose: boolean, customClassNames?: TCustomClassNames}) => {

  const headerText = customClassNames?.headerText ?? "Sign in";

  const allowBackArrow = headerText !== "Sign in";

  return (
    <section className={`brlkit_header_container ${customClassNames?.headerContainer ?? ""}`}>
      <span 
        className={`brlkit_header_text_container ${customClassNames?.headerTextSection ?? ""}`}
        style={{cursor: allowBackArrow ? "pointer" : undefined}} 
        onClick={allowBackArrow ? onClose : undefined}
      >
        {allowBackArrow && <BackArrow />} {headerText}
      </span>
      <span className={customClassNames?.closeSection}>
        {showClose &&
          <button onClick={onClose}>
            <CloseX />
          </button>
        }
      </span>
    </section>
  );
};