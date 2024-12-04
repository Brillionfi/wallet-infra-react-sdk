"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUser = void 0;
const react_1 = require("react");
const BrillionContext_1 = require("../BrillionContext");
const useUser = (endpoint) => {
    const { sdk } = (0, BrillionContext_1.useBrillionContext)();
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            /* try {
              const response = await sdk.authenticateUser();
              setData(response);
            } catch (err) {
              setError(err);
            } finally {
              setLoading(false);
            } */
        });
        fetchData();
    }, [endpoint, sdk]);
    return { data, loading, error };
};
exports.useUser = useUser;
