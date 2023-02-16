import React from 'react';
import { useEvmBlockNumberQuery } from 'queries';
import { BlockInfo } from './BlockInfo';
import { Chain } from '@anchor-protocol/app-provider';

export const EvmBlockInfo = () => {
  const { data: evmBlockNumber } = useEvmBlockNumberQuery();

  if (evmBlockNumber === undefined) {
    return null;
  }

  return <BlockInfo blockNumber={evmBlockNumber} chainName={Chain.Terra} />;
};
