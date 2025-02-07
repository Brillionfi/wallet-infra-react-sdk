import { HeaderContainer, HeaderTextSection, TCustomClassNames } from "@/components/LoginForm/Header/HeaderStyles";
import CloseX from "@/components/icons/close-x";
import BackArrow from "@/components/icons/back-arrow";

export const Header = ({onClose, showClose, customClassNames}: {onClose: () => void, showClose: boolean, customClassNames?: TCustomClassNames}) => {

  const headerText = customClassNames?.headerText ?? "Sign in";

  const allowBackArrow = headerText !== "Sign in";

  return (
    <HeaderContainer className={customClassNames?.headerContainer}>
      <HeaderTextSection 
        className={customClassNames?.headerTextSection}
        style={{cursor: allowBackArrow ? "pointer" : undefined}} 
        onClick={allowBackArrow ? onClose : undefined}
      >
        {allowBackArrow && <BackArrow />} {headerText}
      </HeaderTextSection>
      <span className={customClassNames?.closeSection}>
        {showClose &&
          <button onClick={onClose}>
            <CloseX />
          </button>
        }
      </span>
    </HeaderContainer>
  );
};