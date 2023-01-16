import { ANC } from '@anchor-protocol/types';
import { JSDateTime, u, UST } from '@libs/types';
import { dedupeTimestamp } from './utils/dedupeTimestamp';

import { Midgard } from '@xchainjs/xchain-thorchain-query';
import {
  MidgardApi,
  Configuration,
  MIDGARD_API_TS_URL,
  MIDGARD_API_9R_URL,
} from '@xchainjs/xchain-midgard';
import { BigNumber } from 'bignumber.js';
import { Headers } from 'node-fetch';

export interface MarketSaversHistory {
  endTime: any; // "1663891200",
  saversDepth: any; //  "0",
  saversUnits: any; // "0",
  startTime: any; // "1663804800"
  annualizedAPR: any;
  timestamp: any;
}

export interface MarketSaversData {
  now: MarketSaversHistory;
  history: MarketSaversHistory[];
}

/**** 

Use Savers Units to calculate APR, following how APR is calculated read this article:
https://dev.thorchain.org/thorchain-dev/saving-guide/quickstart-guide#historical-data-and-performance

***/

const getHistory = async (endpoint: string) => {
  const baseUrl = MIDGARD_API_9R_URL;
  const apiconfig = new Configuration({ basePath: baseUrl });
  const midgardApi = new MidgardApi(apiconfig);

  // let response = await midgardApi
  //   .getDepthHistory(pool, interval, count)
  //   .catch((error) => {
  //     console.log(error);
  //     return error;
  //   });

  // let response = await import(endpoint);
  // return response;
  let url =
    'https://3814-2600-1700-4644-7a5f-6c1b-6cd9-dab1-4c2b.ngrok.io/' + endpoint;

  let options = {
    method: 'get',
    headers: {
      'ngrok-skip-browser-warning': '69420',
    },
  };

  let response = await fetch(url, options).then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  });

  return response;
};

export async function marketSaversQuery(query: any): Promise<MarketSaversData> {
  const results: any = await getHistory(query);
  const history: any = results.intervals;
  const now = history[history.length - 1];

  return {
    now,
    history,
  };
}
