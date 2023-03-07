import React, { useState } from 'react';
import { TerraApp } from 'apps/TerraApp';
import CryptoContext from '@thorfi-protocol/CryptoContext';
import NetworkManager from "@xdefi/wallets-connector";
import WalletConnect from '@thorfi-protocol/WalletConnect';

import { getProviderOptions } from "@thorfi-protocol/utils";

export function App() {

  const [options] = useState(() => getProviderOptions());
  console.log("Providers", options);

  return (

    < NetworkManager
      options={options}
      network="mainnet"
      cacheEnabled={true}
      isSingleProviderEnabled={true}
    >
      <CryptoContext>
        <TerraApp />
      </CryptoContext>
    </NetworkManager>




  );
}
