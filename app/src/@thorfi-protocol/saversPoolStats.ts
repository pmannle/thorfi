import {
  SaversPoolData,
  saversPoolStatsQuery,
} from '@thorfi-protocol/saversPoolStatsQuery';
import { currency, percent } from '@libs/formatter';
import { createQueryFn } from '@libs/react-query-utils';
import React from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../@anchor-protocol/app-provider/contexts/context';

const endpoint = `https://vanaheimex.com/api/saversExtraData`;

const queryFn = createQueryFn((endpoint) => {
  return saversPoolStatsQuery(endpoint);
});

export function transformStats(data: any) {
  return Object.entries(data).reduce((result, [key, value]) => {
    result[key] = {
      asset: data[key].asset,
      filled: percent(data[key].filled, 4), // 0.3106946435331238,
      saversCount: data[key].saversCount, // 177,
      saverReturn: data[key].saverReturn, // 0.07733453414200131,
      totalAnnualisedReturn: percent(data[key].saverReturn, 2),
      earned: data[key].earned, // 10810204045,
      assetPrice: data[key].assetPrice, // "11.788269209370874",
      totalEarned: currency(data[key].earned * (data[key].assetPrice / 1e8)),
      saversDepth: data[key].saversDepth, // "803801353792",
      saversDepthUSD: (data[key].saversDepth * data[key].assetPrice) / 1e8,
      assetDepth: data[key].assetDepth / 1e8, // "4417860874929",
      synthSupply: data[key].synthSupply, // "823563425829"
    };
    return result;
  }, {});
}

export function useSaversPoolStatsQuery(): UseQueryResult<
  SaversPoolData | undefined
> {
  const { indexerApiEndpoint, queryErrorReporter } = useAnchorWebapp();

  const result = useQuery([endpoint, endpoint], queryFn, {
    refetchInterval: 1000 * 60 * 5,
    keepPreviousData: true,
    select: React.useCallback((data) => {
      let dataOut = transformStats(data);
      return dataOut;
    }, []),
    onError: queryErrorReporter,
  });

  if (result.isSuccess && result.data) {
    return result;
  }

  return result;
}
