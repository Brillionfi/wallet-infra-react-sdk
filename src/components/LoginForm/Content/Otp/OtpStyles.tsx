import { Input, TCustomClassNames as TCustomCommonClassNames } from '@/components/LoginForm/Content/CommonStyles';
import styled from "styled-components";

export type TCustomClassNames = {
  otpButtonsContainer?: string;
} & TCustomCommonClassNames;

export const EmailInput = styled(Input)`
  &:focus {
    border: none;
    outline: none;
  }
`;

export const ButtonsContainer = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;