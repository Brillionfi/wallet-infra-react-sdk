# 🛠️ Brillion React SDK

Easy React components to build wallet apps that connect to a Brillion infrastructure.

## 💡 Features

- 👛 **Wallet Retrieval**: List wallets
- 💸 **Transaction Handling**: Create, sign, and cancel transactions
- 🔐 **Authentication**: Ready-to-use Login form
- 📜 **Transaction History**: Retrieve and analyze transaction history

## 🚀 Installation

Install the Wallet Infra SDK into your project with a single command:

```shell
npm i @brillionfi/waas-react-sdk
```

## ⚡ Quick Start (BrillionContext)

First you must wrap your app inside `<BrillionProvider/>` in order to be able to interact with the SDK. 

This providers has 4 props: 
  - `appId`: Your Brillion App ID.
  - `baseUrl`: Brillion API URL.
  - `defaultChain`: Your preferred chain to connect first.
  - `WCProjectId`: Your walletConnect Project ID (mandatory only if you are planning to use WalletConnect as login method)

In a React or NextJS project, you can start by importing the LoginForm component:

```tsx
import { BrillionProvider, LoginForm, LoginMethods } from "@brillionfi/waas-react-sdk";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

const MyLoginPage = () => {
  return (
    <BrillionProvider
      appId={"my-brillion-app-id"}
      baseUrl={"brillion-infra-url"}
      defaultChain={SUPPORTED_CHAINS.ETHEREUM}
    >
      <LoginForm
        redirectUrl="http://localhost:3000"
        loginMethods={[
          LoginMethods.Google,
          LoginMethods.Discord,
          LoginMethods.Twitter,
        ]}
      />
    </BrillionProvider>
  );
};
```

###  Login Form Customizations

If you want to personalize this login form, you can change texts, hide content and add custom classes to use already developed CSS by your

- Config:
  - showClose: boolean, allows you to hide X to close modal
  - footerText: string, allows you to change default footer text
  - customClassNames: allows you to add you CSS {
    - Main Container:
      1) `mainContainer`
      2) `errorContainer`
      3) `errorText`
    - Header:
      1) `headerContainer`
      2) `headerTextSection`
      3) `headerText`
      4) `closeSection`
    - Content Container: 
      1) `contentContainer`
      2) `button`
      3) `buttonIcon`
      4) `buttonText`
      5) `inputContainer`
      6) `input`
      7) `inputNext`
      8) `socialButtonsContainer`
      9) `socialButton`
      10) `socialButtonIcon`
      11) `otpButtonsContainer`
      12) `walletButtonsContainer`
      13) `walletButton`
      14) `walletButtonIcon`
      15) `walletButtonText`
    - Footer: 
      1) `footerContainer`
      2) `footerTextSection`
  }

Note: you can leave some/all of these blank to have default styles

```tsx
import { BrillionProvider, LoginForm, LoginMethods, defaultStyles } from "@brillionfi/waas-react-sdk";

const MyLoginPage = () => {
  return (
    <BrillionProvider
      appId={"my-brillion-app-id"}
      baseUrl={"my-brillion-infra-url"}
      WCProjectId={"my-walletConnect-projectId"}
    >
      <LoginForm 
        loginMethods={[
          LoginMethods.Google, 
          LoginMethods.Discord, 
          LoginMethods.Twitter, 
          LoginMethods.Metamask, 
          LoginMethods.WalletConnect, 
          LoginMethods.Email
        ]} 
        redirectUrl="http://localhost:3000"
        config={{
          showClose: false,
          customClassNames: {
            contentContainer: "bg-white p-8 rounded-lg",
          }
        }}
      />
    </BrillionProvider>
  );
};
```

## 💻 Usage

We provide several hooks for you to easily interact with Brillion (more coming...).

