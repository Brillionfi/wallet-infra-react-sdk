import { useState } from "react";
import { PromptData, Spinner, WcPopUpCardBodyText, WcPopUpCardHeaderText } from "./WalletConnectPopUpStyles";
import { WcPopUpContainer, TPopUpConfig, WcPopUpCard, WcPopUpCardHeader, WcPopUpCardBody, WcPopUpCardButtons, WcPopUpCardButtonApprove, WcPopUpCardButtonReject } from "./WalletConnectPopUpStyles";

export const WalletConnectPopUp = ({data, afterApproval, config}: { data: PromptData | undefined, afterApproval: () => void, config?: TPopUpConfig }) => {
  if(!data) throw Error("WalletConnectPopUp: Missing request data");

  const [loadingApprove, setLoadingApprove] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)

  const customClassNames = config?.customClassNames ?? {};

  const action = async (approved: boolean) => {
    approved ? setLoadingApprove(true) : setLoadingReject(true)

    if(approved){
      await data.approveAction();
    }else{
      await data.rejectAction();
    }

    afterApproval();

    setLoadingApprove(false);
    setLoadingReject(false);
  }

  return (
    <WcPopUpContainer className={customClassNames?.wcPopUpContainer}>
      <WcPopUpCard className={customClassNames?.wcPopUpCard}>
        <WcPopUpCardHeader className={customClassNames?.wcPopUpCardHeader}>
          <WcPopUpCardHeaderText>
            {data.tittle}
          </WcPopUpCardHeaderText>
        </WcPopUpCardHeader>
        <WcPopUpCardBody className={customClassNames?.wcPopUpCardBody}>
          <WcPopUpCardBodyText>
            {data.message}
          </WcPopUpCardBodyText>
        </WcPopUpCardBody>
        <WcPopUpCardButtons className={customClassNames?.wcPopUpCardButtons}>
          <WcPopUpCardButtonApprove disabled={loadingApprove} className={customClassNames?.wcPopUpCardButtonApprove} onClick={()=>action(true)}>
            {loadingApprove ? <Spinner /> : "Approve"}
          </WcPopUpCardButtonApprove>
          <WcPopUpCardButtonReject disabled={loadingReject} className={customClassNames?.wcPopUpCardButtonReject} onClick={()=>action(false)}>
            {loadingReject ? <Spinner /> : "Reject"}
          </WcPopUpCardButtonReject>
        </WcPopUpCardButtons>
      </WcPopUpCard>
    </WcPopUpContainer>
  );
};