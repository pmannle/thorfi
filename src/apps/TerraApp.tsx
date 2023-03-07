// import { WalletControllerChainOptions } from '@terra-money/wallet-provider';
import { AstroportGuideBanner } from 'components/AstroportGuideBanner';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { Borrow } from 'pages/borrow';
import { Dashboard } from 'pages/dashboard';
import { Earn } from 'pages/earn';
import { Mypage } from 'pages/mypage';
import { TermsOfService } from 'pages/terms';

// import { TerraAppProviders } from 'providers/terra/TerraAppProviders';
import { EvmAppProviders } from 'providers/evm/EvmAppProviders';

import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import '../configurations/chartjs';

// type TerraAppProps = {
//   chainOptions: WalletControllerChainOptions | null;
// };

export function TerraApp() {
  return (
    // chainOptions && (
    // <TerraAppProviders>
    <EvmAppProviders>

      <div>
        <GlobalStyle />
        <Header />
        {/* <AstroportGuideBanner /> */}
        <Routes>
          <Route index={true} element={<Dashboard />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {/* </TerraAppProviders> */}
    </EvmAppProviders>
    // )
  );
}
