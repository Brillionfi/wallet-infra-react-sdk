import { TCustomClassNames } from "@/components/LoginForm/Footer/FooterStyles";

export const Footer = ({customClassNames, footerText}: {customClassNames?: TCustomClassNames, footerText?: string}) => {

  return (
    <section className={`brlkit_login_footer_container ${customClassNames?.footerContainer ?? ""}`}>
      <span className={`brlkit_text_section ${customClassNames?.footerTextSection ?? ""}`}>
        {footerText ?? "Powered by Brillion"}
      </span>
    </section>
  );
};