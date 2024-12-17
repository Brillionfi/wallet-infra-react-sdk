import { LoginMethods, TLoginOption } from "interfaces";
import { defaultStyles, TCustomStyles } from "@/components/LoginForm/Content/Otp/OtpStyles";
import NextArrow from "@/components/icons/next-arrow";
import { useMemo, useState } from "react";

export const Otp = ({options, customStyles}: {options: TLoginOption[], customStyles?: TCustomStyles}) => {

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

  const otpButtonsContainerStyle = customStyles?.otpButtonsContainerStyle ?? defaultStyles.otpButtonsContainer;
  const otpButtonStyle = customStyles?.buttonStyle ?? defaultStyles.button;
  const otpButtonIconStyle = customStyles?.buttonIconStyle ?? defaultStyles.buttonIcon;
  const buttonTextStyle = customStyles?.buttonTextStyle ?? defaultStyles.buttonText;

  const otpInputContainerStyle = customStyles?.inputContainerStyle ?? defaultStyles.inputContainer;
  const otpInputStyle = customStyles?.inputStyle ?? defaultStyles.input;
  const otpInputNextStyle = customStyles?.inputNextStyle ?? defaultStyles.inputNext;

  return (
    <section style={otpButtonsContainerStyle}>
      {showEmail ? 
        <div style={otpInputContainerStyle}>
          <input
            type="email"
            id="otp-email-input"
            placeholder="Email address"
            value={email}
            style={otpInputStyle}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={otpInputNextStyle} onClick={() => emailOption?.onClick!(email)}>
            <NextArrow />
          </div>
        </div>
      :
        <button
          key={`otp-login-option-email`}
          id={`otp-login-option-email`}
          style={otpButtonStyle}
          onClick={() => setShowEmail(true)}
        >
          <span style={otpButtonIconStyle}>
            {emailOption?.icon}
          </span>
          <span style={buttonTextStyle}>
            {emailOption?.label}
          </span>
        </button>
      }
      {/* do the same for upcoming SMS otp login */}
    </section>
  );
};