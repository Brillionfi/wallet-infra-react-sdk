import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Footer/FooterStyles";

export const Footer = ({customStyles}: {customStyles?: TCustomStyles}) => {

  const footerStyle = customStyles?.footerStyle ?? defaultStyles.footer;
  const footerTextStyle = customStyles?.footerTextStyle ?? defaultStyles.footerText;
  const footerText = customStyles?.footerText ?? "Powered by Brillion";

  return (
    <section style={footerStyle}>
      <span style={footerTextStyle}>
        {footerText}
      </span>
    </section>
  );
};