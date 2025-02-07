import styled from "styled-components";

export type TCustomClassNames = {
  button?: string;
  buttonIcon?: string;
  buttonText?: string;
  inputContainer?: string;
  input?: string;
  inputNext?: string;
};

export const Button = styled.button`
  width: 100%;
  border: 1px solid #0009321F;
  background: #fff;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  gap: 8px;
`;

export const ButtonIcon = styled.span`
  width: 16px;
  height: 16px;
`;

export const ButtonText = styled.span`
  color: "#1C2024",
`;

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 0.5rem;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #0009321F;
`;

export const Input = styled.input`
  border: none,
`;

export const InputNext = styled.div`
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;