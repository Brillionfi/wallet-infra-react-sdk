export type eth_sendTransaction = {
  from: string;
  to: string;
  value: string;
  gas?: string;
  gasPrice?: string;
  data?: string;
};

export type eth_signTransaction = {
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  data: string;
};

export type wallet_switchEthereumChain = {
  chainId: string;
};

export type eth_estimateGas = [
  {
    from: string;
    to: string;
    value: string;
  },
];

export type eth_call = [
  {
    to: string;
    data: string;
  },
  string,
];

export type CustomProvider = { request(...args: any): Promise<any> }