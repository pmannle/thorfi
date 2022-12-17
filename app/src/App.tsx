import React from 'react';
import { TerraApp } from 'apps/TerraApp';
import { useChainOptions } from '@terra-money/wallet-provider';

export function App() {
  const chainOptions = useChainOptions();

  return <TerraApp chainOptions={chainOptions} />;
}
