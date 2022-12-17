import { WalletControllerChainOptions } from '@terra-money/wallet-provider';
import { AstroportGuideBanner } from 'components/AstroportGuideBanner';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { Airdrop } from 'pages/airdrop';
import { Claim as AncVestingClaim } from 'pages/anc/vesting';
import { BlunaConvert, BLunaMint, BLunaBurn } from 'pages/basset/bluna.convert';
import { BlunaWithdraw } from 'pages/basset/bluna.withdraw';
import { BAssetClaim } from 'pages/basset/claim';
import { BAssetMain } from 'pages/basset/main';
import { WormholeConvert } from 'pages/basset/wh.convert';
import { WormholeConvertToBAsset } from 'pages/basset/wh.convert.to-basset';
import { WormholeConvertToWBAsset } from 'pages/basset/wh.convert.to-wbasset';
import { Borrow } from 'pages/borrow';
import { Dashboard } from 'pages/dashboard';
import { Earn } from 'pages/earn';
import { GovernanceMain } from 'pages/gov/main';
import { PollCreate } from 'pages/gov/poll.create';
import { PollCreateModifyANCDistribution } from 'pages/gov/poll.create.modify-anc-distribution';
import { PollCreateModifyBorrowInterest } from 'pages/gov/poll.create.modify-borrow-interest';
import { PollCreateModifyCollateralAttribute } from 'pages/gov/poll.create.modify-collateral-attribute';
import { PollCreateModifyMarketParameters } from 'pages/gov/poll.create.modify-market-parameters';
import { PollCreateRegisterCollateralAttributes } from 'pages/gov/poll.create.register-collateral-attributes';
import { PollCreateSpendCommunityPool } from 'pages/gov/poll.create.spend-community-pool';
import { PollCreateTextProposal } from 'pages/gov/poll.create.text-proposal';
import { PollDetail } from 'pages/gov/poll.detail';
import { Mypage } from 'pages/mypage';
import { TermsOfService } from 'pages/terms';
import { ClaimAll } from 'pages/trade/claim.all';
import { ClaimAncUstLp } from 'pages/trade/claim.anc-ust-lp';
import { ClaimUstBorrow } from 'pages/trade/claim.ust-borrow';
import {
  ancGovernancePathname,
  ancUstLpPathname,
  ustBorrowPathname,
} from 'pages/trade/env';
import { RewardsAncGovernance } from 'pages/trade/rewards.anc-governance';
import { RewardsAncUstLp } from 'pages/trade/rewards.anc-ust-lp';
import { Trade } from 'pages/trade/trade';
import { TerraAppProviders } from 'providers/terra/TerraAppProviders';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import '../configurations/chartjs';

type TerraAppProps = {
  chainOptions: WalletControllerChainOptions | null;
};

export function TerraApp({ chainOptions }: TerraAppProps) {
  return (
    chainOptions && (
      <TerraAppProviders {...chainOptions}>
        <div>
          <GlobalStyle />
          <Header />
          <AstroportGuideBanner />
          <Routes>
            <Route index={true} element={<Dashboard />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/borrow" element={<Borrow />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </TerraAppProviders>
    )
  );
}
