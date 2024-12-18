import { useBalance } from "hooks";
import { useEffect, useState } from "react";
import { defaultAssetsTableStyles, TCustomAssetsTableStyles } from "@/components/AssetsTable/AssetsTableStyles";
import { Address } from "@brillionfi/wallet-infra-sdk";
import { IWalletPortfolio } from "@brillionfi/wallet-infra-sdk/dist/models";
import { useBrillionContext } from "../BrillionContext";

export const AssetsTable = ({address, customStyles}: {address: Address, customStyles?: TCustomAssetsTableStyles}) => {
  const { chain } = useBrillionContext();
  const { getPortfolio } = useBalance();

  const [assests, setAssests] = useState<IWalletPortfolio>();
  const [errorText, setErrorText] = useState<string>("");

  const loadBalances = async () => {
    try {
      const portfolio = await getPortfolio(address, chain);
      setAssests(portfolio);
      setErrorText("")
    } catch (error) {
      setErrorText((error as Error).message);
    }
  }

  useEffect(() => {
    if(address && chain) loadBalances();
  }, [address, chain])

  const containerStyle = customStyles?.containerStyle ? customStyles.containerStyle : defaultAssetsTableStyles.container;
  const assetsListStyle = customStyles?.assetsListStyle ? customStyles.assetsListStyle : defaultAssetsTableStyles.assetsList;
  const assetStyle = customStyles?.assetStyle ? customStyles.assetStyle : defaultAssetsTableStyles.asset;

  const assetLeftContainerStyle = customStyles?.assetLeftContainerStyle ? customStyles.assetLeftContainerStyle : defaultAssetsTableStyles.assetLeftContainerStyle;
  const assetNameStyle = customStyles?.assetNameStyle ? customStyles.assetNameStyle : defaultAssetsTableStyles.assetNameStyle;
  const assetAddressStyle = customStyles?.assetAddressStyle ? customStyles.assetAddressStyle : defaultAssetsTableStyles.assetAddressStyle;
  
  const assetRightContainerStyle = customStyles?.assetRightContainerStyle ? customStyles.assetRightContainerStyle : defaultAssetsTableStyles.assetRightContainerStyle;
  const assetMoneyStyle = customStyles?.assetMoneyStyle ? customStyles.assetMoneyStyle : defaultAssetsTableStyles.assetMoneyStyle;
  const assetBalanceStyle = customStyles?.assetBalanceStyle ? customStyles.assetBalanceStyle : defaultAssetsTableStyles.assetBalanceStyle;

  const errorContainerStyle = customStyles?.errorContainerStyle ? customStyles.errorContainerStyle : defaultAssetsTableStyles.errorContainer;
  const errorTextStyle = customStyles?.errorTextStyle ? customStyles.errorTextStyle : defaultAssetsTableStyles.errorText;

  return (
    <div style={containerStyle}>
      <section style={assetsListStyle}>
        {assests?.portfolio.map((asset) => (
          <div
            key={`asset-${asset.tokenId}`}
            id={`asset-${asset.tokenId}`}
            style={assetStyle}
          >
            <div style={assetLeftContainerStyle}>
              <span style={assetNameStyle}>{asset.tokenId}</span>
              <span style={assetAddressStyle}>{asset.address}</span>
            </div>
            <div style={assetRightContainerStyle}>
              <span style={assetMoneyStyle}>${(BigInt(asset.tokenPriceUsd?.split(".")[0] ?? 0) * BigInt(asset.balance)).toLocaleString()}</span>
              <span style={assetBalanceStyle}>{asset.balance} {asset.tokenId}</span>
            </div>
          </div>
        ))}
        <section style={errorContainerStyle}>
          <span style={errorTextStyle}>
            {errorText}
          </span>
        </section>
      </section>
    </div>
  );
};