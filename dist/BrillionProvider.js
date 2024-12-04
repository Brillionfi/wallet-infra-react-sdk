"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrillionProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const BrillionContext_1 = require("./BrillionContext");
const wallet_infra_sdk_1 = require("@brillionfi/wallet-infra-sdk");
const BrillionProvider = ({ appId, baseUrl, children, }) => {
    const sdk = new wallet_infra_sdk_1.WalletInfra(appId, baseUrl);
    return ((0, jsx_runtime_1.jsx)(BrillionContext_1.BrillionContext.Provider, { value: { sdk }, children: children }));
};
exports.BrillionProvider = BrillionProvider;
