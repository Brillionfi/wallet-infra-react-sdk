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

## ⚡ Quick Start

First you must wrap your app inside `<BrillionProvider/>` in order to be able to interact with the SDK. 

This providers has 3 props: 
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

If you want to personalize this login form, you can easily put your own styles or add/override default styles. Separated by sections:
- Main Container:
  1) `containerStyle?: React.CSSProperties;`
- Header:
  1) `headerStyle?: React.CSSProperties;`
  2) `headerTextStyle?: React.CSSProperties;`
  3) `headerText?: string;`
  4) `closeStyle?: React.CSSProperties;`
- Content Container: 
  1) `contentContainerStyle?: React.CSSProperties;`
  2) `buttonStyle?: React.CSSProperties;`
  3) `buttonIconStyle?: React.CSSProperties;`
  4) `buttonTextStyle?: React.CSSProperties;`
  5) `inputContainerStyle?: React.CSSProperties;`
  6) `inputStyle?: React.CSSProperties;`
  7) `inputNextStyle?: React.CSSProperties;`
  8) `socialButtonsContainerStyle?: React.CSSProperties;`
  9) `socialButtonStyle?: React.CSSProperties;`
  10) `socialButtonIconStyle?: React.CSSProperties;`
  11) `otpButtonsContainerStyle?: React.CSSProperties;`
  12) `walletButtonsContainerStyle?: React.CSSProperties;`
  13) `walletButtonStyle?: React.CSSProperties;`
  14) `walletButtonIconStyle?: React.CSSProperties;`
  15) `walletButtonTextStyle?: React.CSSProperties;`
- Error Container: 
  1) `errorContainerStyle?: React.CSSProperties;`
  2) `errorTextStyle?: React.CSSProperties;`
- Footer: 
  1) `footerStyle?: React.CSSProperties;`
  2) `footerTextStyle?: React.CSSProperties;`
  3) `footerText?: string;`

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
        customStyles={{
          containerStyle: {
            ...defaultStyles.container,
          },
          headerStyle: {
            ...defaultStyles.header,
            textAlign: "center",
          },
          headerText: "Login to your wallet",
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

const { sdk, isReady, chain, changeChain } = useBrillionContext();

const { balances, getBalances, getPortfolio } = useBalance("wallet address", "chainId");

const { 
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
  getNotifications
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
