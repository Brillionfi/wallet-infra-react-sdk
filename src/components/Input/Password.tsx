import React, { useState } from "react";
import EyeIcon from "@/components/icons/eye";
import EyeOffIcon from "@/components/icons/eye-off";

interface PasswordProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  feedback?: boolean;
  toggleMask?: boolean;
}

export const Password: React.FC<PasswordProps> = ({
  id,
  value,
  onChange,
  className = "",
  feedback = true,
  toggleMask = false,
}) => {
  const [isMasked, setIsMasked] = useState(true);

  return (
    <div className={`password-input ${className}`}>
      <input
        id={id}
        type={isMasked ? "password" : "text"}
        value={value}
        onChange={onChange}
        className="password-field"
      />
      {toggleMask && (
        <button
          type="button"
          onClick={() => setIsMasked(!isMasked)}
          className="toggle-mask"
        >
          {isMasked ? <EyeIcon/> : <EyeOffIcon/>}
        </button>
      )}
      {feedback && value.length < 8 && (
        <small className="password-feedback">
          Password must be at least 8 characters long.
        </small>
      )}
    </div>
  );
};