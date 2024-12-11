import { Dropdown } from "@brillionfi/quill-core";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

export const ChainSelector = () => {
  /* const handleChainChange = (id: SUPPORTED_CHAIN_IDS) => {
    handleChangeChainId(id, {
      onSuccess: (data) => {
        if (!!notification?.show) {
          const chainName = getChainById(
            data?.chainId ?? DEFAULT_CHAIN.id,
          ).name;
          notification.show({
            severity: "success",
            summary: tCommon("success"),
            detail: t("notifications.success", { chainName }),
          });
        }
        if (onChange) onChange(data?.chainId);
      },
      onError: () => {
        if (!!notification?.show) {
          notification.show({
            severity: "error",
            summary: tCommon("error"),
            detail: t("notifications.error"),
          });
        }
      },
    });
    setSelectedChain(id);
  };

  const chainOptionTemplate = (id: SUPPORTED_CHAIN_IDS) => {
    const icon = getChainIcon(id);
    const { name } = getChainById(id);
    const iconSize = size === "normal" ? "h-4 w-4" : "";
    const iconSizeLarge = size !== "normal" ? size : undefined;
    return (
      <div className="flex h-full items-center gap-4">
        <Icon
          localIcon={icon}
          type="svg"
          size={iconSizeLarge}
          className={iconSize}
        />
        <span>{name}</span>
      </div>
    );
  };

  const finalSizeClassName = useMemo(() => {
    switch (size) {
      case "normal":
        return "h-10";
      case "large":
        return "h-16";
      case "xlarge":
        return "h-20";
      default:
        return "h-10";
    }
  }, [size]);

  const finalFullWidthClassName = useMemo(() => {
    return fullWidth ? "w-full" : "w-full md:w-60";
  }, [fullWidth]);

  const finalChainSelectorClassName = useMemo(() => {
    return twMerge([finalSizeClassName, finalFullWidthClassName]);
  }, [finalSizeClassName, finalFullWidthClassName]); */

  return (
    <Dropdown
      value={SUPPORTED_CHAINS.ETHEREUM}
      options={SUPPORTED_CHAINS}
      placeholder={t("placeholder")}
      autoOptionFocus
    />
  );
};
