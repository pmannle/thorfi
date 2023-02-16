import {
  liquidityPoolsData,
  liquidityPoolsQuery,
} from '@thorfi-protocol/liquidityPoolsQuery';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';

const endpoint = `https://thornode.ninerealms.com/thorchain/pools`;

const queryFn = createQueryFn((endpoint) => {
  return liquidityPoolsQuery(endpoint);
});

export function useLiquidityPoolsQuery(): UseQueryResult<
  liquidityPoolsData | undefined
> {
  const result = useQuery([endpoint, endpoint], queryFn, {
    refetchInterval: false,
    keepPreviousData: true,
    // onError: queryErrorReporter,
  });

  if (result.isSuccess && result.data) {
    return result;
  }

  return result;
}
