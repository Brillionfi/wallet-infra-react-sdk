import React from "react";

interface ButtonProps {
  id?: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  icon?: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  id,
  label,
  onClick,
  disabled = false,
  loading = false,
  autoFocus = false,
  icon,
  className = "",
}) => {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled || loading}
      autoFocus={autoFocus}
      className={`btn ${className} ${disabled ? "btn-disabled" : ""}`}
    >
      {loading ? (
        <span className="spinner" />
      ) : (
        <>
          {icon && <i className={`icon ${icon}`} />}
          {label}
        </>
      )}
    </button>
  );
};