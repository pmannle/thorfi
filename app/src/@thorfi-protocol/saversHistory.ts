import {
  MarketSaversData,
  MarketSaversHistory,
  marketSaversQuery,
} from '@thorfi-protocol/saversHistoryQuery';
import BigNumber from 'bignumber.js';
import { useQueries, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../@anchor-protocol/app-provider/contexts/context';

export function convertDataToAPR(rows: any, lookback: any) {
  let daysInYear = 365 / lookback;
  // rows is 100 days from midgard/v2/history/savers/${asset}?interval=days&count=100
  let history = rows.map((row: MarketSaversHistory, index: any) => {
    if (index >= lookback) {
      let startRowIndex = index - lookback; // default lookback is 7 days
      let oldSaverValue =
        rows[startRowIndex].saversDepth / rows[startRowIndex].saversUnits;

      if (!oldSaverValue) {
        row.annualizedAPR = new BigNumber(0);
        row.timestamp = new Date(row.endTime * 1000);
        return row;
      }

      let endSaverValue = row.saversDepth / row.saversUnits;
      let lookbackGrowth = (endSaverValue - oldSaverValue) / endSaverValue;
      row.annualizedAPR = new BigNumber(lookbackGrowth * daysInYear);
      row.timestamp = new Date(row.endTime * 1000);
      return row;
    }
  });
  // remove lookback zero values
  rows = [...history.slice(lookback)];
  return rows;
}

// const queryFn = marketSaversQuery(endpoint, interval, count, asset);
// // const queryFn = createQueryFn((endpoint, { interval, count, asset }) => {
// //   return marketSaversQuery(endpoint, interval, count, asset);
// // });

export function useSaversHistoryQuery(
  queryKeys: any,
): UseQueryResult<MarketSaversData | undefined> | {} {
  const { indexerApiEndpoint, queryErrorReporter } = useAnchorWebapp();

  const queries = useQueries(
    queryKeys.map((query: any) => ({
      queryKey: [query.endpoint, query.asset],
      queryFn: () =>
        marketSaversQuery(
          query.endpoint,
          query.asset,
          query.interval,
          query.count,
        ),
      keepPreviousData: true,
      // onSuccess: (data) => convertDataToAPR(data, query.lookback)
    })),
  );

  const result = queries.flatMap((query) => query.data);
  const isLoading = queries.some(({ isLoading }) => isLoading);
  const isError = queries.some(({ isError }) => isError);

  // if (isLoading) return <Typography>Loading...</Typography>;
  // if (isError) return <Typography>Error to load.</Typography>;

  if (!isLoading && !isError) {
    return result;
  }

  return isError ? isError : !isLoading;
}
