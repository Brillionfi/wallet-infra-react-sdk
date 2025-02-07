import { TCustomClassNames as TCustomCommonClassNames } from '@/components/LoginForm/Content/CommonStyles';
import styled from "styled-components";

export type TCustomClassNames = {
  walletButtonsContainer?: string;
  walletButton?: string;
  walletButtonIcon?: string;
  walletButtonText?: string;
} & TCustomCommonClassNames;

export const WalletButtonsContainer = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const WalletButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
  height: 48px;
  gap: 11px;
`;

export const WalletButtonIcon = styled.span`
  height: 48px;
  width: 48px;
  border-radius: 8px;
`;

export const WalletButtonText = styled.span`
  color: #1C2024;
`;