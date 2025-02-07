import { LoginMethods, TLoginOption } from "interfaces";
import { Button, ButtonIcon, ButtonText, InputContainer, InputNext } from "@/components/LoginForm/Content/CommonStyles";
import { ButtonsContainer, EmailInput, TCustomClassNames } from "@/components/LoginForm/Content/Otp/OtpStyles";
import NextArrow from "@/components/icons/next-arrow";
import { useMemo, useState } from "react";

export const Otp = ({options, customClassNames}: {options: TLoginOption[], customClassNames?: TCustomClassNames}) => {

  const [showEmail, setShowEmail] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const { emailOption } = useMemo(() => {
    let emailOption: TLoginOption | undefined;
    for (const option of options) {
      if (option.label === LoginMethods.Email) {
        emailOption = option;
      }
    }
    return { emailOption };    
    // do the same for upcoming SMS otp login
  }, [options])

  return (
    <ButtonsContainer className={customClassNames?.otpButtonsContainer}>
      {showEmail ? 
        <InputContainer className={customClassNames?.inputContainer}>
          <EmailInput
            type="email"
            id="otp-email-input"
            placeholder="Email address"
            value={email}
            className={customClassNames?.input}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputNext 
            className={customClassNames?.inputNext} 
            onClick={() => emailOption?.onClick!(email)}
          >
            <NextArrow />
          </InputNext>
        </InputContainer>
      :
        <Button
          key={`otp-login-option-email`}
          id={`otp-login-option-email`}
          className={customClassNames?.button}
          onClick={() => setShowEmail(true)}
        >
          <ButtonIcon className={customClassNames?.buttonIcon}>
            {emailOption?.icon}
          </ButtonIcon>
          <ButtonText className={customClassNames?.buttonText}>
            {emailOption?.label}
          </ButtonText>
        </Button>
      }
      {/* do the same for upcoming SMS otp login */}
    </ButtonsContainer>
  );
};