import React from "react";

interface DialogProps {
  children: React.ReactNode;
  visible: boolean;
  header?: string;
  footer?: React.ReactNode;
  contentStyle?: React.CSSProperties;
  className?: string;
  modal?: boolean;
  position?: "center" | "top" | "bottom" | "left" | "right";
  onHide: () => void;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  visible,
  header,
  footer,
  contentStyle = {},
  className = "",
  modal = true,
  position = "center",
  onHide,
}) => {
  if (!visible) return null;

  return (
    <div className={`dialog-overlay ${modal ? "modal" : ""}`}>
      <div
        className={`dialog-container ${position} ${className}`}
        style={contentStyle}
      >
        {header && <div className="dialog-header">{header}</div>}
        <div className="dialog-content">{children}</div>
        {footer && <div className="dialog-footer">{footer}</div>}
        <button className="dialog-close" onClick={onHide}>
          ×
        </button>
      </div>
    </div>
  );
};