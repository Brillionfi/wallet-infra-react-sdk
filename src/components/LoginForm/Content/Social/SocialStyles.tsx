import { TCustomClassNames as TCustomCommonClassNames } from '@/components/LoginForm/Content/CommonStyles';
import styled from "styled-components";

export type TCustomClassNames = {
  socialButtonsContainer?: string;
  socialButton?: string;
  socialButtonIcon?: string;
} & TCustomCommonClassNames;

export const SocialButtonsContainer = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  gap: 10px;
`;

export const SocialButton = styled.button`
  color: #fefefe;
  border: 1px solid #A7B3CC;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 12px;
  cursor: pointer;
`;

export const SocialButtonIcon = styled.span`
  width: 25px;
  height: 25px;
`;