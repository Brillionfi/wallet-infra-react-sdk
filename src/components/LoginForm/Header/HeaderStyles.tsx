import styled from "styled-components";

export type TCustomClassNames = {
  headerContainer?: string;
  headerTextSection?: string;
  headerText?: string;
  showClose?: boolean;
  closeSection?: string;
};

export const HeaderContainer = styled.section`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const HeaderTextSection = styled.span`
  font-size: 1.2rem;
  color: #000;
  display: flex;
  align-tems: center;
  justify-content: center;
  gap: 0.8rem;
`;

export const CloseSection = styled.span`
  color: #000;
`;