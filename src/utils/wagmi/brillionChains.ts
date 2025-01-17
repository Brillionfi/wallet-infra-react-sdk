import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

const defaultRpcUrls = "https://api.platform.brillion.finance";

const Ethereum = (baseUrl?: string) => ({
  id: Number(SUPPORTED_CHAINS.ETHEREUM),
  name: 'Ethereum',
  network: 'ethereum',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH', 
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [`${baseUrl ?? defaultRpcUrls}/rpc/chainId/${SUPPORTED_CHAINS.ETHEREUM}`],
      webSocket: ['wss://rpc.mycustomchain.com/ws'], // TODO
    },
    public: {
      http: [`${baseUrl ?? defaultRpcUrls}/rpc/chainId/${SUPPORTED_CHAINS.ETHEREUM}`],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io/',
    },
  },
  testnet: false,
});

const Sepolia = (baseUrl?: string) => ({
  id: Number(SUPPORTED_CHAINS.ETHEREUM_SEPOLIA),
  name: 'Ethereum Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH', 
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [`${baseUrl ?? defaultRpcUrls}/rpc/chainId/${SUPPORTED_CHAINS.ETHEREUM_SEPOLIA}`],
      webSocket: ['wss://rpc.mycustomchain.com/ws'], // TODO
    },
    public: {
      http: [`${baseUrl ?? defaultRpcUrls}/rpc/chainId/${SUPPORTED_CHAINS.ETHEREUM_SEPOLIA}`],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sepolia Etherscan',
      url: 'https://sepolia.etherscan.io/',
    },
  },
  testnet: true,
});

export const BrillionChains = (baseUrl?: string) => ({
  Ethereum: Ethereum(baseUrl),
  Sepolia: Sepolia(baseUrl),
})