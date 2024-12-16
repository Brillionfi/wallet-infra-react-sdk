import { LoginMethods } from "interfaces";
import { useState } from "react";
import { defaultStyles, TCustomStyles } from "@/components/LoginForm/LoginFormStyles";
import { Header } from "@/components/LoginForm/Header/Header";
import { Footer } from "@/components/LoginForm/Footer/Footer";
import { Content } from "@/components/LoginForm/Content/Content";

export const LoginForm = ({loginMethods, redirectUrl, onClose, customStyles}: {loginMethods: LoginMethods[], redirectUrl: string, onClose: () => void, customStyles?: TCustomStyles}) => {

  const [errorText, setErrorText] = useState<string>("");
  const [showInnerContent, setShowInnerContent] = useState<boolean>(false);

  const containerStyle = customStyles?.containerStyle ?? defaultStyles.container;
  const errorContainerStyle = customStyles?.errorContainerStyle ?? defaultStyles.errorContainer;
  const errorTextStyle = customStyles?.errorTextStyle ?? defaultStyles.errorStyle;

  return (
    <div style={containerStyle}>
      <Header 
        onClose={showInnerContent ? () => setShowInnerContent(false) : onClose} 
        customStyles={
          {
            ...customStyles, 
            headerText: showInnerContent? "Select wallet" : "Sign in"
          }
        }
      />

      <Content 
        loginMethods={loginMethods} 
        redirectUrl={redirectUrl} 
        setErrorText={setErrorText} 
        customStyles={customStyles} 
        showInnerContent={showInnerContent}
        toggleInnerContent={() => setShowInnerContent(!showInnerContent)}
      />

      <section style={errorContainerStyle}>
        <span style={errorTextStyle}>
          {errorText}
        </span>
      </section>
      <Footer customStyles={customStyles}/>
    </div>
  );
};