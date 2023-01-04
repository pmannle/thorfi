import { MarketUstData, marketUstQuery } from '@anchor-protocol/app-fns';
import {
  SaversPoolData,
  saversPoolStatsQuery,
} from '@anchor-protocol/app-fns/queries/market/saversPoolStats';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';

const endpoint = `https://vanaheimex.com/api/saversExtraData`;

const queryFn = createQueryFn((endpoint) => {
  return saversPoolStatsQuery(endpoint);
});

export function useSaversPoolStatsQuery(): UseQueryResult<
  SaversPoolData | undefined
> {
  const { indexerApiEndpoint, queryErrorReporter } = useAnchorWebapp();

  const result = useQuery([endpoint, endpoint], queryFn, {
    refetchInterval: 1000 * 60 * 5,
    keepPreviousData: true,
    onError: queryErrorReporter,
  });

  if (result.isSuccess && result.data) {
    return result;
  }

  return result;
}
