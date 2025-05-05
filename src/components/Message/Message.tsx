import React from "react";

interface MessageProps {
  severity?: "info" | "warn" | "error" | "success";
  content: React.ReactNode;
  className?: string;
}

export const Message: React.FC<MessageProps> = ({
  severity = "info",
  content,
  className = "",
}) => {
  const severityStyles = {
    info: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      borderLeft: "4px solid #93c5fd",
    },
    warn: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      borderLeft: "4px solid #fcd34d",
    },
    error: {
      backgroundColor: "#fee2e2",
      color: "#b91c1c",
      borderLeft: "4px solid #fca5a5",
    },
    success: {
      backgroundColor: "#d1fae5",
      color: "#065f46",
      borderLeft: "4px solid #6ee7b7",
    },
  };

  return (
    <div
      style={{
        ...severityStyles[severity],
        padding: "16px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      className={`message ${className}`}
    >
      {content}
    </div>
  );
};