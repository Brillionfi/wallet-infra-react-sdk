import styled from 'styled-components';

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
  wcPopUpCardBody?: string;
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
  margin-bottom: auto;
`;

export const WcPopUpCardBody = styled.div`
  margin: auto 0px;
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
`;

export const WcPopUpCardButtonReject = styled.button`
  padding: 0.5rem 0.8rem;
  min-width: 100px;
  color: white;
  background-color: red;
  border-radius: 20px;
`;