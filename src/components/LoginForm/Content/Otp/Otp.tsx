import { LoginMethods, TLoginOption } from "interfaces";
import { TCustomClassNames } from "@/components/LoginForm/Content/Otp/OtpStyles";
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
    <section className={`brlkit_buttons_container ${customClassNames?.otpButtonsContainer ?? ""}`}>
      {showEmail ? 
        <div className={`brlkit_input_container ${customClassNames?.inputContainer ?? ""}`}>
          <input
            type="email"
            id="otp-email-input"
            placeholder="Email address"
            value={email}
            className={`brlkit_input brlkit_input_focus ${customClassNames?.input ?? ""}`}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div 
            className={`brlkit_input_next ${customClassNames?.inputNext ?? ""}`} 
            onClick={() => emailOption?.onClick!(email)}
          >
            <NextArrow />
          </div>
        </div>
      :
        <button
          key={`otp-login-option-email`}
          id={`otp-login-option-email`}
          className={`brlkit_button ${customClassNames?.button ?? ""}`}
          onClick={() => setShowEmail(true)}
        >
          <span className={`brlkit_button_icon ${customClassNames?.buttonIcon ?? ""}`}>
            {emailOption?.icon}
          </span>
          <span className={`brlkit_button_text ${customClassNames?.buttonText ?? ""}`}>
            {emailOption?.label}
          </span>
        </button>
      }
      {/* do the same for upcoming SMS otp login */}
    </section>
  );
};