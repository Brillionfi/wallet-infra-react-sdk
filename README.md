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

In a React or NextJS project, you can start by importing the LoginForm component:

```tsx
import { LoginForm, LoginMethods } from "@brillionfi/waas-react-sdk";

const Home: React.FC = () => {
  return (
    <LoginForm
      redirectUrl="http://localhost:3000"
      loginMethods={[
        LoginMethods.Google,
        LoginMethods.Discord,
        LoginMethods.Twitter,
      ]}
    />
  );
};
```

## 🌐 Demo

Check out our [Simple Wallet Demo](https://github.com/Brillionfi/simple-wallet-demo) to see the Wallet Infra SDK in action. This demo showcases how to manage your organization and applications and demonstrates how to access your application as a wallet user.

## 🤝 Contributing

We value community contributions and are eager to support your involvement. Here's how you can make a difference:

- 🚀 Use Brillion React SDK in your projects and share your experiences.
- 🐞 Found a bug? [Open an issue](https://github.com/Brillionfi/wallet-infra-react-sdk/issues). Better yet, submit a [pull request](https://github.com/Brillionfi/wallet-infra-react-sdk/pulls) with a fix!
- 💡 Have ideas for new features? We'd love to hear them.

## 💬 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Brillionfi/wallet-infra-react-sdk/issues) or contact the Brillion support team.

## 📄 License

The Wallet Infra SDK is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
