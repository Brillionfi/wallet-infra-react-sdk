import {TCustomClassNames as TCustomSocialClassNames} from '@/components/LoginForm/Content/Social/SocialStyles';
import {TCustomClassNames as TCustomOtpClassNames} from '@/components/LoginForm/Content/Otp/OtpStyles';
import {TCustomClassNames as TCustomWalletClassNames} from '@/components/LoginForm/Content/Wallet/WalletStyles';
import {TCustomClassNames as TCustomCommonClassNames} from '@/components/LoginForm/Content/CommonStyles';
import styled from 'styled-components';

export type TCustomClassNames = {
  contentContainer?: string;
} & TCustomCommonClassNames & TCustomSocialClassNames & TCustomOtpClassNames & TCustomWalletClassNames;

export const ContentContainer = styled.section`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 0.5rem;
  overflow: hidden;
`;

export const DividerSidesSection = styled.hr`
  width: 40%;
  border: 1px solid #BBBBBB;
`;

export const DivederMiddleSection = styled.span`
  width: 20%;
  color: #BBBBBB;
  font-size: 0.8rem;
`;

export const Divider = styled.div`
  display: flex; 
  justify-content: center; 
  align-items: center; 
  width: 100%; 
  text-align: center; 
  margin: 1rem 0rem;
`;