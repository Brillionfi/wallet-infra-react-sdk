import { useMemo, useState } from "react";
import { defaultChainSelectorStyles, TChainSelectorCustomProps } from "@/components/ChainSelector/ChainSelectorStyles";
import { useBrillionContext } from "@/components/BrillionContext";
import { CHAINS_INFO, IChainSelectorProps, PROD_NETWORKS, TEST_NETWORKS } from "@/interfaces/ChainSelector";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

export const ChainSelector = ({data, customProps}: {data?: IChainSelectorProps, customProps?: TChainSelectorCustomProps}) => {
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
  
  const containerStyle = customProps?.containerStyle ? customProps.containerStyle : defaultChainSelectorStyles.container;
  const dropdownStyle = customProps?.dropdownStyle ? customProps.dropdownStyle : defaultChainSelectorStyles.dropdown;
  const dropdownIconsStyle = customProps?.dropdownIconsStyle ? customProps.dropdownIconsStyle : defaultChainSelectorStyles.dropdownIcons;
  const dropdownContainerStyle = customProps?.dropdownContainerStyle ? customProps.dropdownContainerStyle : defaultChainSelectorStyles.dropdownContainer;
  const dropdownListStyle = customProps?.dropdownListStyle ? customProps.dropdownListStyle : defaultChainSelectorStyles.dropdownList;
  const dropdownOptionStyle = customProps?.dropdownOptionStyle ? customProps.dropdownOptionStyle : defaultChainSelectorStyles.dropdownOption;

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