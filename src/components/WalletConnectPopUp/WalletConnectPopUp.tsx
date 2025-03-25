import { PromptData } from "./WalletConnectPopUpStyles";
import { WcPopUpContainer, TPopUpConfig, WcPopUpCard, WcPopUpCardHeader, WcPopUpCardBody, WcPopUpCardButtons, WcPopUpCardButtonApprove, WcPopUpCardButtonReject } from "./WalletConnectPopUpStyles";

export const WalletConnectPopUp = ({data, afterApproval, config}: { data: PromptData | undefined, afterApproval: () => void, config?: TPopUpConfig }) => {
  if(!data) throw Error("WalletConnectPopUp: Missing request data");

  const customClassNames = config?.customClassNames ?? {};

  const action = async (approved: boolean) => {
    if(approved){
      await data.approveAction();
    }else{
      await data.rejectAction();
    }
    
    afterApproval();
  }

  return (
    <WcPopUpContainer className={customClassNames?.wcPopUpContainer}>
      <WcPopUpCard className={customClassNames?.wcPopUpCard}>
        <WcPopUpCardHeader className={customClassNames?.wcPopUpCardHeader}>
          {data.tittle}
        </WcPopUpCardHeader>
        <WcPopUpCardBody className={customClassNames?.wcPopUpCardBody}>
          {data.message}
        </WcPopUpCardBody>
        <WcPopUpCardButtons className={customClassNames?.wcPopUpCardButtons}>
          <WcPopUpCardButtonApprove className={customClassNames?.wcPopUpCardButtonApprove} onClick={()=>action(true)}>
            Approve
          </WcPopUpCardButtonApprove>
          <WcPopUpCardButtonReject className={customClassNames?.wcPopUpCardButtonReject} onClick={()=>action(false)}>
            Reject
          </WcPopUpCardButtonReject>
        </WcPopUpCardButtons>
      </WcPopUpCard>
    </WcPopUpContainer>
  );
};