```tsx

import { useBalance, useTransaction, useUser, useWallet, useBrillionContext } from "@brillionfi/waas-react-sdk";

const {
  sdk,
  walletConnectProjectId,
  isReady,
  chain,
  wallet,
  sessionInfo,
  saveSessionInfo,
  changeChain,
  changeWallet,
 } = useBrillionContext();

const { 
  balances, 
  getBalances, 
  getPortfolio 
} = useBalance();

const { 
  signWithPasskey,
  createTransaction,
  getTransactionById,
  cancelTransaction,
  approveSignTransaction,
  rejectSignTransaction.
} = useTransaction();

const { 
  wallets,
  createWallet,
  signTransaction,
  getTransactionHistory,
  getGasConfig,
  setGasConfig,
  getGasFees,
  getNonce,
  initRecovery,
  execRecovery,
  approveSignTransaction,
  rejectSignTransaction,
  getNotifications,
  getWalletAuthnticator,
  createWalletAuthnticator,
} = useWallet();

const { login, authenticateUser } = useUser();
```

Note: you can also manually interact with Brillion with already included Brillion Infra SDK
 `@brillionfi/wallet-infra-sdk`
```tsx
const { sdk } = useBrillionContext();

const authenticateUser = (jwt: string) => {
  return sdk?.authenticateUser(jwt);
};
```

## ⚡ Quick Start (Wagmi BrillionConnector)

First you need to import brillion Wagmi utils and initialize it with 4 props:

  - `appId`: Your Brillion App ID.
  - `baseUrl`: Brillion API URL.
  - `defaultChain`: Your preferred chain to connect first.
  - `WCProjectId`: Your walletConnect Project ID (mandatory only if you are planning to use WalletConnect as login method)

```ts
import { brillionWagmi } from "@brillionfi/waas-react-sdk";

const { brillionConnector, brillionTransport } = brillionWagmi({
  appId: process.env.NEXT_PUBLIC_DEFAULT_APPID ?? "7cd8e911-cb89-4bdf-9fa0-d5bb9563158b",
  baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
  defaultNetwork: sepolia.id,
  WcProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string
})
```

And then use them in wagmi createConfig:

```ts
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: brillionTransport(mainnet.id),
    [sepolia.id]: brillionTransport(sepolia.id),
  },
  connectors: [brillionConnector]
})
```

## 💻 Usage

After wagmi configuration is done, you can start by connecting to brillion as follows:
```ts
const { connect } = useConnect();

connect({
  connector: connectors[0],
  ...{
    provider: "Google",
    redirectUrl: `${process.env.NEXT_PUBLIC_REDIRECT_URL as string}2`,
    email: "test@test.com", 
    walletName: "name",
  } as ConnectBrillionProps
})
```

- provider:  can be `Google`, `Twitter`, `Discord`, `Email`, `Metamask`
- email: (optional) in case you want to use Email provider
- walletName: (first time user only) the name of the passkey that brillion needs for new user wallet

Once this is done, you can just simple use native wagmi hooks:

```ts
import { useSendTransaction } from "wagmi";

sendTransaction({
  to: "wallet",
  value: BigInt("1"),
  data: "0x0"
});
```

## 🌐 Demo

To see the raw SDK in use, check out our [Simple Wallet Demo](https://github.com/Brillionfi/simple-wallet-demo). This demo showcases how to manage your organization and applications and demonstrates how to access your application as a wallet user.

## 🤝 Contributing

We value community contributions and are eager to support your involvement. Here's how you can make a difference:

- 🚀 Use Brillion React SDK in your projects and share your experiences.
- 🐞 Found a bug? [Open an issue](https://github.com/Brillionfi/wallet-infra-react-sdk/issues). Better yet, submit a [pull request](https://github.com/Brillionfi/wallet-infra-react-sdk/pulls) with a fix!
- 💡 Have ideas for new features? We'd love to hear them.

## 💬 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Brillionfi/wallet-infra-react-sdk/issues) or contact the Brillion support team.

## 📄 License

The Wallet Infra SDK is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
