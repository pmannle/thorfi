import { MarketUstData, marketUstQuery } from '@anchor-protocol/app-fns';
import {
  liquidityPoolsData,
  liquidityPoolsQuery,
} from '@anchor-protocol/app-fns/queries/market/liquidityPools';
import { currency, percent } from '@libs/formatter';
import { createQueryFn } from '@libs/react-query-utils';
import React from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';

const endpoint = `https://thornode.ninerealms.com/thorchain/pools`;

const queryFn = createQueryFn((endpoint) => {
  return liquidityPoolsQuery(endpoint);
});

export function useLiquidityPoolsQuery(): UseQueryResult<
  liquidityPoolsData | undefined
> {
  const { indexerApiEndpoint, queryErrorReporter } = useAnchorWebapp();

  const result = useQuery([endpoint, endpoint], queryFn, {
    refetchInterval: 1000 * 60 * 5,
    keepPreviousData: true,
    // select: React.useCallback((data) => {
    //   let dataOut = transformStats(data);
    //   return dataOut;
    // }, []),
    onError: queryErrorReporter,
  });

  if (result.isSuccess && result.data) {
    return result;
  }

  return result;
}
