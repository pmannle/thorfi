import React, { useState } from 'react';
import { TerraApp } from 'apps/TerraApp';
import { useChainOptions } from '@terra-money/wallet-provider';
import CryptoContext from '@thorfi-protocol/CryptoContext';
import NetworkManager from "@xdefi/wallets-connector";
import WalletConnect from '@thorfi-protocol/WalletConnect';
// import { getProviderOptions } from "@thorfi-protocol/utils";

export function App() {
  const chainOptions = useChainOptions();

  // const [options] = useState(() => getProviderOptions());
  // console.log("Providers", options);

  /*
    <CryptoContext>
    <TerraApp chainOptions={chainOptions} /> 
    </CryptoContext>
  */

  return (

    // < NetworkManager
    //   options={options}
    //   network="mainnet"
    //   cacheEnabled={true}
    //   isSingleProviderEnabled={true}
    // >
    //   <WalletConnect></WalletConnect>
    // </NetworkManager >

    <CryptoContext>
      <TerraApp chainOptions={chainOptions} />
    </CryptoContext>



  );
}
