import { MarketAncData, marketAncQuery } from '@anchor-protocol/app-fns';
import {
  MarketSaversData,
  marketSaversQuery,
} from '@anchor-protocol/app-fns/queries/market/saversHistory';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn((endpoint: string) => {
  return marketSaversQuery({ endpoint });
});

export function useMarketSaversQuery(): UseQueryResult<
  MarketSaversData | undefined
> {
  const { indexerApiEndpoint, queryErrorReporter } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.MARKET_ANC, indexerApiEndpoint],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
