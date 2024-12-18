import { useMemo, useState } from "react";
import { defaultChainSelectorStyles, TCustomChainSelectorStyles } from "@/components/ChainSelector/ChainSelectorStyles";
import { useBrillionContext } from "@/components/BrillionContext";
import { CHAINS_INFO, IChainSelectorProps, PROD_NETWORKS, TEST_NETWORKS } from "@/interfaces/ChainSelector";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

export const ChainSelector = ({data, customStyles}: {data?: IChainSelectorProps, customStyles?: TCustomChainSelectorStyles}) => {
  const { chain, changeChain } = useBrillionContext();
  const [open, setOpen] = useState(false);

  const chains = useMemo(() => {
    const filteredChains: SUPPORTED_CHAINS[] = [];
    if(data?.networks) {
      filteredChains.push(...data.networks)
    }else{
      filteredChains.push(...PROD_NETWORKS);
    }
    if(data?.enableTestNetworks){
      filteredChains.push(...TEST_NETWORKS);
    }
    return filteredChains
  }, [data])
  
  const containerStyle = customStyles?.containerStyle ? customStyles.containerStyle : defaultChainSelectorStyles.container;
  const dropdownStyle = customStyles?.dropdownStyle ? customStyles.dropdownStyle : defaultChainSelectorStyles.dropdown;
  const dropdownIconsStyle = customStyles?.dropdownIconsStyle ? customStyles.dropdownIconsStyle : defaultChainSelectorStyles.dropdownIcons;
  const dropdownContainerStyle = customStyles?.dropdownContainerStyle ? customStyles.dropdownContainerStyle : defaultChainSelectorStyles.dropdownContainer;
  const dropdownListStyle = customStyles?.dropdownListStyle ? customStyles.dropdownListStyle : defaultChainSelectorStyles.dropdownList;
  const dropdownOptionStyle = customStyles?.dropdownOptionStyle ? customStyles.dropdownOptionStyle : defaultChainSelectorStyles.dropdownOption;

  return (
    <div style={containerStyle}>
      <button
        style={dropdownStyle}
        onClick={() => setOpen(!open)}
      >
        <div style={dropdownIconsStyle}>
          {CHAINS_INFO[chain].icon}
        </div> 
        {CHAINS_INFO[chain].name}
      </button>
      {open && (
        <div style={dropdownContainerStyle}>
          <ul style={dropdownListStyle}>
            {chains.map((chain) => {
              const chainInfo = CHAINS_INFO[chain]
              return (
                <li
                  key={`chain-selector-${chainInfo.chainId}`}
                  style={dropdownOptionStyle}
                  onClick={() => {setOpen(false); changeChain(chainInfo.chainId)}}
                >
                  <div style={dropdownIconsStyle}>
                    {chainInfo.icon}
                  </div> 
                  {chainInfo.name}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  );
};