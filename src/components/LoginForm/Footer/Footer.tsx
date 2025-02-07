import { FooterContainer, FooterTextSection, TCustomClassNames } from "@/components/LoginForm/Footer/FooterStyles";

export const Footer = ({customClassNames, footerText}: {customClassNames?: TCustomClassNames, footerText?: string}) => {

  return (
    <FooterContainer className={customClassNames?.footerContainer}>
      <FooterTextSection className={customClassNames?.footerTextSection}>
        {footerText ?? "Powered by Brillion"}
      </FooterTextSection>
    </FooterContainer>
  );
};