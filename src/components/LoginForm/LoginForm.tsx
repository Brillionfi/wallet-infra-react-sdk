import { LoginMethods } from "interfaces";
import { useState } from "react";
import { TConfig } from "@/components/LoginForm/LoginFormStyles";
import { Header } from "@/components/LoginForm/Header/Header";
import { Footer } from "@/components/LoginForm/Footer/Footer";
import { Content } from "@/components/LoginForm/Content/Content";

export const LoginForm = ({loginMethods, redirectUrl, onClose, config}: {loginMethods: LoginMethods[], redirectUrl: string, onClose: () => void, config?: TConfig}) => {

  const [errorText, setErrorText] = useState<string>("");
  const [showInnerContent, setShowInnerContent] = useState<boolean>(false);

  const customClassNames = config?.customClassNames ?? {};

  return (
    <div className={`brlkit_login_main_container ${customClassNames?.mainContainer ?? ""}`}>
      <Header 
        onClose={showInnerContent ? () => setShowInnerContent(false) : onClose} 
        showClose={config?.showClose ?? true}
        customClassNames={
          {
            ...customClassNames, 
            headerText: showInnerContent? "Select wallet" : "Sign in"
          }
        }
      />

      <Content 
        loginMethods={loginMethods} 
        redirectUrl={redirectUrl} 
        setErrorText={setErrorText} 
        customClassNames={customClassNames} 
        showInnerContent={showInnerContent}
        toggleInnerContent={() => setShowInnerContent(!showInnerContent)}
      />

      <section className={`brlkit_login_error_container ${customClassNames?.errorContainer ?? ""}`}>
        <span className={`brlkit_login_error_style ${customClassNames?.errorText}`}>
          {errorText}
        </span>
      </section>
      <Footer customClassNames={customClassNames}/>
    </div>
  );
};