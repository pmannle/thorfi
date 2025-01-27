import React, { useCallback } from 'react';
import { UIElementProps } from '@libs/ui';
import { RouterWalletStatusRecheck } from '@libs/use-router-wallet-status-recheck';
import {
  // NetworkInfo,
  // ReadonlyWalletSession,
  // WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider';
import { useReadonlyWalletDialog } from 'components/dialogs/useReadonlyWalletDialog';
import { AppProviders } from 'configurations/app';
// import { TerraAccountProvider } from './TerraAccountProvider';
// import { TerraBalancesProvider } from './TerraBalancesProvider';
// import { TerraNetworkProvider } from './TerraNetworkProvider';
import { ThemeProvider } from 'contexts/theme';
import { lightTheme, darkTheme } from 'themes/terra';
import { QueryProvider } from 'providers/QueryProvider';
// import { TerraNetworkGuard } from './TerraNetworkGaurd';

export function TerraAppProviders({
  children,
  // walletConnectChainIds,
}: UIElementProps) {
  // const [openReadonlyWalletSelector, readonlyWalletSelectorElement] =
  //   useReadonlyWalletDialog();

  // const createReadonlyWalletSession = useCallback(
  //   (networks: NetworkInfo[]): Promise<ReadonlyWalletSession | null> => {
  //     return openReadonlyWalletSelector({
  //       networks,
  //     });
  //   },
  //   [openReadonlyWalletSelector],
  // );

  return (
    <div>
      {/* // <TerraNetworkProvider> */}
      <ThemeProvider
        initialTheme="light"
        lightTheme={lightTheme}
        darkTheme={darkTheme}
      >
        {/* <TerraNetworkGuard> */}
        <QueryProvider>
          {/* <TerraAccountProvider> */}
          <AppProviders>
            {/* <TerraBalancesProvider> */}
            {/* <RouterWalletStatusRecheck /> */}
            {children}
            {/* </TerraBalancesProvider> */}
          </AppProviders>
          {/* </TerraAccountProvider> */}
        </QueryProvider>
        {/* </TerraNetworkGuard> */}
      </ThemeProvider>
      {/* // </TerraNetworkProvider> */}
    </div>
  );
}
