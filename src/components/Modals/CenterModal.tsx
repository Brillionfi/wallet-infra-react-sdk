import type { ICenterModal } from "@/interfaces";
import { Dialog } from "./Dialog";
import { Button } from "../Button";

export const CenterModal = ({
  children,
  isVisible,
  onHide,
  headerLabel,
  showButton,
  buttonLabel,
  isLoadingButton,
  disableButton,
  onClick,
  className,
  contentStyle,
}: ICenterModal) => {
  const FooterElement = (
    <Button
      id={`button-${buttonLabel?.toLowerCase()}`}
      autoFocus
      label={buttonLabel ?? ""}
      loading={isLoadingButton}
      disabled={disableButton}
      onClick={onClick}
    />
  );

  return (
    <Dialog
      modal
      contentStyle={contentStyle}
      className={`center-modal ${className}`}
      position="center"
      visible={isVisible}
      header={headerLabel}
      footer={showButton ? FooterElement : undefined}
      onHide={() => onHide()}
    >
      {children}
    </Dialog>
  );
};
