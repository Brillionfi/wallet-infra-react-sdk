import React from "react";

interface InputTextProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  readOnly?: boolean;
}

export const InputText: React.FC<InputTextProps> = ({
  id,
  value,
  onChange,
  className = "",
  readOnly = false,
}) => {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`input-text ${className}`}
    />
  );
};