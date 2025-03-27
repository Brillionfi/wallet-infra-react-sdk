import styled, { keyframes } from 'styled-components';

export type PromptData = {
  tittle: string;
  message: string;
  rejectAction: () => Promise<void>;
  approveAction: () => Promise<void>;
}

export type TPopUpConfig = {
  customClassNames: TPopUpCustomClassNames;
}

export type TPopUpCustomClassNames = {
  wcPopUpContainer?: string;
  wcPopUpCard?: string;
  wcPopUpCardHeader?: string;
  wcPopUpCardHeaderText?: string;
  wcPopUpCardBody?: string;
  wcPopUpCardBodyText?: string;
  wcPopUpCardButtons?: string;
  wcPopUpCardButtonApprove?: string;
  wcPopUpCardButtonReject?: string;
};

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: ${spin} 0.8s linear infinite;
`;