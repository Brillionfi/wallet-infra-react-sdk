import { useBalance } from "hooks";
import { useEffect, useState } from "react";
import { defaultAssetsTableStyles, TAssetsTableCustomProps } from "@/components/AssetsTable/AssetsTableStyles";
import { Address } from "@brillionfi/wallet-infra-sdk";
import { IWalletPortfolio } from "@brillionfi/wallet-infra-sdk/dist/models";
import { useBrillionContext } from "../BrillionContext";

export const AssetsTable = ({address, customProps}: {address: Address, customProps?: TAssetsTableCustomProps}) => {
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

  const containerStyle = customProps?.containerStyle ? customProps.containerStyle : defaultAssetsTableStyles.container;
  const assetsListStyle = customProps?.assetsListStyle ? customProps.assetsListStyle : defaultAssetsTableStyles.assetsList;
  const assetStyle = customProps?.assetStyle ? customProps.assetStyle : defaultAssetsTableStyles.asset;

  const assetLeftContainerStyle = customProps?.assetLeftContainerStyle ? customProps.assetLeftContainerStyle : defaultAssetsTableStyles.assetLeftContainerStyle;
  const assetNameStyle = customProps?.assetNameStyle ? customProps.assetNameStyle : defaultAssetsTableStyles.assetNameStyle;
  const assetAddressStyle = customProps?.assetAddressStyle ? customProps.assetAddressStyle : defaultAssetsTableStyles.assetAddressStyle;
  
  const assetRightContainerStyle = customProps?.assetRightContainerStyle ? customProps.assetRightContainerStyle : defaultAssetsTableStyles.assetRightContainerStyle;
  const assetMoneyStyle = customProps?.assetMoneyStyle ? customProps.assetMoneyStyle : defaultAssetsTableStyles.assetMoneyStyle;
  const assetBalanceStyle = customProps?.assetBalanceStyle ? customProps.assetBalanceStyle : defaultAssetsTableStyles.assetBalanceStyle;

  const errorContainerStyle = customProps?.errorContainerStyle ? customProps.errorContainerStyle : defaultAssetsTableStyles.errorContainer;
  const errorTextStyle = customProps?.errorTextStyle ? customProps.errorTextStyle : defaultAssetsTableStyles.errorText;

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