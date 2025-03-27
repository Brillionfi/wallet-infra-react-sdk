import { useState } from "react";
import { PromptData, Spinner } from "./WalletConnectPopUpStyles";
import { TPopUpConfig } from "./WalletConnectPopUpStyles";

export const WalletConnectPopUp = ({data, afterApproval, config}: { data: PromptData | undefined, afterApproval: () => void, config?: TPopUpConfig }) => {
  if(!data) throw Error("WalletConnectPopUp: Missing request data");

  const [loadingApprove, setLoadingApprove] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)

  const customClassNames = config?.customClassNames ?? {};

  const action = async (approved: boolean) => {

    if(approved){
      setLoadingApprove(true)
      await data.approveAction();
    }else{
      setLoadingReject(true)
      await data.rejectAction();
    }

    afterApproval();

    setLoadingApprove(false);
    setLoadingReject(false);
  }

  return (
    <div className={`brlkit_wallet_connect_popup_container ${customClassNames?.wcPopUpContainer}`}>
      <div className={`brlkit_wallet_connect_card ${customClassNames?.wcPopUpCard}`}>
        <div className={`brlkit_wallet_connect_card_header ${customClassNames?.wcPopUpCardHeader}`}>
          <div className={`${customClassNames?.wcPopUpCardHeader}`}>
            {data.tittle}
          </div>
        </div>
        <div className={`brlkit_wallet_connect_card_body ${customClassNames?.wcPopUpCardBody}`}>
          <div className={`${customClassNames?.wcPopUpCardHeader}`}>
            {data.message}
          </div>
        </div>
        <div className={`brlkit_wallet_connect_card_buttons ${customClassNames?.wcPopUpCardButtons}`}>
          <button disabled={loadingApprove} className={`brlkit_wallet_connect_card_button_approve ${customClassNames?.wcPopUpCardButtonApprove}`} onClick={()=>action(true)}>
            {loadingApprove ? <Spinner /> : "Approve"}
          </button>
          <button disabled={loadingReject} className={`brlkit_wallet_connect_card_button_reject ${customClassNames?.wcPopUpCardButtonReject}`} onClick={()=>action(false)}>
            {loadingReject ? <Spinner /> : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};