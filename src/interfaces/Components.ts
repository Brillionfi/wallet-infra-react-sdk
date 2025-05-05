import { CSSProperties } from "react";

export interface ICenterModal {
  children: React.ReactNode;
  isVisible: boolean;
  onHide: () => void;
  className?: string;
  contentStyle?: CSSProperties;

  // Header props
  headerLabel?: string;

  // Button props
  showButton?: boolean;
  buttonLabel?: string;
  isLoadingButton?: boolean;
  disableButton?: boolean;
  onClick?: () => void | Promise<void>;
}