import { TCustomClassNames as TCustomContentClassNames } from '@/components/LoginForm/Content/ContentStyles';
import { TCustomClassNames as TCustomHeaderClassNames } from '@/components/LoginForm/Header/HeaderStyles';
import { TCustomClassNames as TCustomFooterClassNames } from '@/components/LoginForm/Footer/FooterStyles';
import styled from 'styled-components';

export type TConfig = {
  showClose?: boolean;
  footerText?: string;
  customClassNames: TCustomClassNames;
}

export type TCustomClassNames = {
  mainContainer?: string;
  errorContainer?: string;
  errorText?: string;
} & TCustomFooterClassNames & TCustomHeaderClassNames & TCustomContentClassNames;

export const MainContainer = styled.div`
  background-color: #FCFCFC;
  border-radius: 16px;
  border: 1px solid #E8E8E8;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  width: 314px;
  min-height: 436px;
`;

export const ErrorContainer = styled.section`
  margin-top: 1rem;
`;

export const ErrorStyle = styled.span`
  color: red;
`;