// import { LCDClient } from '@terra-money/terra.js';
// import { NetworkInfo } from '@terra-money/wallet-provider';
import { createContext, useContext } from 'react';

export const MAINNET = {
  name: 'mainnet',
  chainID: 'thorchain',
  lcd: 'https://midgard.thorswap.net/v2/health',
};

const LCDClients = {

  mainnet: {
    chainID: MAINNET.chainID,
    URL: MAINNET.lcd,
  },
};

export const NetworkContext = createContext(MAINNET);

const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('The NetworkContext has not been defined.');
  }
  return {
    network: context,
    lcdClient: LCDClients[context.name ?? 'mainnet'],
  };
};

export { useNetwork };
