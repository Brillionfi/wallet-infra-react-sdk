import React from "react";

interface RadioButtonProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  onChange: React.ChangeEventHandler<RadioButtonProps["value"]> | undefined;
  inputId?: string;
  checked: boolean;
  disabled?: boolean;
  className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  inputId,
  name,
  value,
  onChange,
  checked,
  disabled = false,
  className = "",
}) => {

  return (
    <div className={`radio-button ${className}`}>
      <input
        type="radio"
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        className="radio-input"
      />
      <label htmlFor={inputId} className={`radio-label ${disabled ? "disabled" : ""}`}>
        <span className="radio-circle" />
      </label>
    </div>
  );
};