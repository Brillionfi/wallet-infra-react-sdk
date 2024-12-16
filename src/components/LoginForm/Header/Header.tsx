import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Header/HeaderStyles";
import CloseX from "@/components/icons/close-x";
import BackArrow from "@/components/icons/back-arrow";

export const Header = ({onClose, customStyles}: {onClose: () => void, customStyles?: TCustomStyles}) => {

  const headerStyle = customStyles?.headerStyle ?? defaultStyles.header;
  const headerTextStyle = customStyles?.headerTextStyle ?? defaultStyles.headerText;
  const headerText = customStyles?.headerText ?? "Sign in";
  const closeStyle = customStyles?.closeStyle ?? defaultStyles.close;

  const allowBackArrow = headerText !== "Sign in";

  return (
    <section style={headerStyle}>
      <span 
        style={{...headerTextStyle, cursor: allowBackArrow ? "pointer" : undefined}} 
        onClick={allowBackArrow ? onClose : undefined}
      >
        {allowBackArrow && <BackArrow />} {headerText}
      </span>
      <span style={closeStyle}>
        <button onClick={onClose}>
          <CloseX />
        </button>
      </span>
    </section>
  );
};