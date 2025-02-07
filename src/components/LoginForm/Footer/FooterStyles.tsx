import styled from "styled-components";

export type TCustomClassNames = {
  footerContainer?: string;
  footerTextSection?: string;
  footerText?: string;
};

export const FooterContainer = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`;

export const FooterTextSection = styled.span`
  font-size: 0.8rem;
  color: #838383;
`;