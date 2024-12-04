"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBrillionContext = exports.BrillionContext = void 0;
const react_1 = require("react");
exports.BrillionContext = (0, react_1.createContext)(null);
const useBrillionContext = () => {
    const context = (0, react_1.useContext)(exports.BrillionContext);
    if (!context) {
        throw new Error("useApiContext must be used within an ApiProvider");
    }
    return context;
};
exports.useBrillionContext = useBrillionContext;
