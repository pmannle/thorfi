import {
  MarketSaversData,
  MarketSaversHistory,
  marketSaversQuery,
} from '@anchor-protocol/app-fns/queries/market/saversHistory';
import { createQueryFn } from '@libs/react-query-utils';
import { Rowing } from '@material-ui/icons';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

export function convertDataToAPR(data: any, lookback: any) {
  let daysInYear = 365;
  let rows = data.history;
  let history = rows.map((row: MarketSaversHistory, index: any) => {
    if (index >= lookback) {
      let startRowIndex = index - lookback;
      let startSaverValue =
        rows[startRowIndex].saversDepth / rows[startRowIndex].saversUnits;

      if (!startSaverValue) {
        row.annualizedAPR = new BigNumber(0);
        row.timestamp = new Date(row.endTime * 1000);
        return row;
      }

      let endSaverValue = row.saversDepth / row.saversUnits;
      let lookbackGrowth = (endSaverValue - startSaverValue) / endSaverValue;
      row.annualizedAPR = new BigNumber(lookbackGrowth * daysInYear).div(10);
      row.timestamp = new Date(row.endTime * 1000);
      return row;
    }
  });
  console.log('history before: ', data.history);

  data.history = [...history.slice(lookback)];
  console.log('history after: ', data.history);
  return data;
}

const queryFn = createQueryFn((endpoint) => {
  return marketSaversQuery(endpoint);
});

export function useSaversHistoryQuery(
  queryKeys: any,
): UseQueryResult<MarketSaversData | undefined> | {} {
  const { indexerApiEndpoint, queryErrorReporter } = useAnchorWebapp();

  let result = useQuery({
    queryKey: [`saver_history-${queryKeys.asset}`, queryKeys.endpoint],
    queryFn,
    onSuccess: (data) => convertDataToAPR(data, queryKeys.lookback),
    refetchInterval: false,
    keepPreviousData: false,
    // refetchInterval: 1000 * 60 * 5,
    onError: queryErrorReporter,
  });

  if (result.isSuccess && result.data) {
    return result;
  }

  return result;
}
