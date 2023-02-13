import React from 'react';
import { TerraApp } from 'apps/TerraApp';
import { useChainOptions } from '@terra-money/wallet-provider';
import CryptoContext from '@thorfi-protocol/CryptoContext';

export function App() {
  const chainOptions = useChainOptions();

  return (
    <CryptoContext>
      <TerraApp chainOptions={chainOptions} />
    </CryptoContext>
  );
}
