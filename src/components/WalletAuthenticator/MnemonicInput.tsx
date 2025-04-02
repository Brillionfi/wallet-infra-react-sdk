import { IMnemonicInputProps } from "@/interfaces";
import styled from "styled-components";
import { InputText, Password } from "../Input";

const styleInputs = `
  input {
    max-width: 9rem;
  }
  @media (max-width: 1280px) {
    input {
      max-width: 8rem;
    }
  }
  
  @media (max-width: 1024px) {
    input {
      max-width: 7rem;
    }
  }
`;

const StyledPassword = styled(Password)`
  ${styleInputs}
`;

const StyledInputText = styled(InputText)`
  ${styleInputs}
`;

export const MnemonicInput = ({
  phrase = Array(12).fill(""),
  type = "input",
  onChange,
}: IMnemonicInputProps) => {
  const handleChange = (index: number, value: string) => {
    let mnemonic = [...phrase];
    mnemonic[index] = value;

    if (index === 0 && value.includes(" ")) {
      mnemonic = value.split(" ");
    }
    onChange?.(mnemonic);
  };

  return (
    <div className="mnemonic-input-container">
      <div className="mnemonic-input-grid">
        {phrase.map((word, index) => (
          <div key={index} className="mnemonic-input-item">
            <label
              htmlFor={`mnemonic-${index}`}
              className={`mnemonic-input-label ${
                index < 9 ? "pl-2" : index > 9 ? "pl-1" : ""
              }`}
            >
              {index + 1}.
            </label>
            {type === "input" && (
              <StyledPassword
                id={`mnemonic-${index}`}
                value={word}
                onChange={(e) => handleChange(index, e.target.value)}
                className="mnemonic-input-field"
                feedback={false}
                toggleMask
              />
            )}
            {type === "copy" && (
              <StyledInputText
                id={`mnemonic-${index}`}
                value={word}
                readOnly
                className="mnemonic-input-field"
                onChange={(e) => handleChange(index, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
