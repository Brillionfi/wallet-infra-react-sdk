import ArbitrumLogo from "@/components/icons/arbitrum-logo";
import AvalancheLogo from "@/components/icons/avalanche-logo";
import BaseLogo from "@/components/icons/base-logo";
import CosmosLogo from "@/components/icons/cosmos-logo";
import EthereumLogo from "@/components/icons/ethereum-logo";
import PolygonLogo from "@/components/icons/polygon-logo";
import SolanaLogo from "@/components/icons/solana-logo";
import TelosLogo from "@/components/icons/telos-logo";
import TronLogo from "@/components/icons/tron-logo";
import VanarLogo from "@/components/icons/vanar-logo";
import ZilliqaLogo from "@/components/icons/zilliqa-logo";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

export interface IChainSelectorProps {
  enableTestNetworks?: boolean;
  networks?: SUPPORTED_CHAINS[];
}

export type TChainInfo = {
  name: string;
  chainId: SUPPORTED_CHAINS;
  icon?: JSX.Element;
};

export const CHAINS_INFO: Record<SUPPORTED_CHAINS, TChainInfo> = {
  [SUPPORTED_CHAINS.ARBITRUM]: {
    name: "Arbitrum",
    chainId: SUPPORTED_CHAINS.ARBITRUM,
    icon: ArbitrumLogo(),
  },
  [SUPPORTED_CHAINS.ARBITRUM_TESTNET]: {
    name: "Arbitrum Testnet",
    chainId: SUPPORTED_CHAINS.ARBITRUM_TESTNET,
    icon: ArbitrumLogo(),
  },
  [SUPPORTED_CHAINS.AVALANCHE]: {
    name: "Avalanche",
    chainId: SUPPORTED_CHAINS.AVALANCHE,
    icon: AvalancheLogo(),
  },
  [SUPPORTED_CHAINS.AVALANCHE_FUJI_TESTNET]: {
    name: "Avalanche Fuji",
    chainId: SUPPORTED_CHAINS.AVALANCHE_FUJI_TESTNET,
    icon: AvalancheLogo(),
  },
  [SUPPORTED_CHAINS.BASE]: {
    name: "Base",
    chainId: SUPPORTED_CHAINS.BASE,
    icon: BaseLogo(),
  },
  [SUPPORTED_CHAINS.BASE_SEPOLIA]: {
    name: "Base Sepolia",
    chainId: SUPPORTED_CHAINS.BASE_SEPOLIA,
    icon: BaseLogo(),
  },
  [SUPPORTED_CHAINS.ETHEREUM]: {
    name: "Ethereum",
    chainId: SUPPORTED_CHAINS.ETHEREUM,
    icon: EthereumLogo(),
  },
  [SUPPORTED_CHAINS.ETHEREUM_SEPOLIA]: {
    name: "Ethereum Sepolia",
    chainId: SUPPORTED_CHAINS.ETHEREUM_SEPOLIA,
    icon: EthereumLogo(),
  },
  [SUPPORTED_CHAINS.POLYGON]: {
    name: "Polygon",
    chainId: SUPPORTED_CHAINS.POLYGON,
    icon: PolygonLogo(),
  },
  [SUPPORTED_CHAINS.POLYGON_AMOY]: {
    name: "Polygon Amoy",
    chainId: SUPPORTED_CHAINS.POLYGON_AMOY,
    icon: PolygonLogo(),
  },
  [SUPPORTED_CHAINS.SOLANA]: {
    name: "Solana",
    chainId: SUPPORTED_CHAINS.SOLANA,
    icon: SolanaLogo(),
  },
  [SUPPORTED_CHAINS.SOLANA_TESTNET]: {
    name: "Solana Testnet",
    chainId: SUPPORTED_CHAINS.SOLANA_TESTNET,
    icon: SolanaLogo(),
  },
  [SUPPORTED_CHAINS.TELOS]: {
    name: "Telos",
    chainId: SUPPORTED_CHAINS.TELOS,
    icon: TelosLogo(),
  },
  [SUPPORTED_CHAINS.TELOS_TESTNET]: {
    name: "Telos Testnet",
    chainId: SUPPORTED_CHAINS.TELOS_TESTNET,
    icon: TelosLogo(),
  },
  [SUPPORTED_CHAINS.TRON]: {
    name: "Tron",
    chainId: SUPPORTED_CHAINS.TRON,
    icon: TronLogo(),
  },
  [SUPPORTED_CHAINS.TRON_TESTNET]: {
    name: "Tron Testnet",
    chainId: SUPPORTED_CHAINS.TRON_TESTNET,
    icon: TronLogo(),
  },
  [SUPPORTED_CHAINS.VANAR]: {
    name: "Vanar",
    chainId: SUPPORTED_CHAINS.VANAR,
    icon: VanarLogo(),
  },
  [SUPPORTED_CHAINS.VANAR_VANGUARD]: {
    name: "Vanar Vanguard",
    chainId: SUPPORTED_CHAINS.VANAR_VANGUARD,
    icon: VanarLogo(),
  },
  [SUPPORTED_CHAINS.ZILLIQA]: {
    name: "Zilliqa",
    chainId: SUPPORTED_CHAINS.ZILLIQA,
    icon: ZilliqaLogo(),
  },
  [SUPPORTED_CHAINS.ZILLIQA2_PROTO_TESTNET]: {
    name: "Zilliqa Proto Testnet",
    chainId: SUPPORTED_CHAINS.ZILLIQA2_PROTO_TESTNET,
    icon: ZilliqaLogo(),
  },
  [SUPPORTED_CHAINS.ZILLIQA_TESTNET]: {
    name: "Zilliqa Testnet",
    chainId: SUPPORTED_CHAINS.ZILLIQA_TESTNET,
    icon: ZilliqaLogo(),
  },
  [SUPPORTED_CHAINS.COSMOS]: {
    name: "Cosmos",
    chainId: SUPPORTED_CHAINS.COSMOS,
    icon: CosmosLogo(),
  },
};

export const TEST_NETWORKS = [
  SUPPORTED_CHAINS.ARBITRUM_TESTNET,
  SUPPORTED_CHAINS.AVALANCHE_FUJI_TESTNET,
  SUPPORTED_CHAINS.BASE_SEPOLIA,
  SUPPORTED_CHAINS.ETHEREUM_SEPOLIA,
  SUPPORTED_CHAINS.POLYGON_AMOY,
  SUPPORTED_CHAINS.SOLANA_TESTNET,
  SUPPORTED_CHAINS.TELOS_TESTNET,
  SUPPORTED_CHAINS.TRON_TESTNET,
  SUPPORTED_CHAINS.VANAR_VANGUARD,
  SUPPORTED_CHAINS.ZILLIQA2_PROTO_TESTNET,
  SUPPORTED_CHAINS.ZILLIQA_TESTNET,
];

export const PROD_NETWORKS = [
  SUPPORTED_CHAINS.ARBITRUM,
  SUPPORTED_CHAINS.AVALANCHE,
  SUPPORTED_CHAINS.BASE,
  SUPPORTED_CHAINS.COSMOS,
  SUPPORTED_CHAINS.ETHEREUM,
  SUPPORTED_CHAINS.POLYGON,
  SUPPORTED_CHAINS.SOLANA,
  SUPPORTED_CHAINS.TELOS,
  SUPPORTED_CHAINS.TRON,
  SUPPORTED_CHAINS.VANAR,
  SUPPORTED_CHAINS.ZILLIQA,
];

export const NETWORKS = [...TEST_NETWORKS, ...PROD_NETWORKS];
