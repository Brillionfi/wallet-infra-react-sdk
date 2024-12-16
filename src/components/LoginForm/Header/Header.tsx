import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Header/HeaderStyles";

export const Header = ({onClose, customStyles}: {onClose: () => void, customStyles?: TCustomStyles}) => {

  const headerStyle = customStyles?.headerStyle ?? defaultStyles.header;
  const headerTextStyle = customStyles?.headerTextStyle ?? defaultStyles.headerText;
  const headerText = customStyles?.headerText ?? "Welcome";
  const closeStyle = customStyles?.closeStyle ?? defaultStyles.close;

  return (
    <section style={headerStyle}>
      <span style={headerTextStyle}>
        {headerText}
      </span>
      <span style={closeStyle}>
        <button onClick={onClose}>X</button>
      </span>
    </section>
  );
};