import { useCallback, useEffect, useMemo, useState } from "react";
import { CenterModal } from "@/components";
import { IMnemonicModal } from "@/interfaces";

import { MnemonicInput } from "./MnemonicInput";
import { Message } from "../Message/Message";

export const MnemonicModal = ({
  isVisible,
  onHide,
  onFinish,
  phrase,
  type = "input",
  authenticatorName,
  isLoading,
}: IMnemonicModal) => {
  const [needsVerify, setNeedsVerify] = useState<boolean>(false);
  const [currentType, setCurrentType] = useState<"copy" | "input">("input");
  const [currentMnemonic, setCurrentMnemonic] = useState<string[]>(
    Array(12).fill(""),
  );
  const labels = {
    copy: {
      title: "Write down your Mnemonic",
      description: "This is your Mnemonic. Write it down and keep it in a safe place. You will need it to sign your wallet.",
      loadPhrase: "Download file",
      copyPhrase: "Copy to clipboard",
      confirmButton: "Continue"
    },
    input: {
      title: "Mnemonic",
      description: "Please enter your Mnemonic phrase confirm for selected authenticator.",
      loadPhrase: "Upload file",
      confirmButton: "Confirm",
      inputLabel: "Mnemonic",
      inputPlaceholder: "Mnemonic phrase"
    },
  };
  const warningMessages = [
    {
      summary: "Not Your Wallet Seed Phrase",
      detail: "This mnemonic is solely for authentication and does not grant access to a wallet.",
    },
    {
      summary: "Authentication Purpose Only",
      detail: "Use this mnemonic exclusively to authenticate yourself by signing messages.",
    },
    {
      summary: "Store Carefully",
      detail: "We do not store this mnemonic; it's generated once in your browser. Please store it securely.",
    },
  ];

  const canFinish = useMemo(() => {
    return currentMnemonic.every((value) => value !== "");
  }, [currentMnemonic]);

  const modalTexts = useMemo(() => {
    return {
      title: labels[currentType].title,
      description: labels[currentType].description,
      buttonLabel: labels[currentType].confirmButton,
    };
  }, [currentType, authenticatorName]);

  useEffect(() => {
    if (!phrase || type === "input") return;
    setCurrentType(type);
    setCurrentMnemonic(phrase);
  }, [phrase, type]);

  const verify = useCallback(() => {
    if (phrase?.length !== currentMnemonic.length) return false;
    return phrase.every((value, index) => value === currentMnemonic[index]);
  }, [currentMnemonic, phrase]);

  const onNextStep = useCallback(() => {
    if (currentType === "copy") {
      setNeedsVerify(true);
      setCurrentType("input");
    } else {
      const isValidPhrase = verify();
      if (needsVerify && (!isValidPhrase || !canFinish)) {
        // TODO: handle errors
        return;
      }
      onFinish(currentMnemonic);
      setNeedsVerify(false);
    }
    setCurrentMnemonic(Array(12).fill(""));
  }, [
    currentMnemonic,
    currentType,
    canFinish,
    needsVerify,
    onFinish,
    verify,
  ]);

  const handleOnChange = (phrase: string[]) => {
    setCurrentMnemonic(phrase);
  };

  // Download or upload mnemonic phrase
  const handleMnemonicFile = () => {
    if (currentType === "copy") {
      const mnemonicTextPlan = currentMnemonic.join(" ");
      const blob = new Blob([mnemonicTextPlan], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${authenticatorName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
    } else {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "text/plain";
      fileInput.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const text = e.target?.result as string;
              const mnemonicArray = text.split(" ");
              if (mnemonicArray.length !== 12) {
                throw new Error("Invalid mnemonic length");
              }
              setCurrentMnemonic(mnemonicArray);
            } catch (error) {
              console.error("handleMnemonicFile error: ", error);
              throw new Error("Invalid mnemonic file");
            }
          };
          reader.onerror = () => {
            throw new Error("Error reading file");
            
          };
          reader.readAsText(file);
        }
      };
      fileInput.click();
    }
  };

  const messageContent = (
    <div className="mnemonic-modal-message-content">
      <div className="mnemonic-modal-message-header">
        <i className="pi pi-exclamation-triangle mnemonic-modal-message-icon" />
        <div className="mnemonic-modal-message-title">Important Security Notice</div>
      </div>
      <ul className="mnemonic-modal-message-list">
        {warningMessages.map((msg, index) => (
          <li key={`msg-${index}`} className="mnemonic-modal-message-item">
            <p>
              <span className="mnemonic-modal-message-item-bold">{msg.summary}: </span>
              <span>{msg.detail}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <CenterModal
      showButton
      isVisible={isVisible}
      onHide={onHide}
      headerLabel={modalTexts.title}
      buttonLabel={modalTexts.buttonLabel}
      isLoadingButton={isLoading}
      disableButton={!canFinish}
      onClick={onNextStep}
      className="mnemonic-modal"
      contentStyle={{ minHeight: 135, paddingBottom: "0px" }}
    >
      <p className="mnemonic-modal-description">{modalTexts.description}</p>
      <Message
        className="mnemonic-modal-message sm-hidden"
        severity="warn"
        content={messageContent}
      />
      <MnemonicInput
        phrase={currentMnemonic}
        onChange={handleOnChange}
        type={currentType}
      />
      <div className="mnemonic-modal-input-container">
        <p
          className="mnemonic-modal-file-link"
          onClick={handleMnemonicFile}
        >
          <span>{labels[currentType].loadPhrase}</span>
        </p>
        {currentType === "copy" && (
          <p
            className="mnemonic-modal-file-link"
            onClick={() =>
              navigator.clipboard.writeText(currentMnemonic.join(" "))
            }
          >
            <span>{labels.copy.copyPhrase}</span>
          </p>
        )}
      </div>
      <Message
        className="mnemonic-modal-message sm-visible"
        severity="warn"
        content={messageContent}
      />
    </CenterModal>
  );
};
