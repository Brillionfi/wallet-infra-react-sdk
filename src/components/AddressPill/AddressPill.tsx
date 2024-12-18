import { defaultAddressPillStyles, TCustomAddressPillStyles } from "@/components/AddressPill/AddressPillStyles";
import { useBrillionContext } from "../BrillionContext";
import { useState } from "react";
import Copy from "../icons/copy";
import Check from "../icons/check";

export const AddressPill = ({customStyles}: {customStyles?: TCustomAddressPillStyles}) => {
  const [copied, setCopied] = useState(false);
  const { wallet } = useBrillionContext();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const containerStyle = customStyles?.containerStyle ? customStyles.containerStyle : defaultAddressPillStyles.container;
  const textContainerStyle = customStyles?.textContainerStyle ? customStyles.textContainerStyle : defaultAddressPillStyles.textContainer;
  const textStyle = customStyles?.textStyle ? customStyles.textStyle : defaultAddressPillStyles.text;
  const iconStyle = customStyles?.iconStyle ? customStyles.iconStyle : defaultAddressPillStyles.icon;

  return (
    <div style={containerStyle}>
      <div style={textContainerStyle} onClick={handleCopy}>
        <span style={textStyle}>
          {wallet.slice(0, 6)}...{wallet.slice(-6)}
        </span>
        <span style={iconStyle}>
          {copied ? <Check /> : <Copy />}
        </span>
      </div>
    </div>
  );
};