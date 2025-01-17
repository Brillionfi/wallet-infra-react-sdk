import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

export const Ethereum = (baseUrl: string) => ({
  id: SUPPORTED_CHAINS.ETHEREUM,
  name: 'Ethereum',
  network: 'ethereum',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH', 
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [`${baseUrl}/rpc/chainId/${SUPPORTED_CHAINS.ETHEREUM}`],
      webSocket: ['wss://rpc.mycustomchain.com/ws'], // TODO
    },
    public: {
      http: [`${baseUrl}/rpc/chainId/${SUPPORTED_CHAINS.ETHEREUM}`],
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

export const Sepolia = (baseUrl: string) => ({
  id: SUPPORTED_CHAINS.ETHEREUM_SEPOLIA,
  name: 'Ethereum Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH', 
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [`${baseUrl}/rpc/chainId/${SUPPORTED_CHAINS.ETHEREUM_SEPOLIA}`],
      webSocket: ['wss://rpc.mycustomchain.com/ws'], // TODO
    },
    public: {
      http: [`${baseUrl}/rpc/chainId/${SUPPORTED_CHAINS.ETHEREUM_SEPOLIA}`],
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