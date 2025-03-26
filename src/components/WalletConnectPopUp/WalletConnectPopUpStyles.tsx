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

export const WcPopUpContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
`;

export const WcPopUpCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  display: grid;
  min-width: 300px;
  min-height: 300px;
  max-width: 400px;
  max-height: 600px;
`;

export const WcPopUpCardHeader = styled.div`
  margin-bottom: 1rem;
  text-align: center;
`;

export const WcPopUpCardHeaderText = styled.span`
`;

export const WcPopUpCardBody = styled.div`
  background-color: lightgray;
  padding: 1rem;
  border-radius: 10px;
  overflow-wrap: anywhere;
  margin: auto;
  margin-bottom: 1rem;
`;

export const WcPopUpCardBodyText = styled.span`
`;

export const WcPopUpCardButtons = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const WcPopUpCardButtonApprove = styled.button`
  padding: 0.5rem 0.8rem;
  min-width: 100px;
  color: white;
  background-color: green;
  border-radius: 20px;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const WcPopUpCardButtonReject = styled.button`
  padding: 0.5rem 0.8rem;
  min-width: 100px;
  color: white;
  background-color: red;
  border-radius: 20px;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

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