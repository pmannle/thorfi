// import { Midgard } from '@xchainjs/xchain-thorchain-query';
import {
  MidgardApi,
  Configuration,
  MIDGARD_API_9R_URL,
} from '@xchainjs/xchain-midgard';

export interface MarketSaversHistory {
  endTime: any; // "1663891200",
  saversDepth: any; //  "0",
  saversUnits: any; // "0",
  startTime: any; // "1663804800"
  annualizedAPR: any;
  timestamp: any;
  asset: string;
}

export interface MarketSaversData {
  now: MarketSaversHistory;
  history: MarketSaversHistory[];
  asset: MarketSaversHistory['asset'];
}

/**** 

Use Savers Units to calculate APR, following how APR is calculated read this article:
https://dev.thorchain.org/thorchain-dev/saving-guide/quickstart-guide#historical-data-and-performance

***/

const getHistory = async (endpoint: string, asset, interval, count) => {
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

  let url = `https://4ae2-108-214-22-208.ngrok.io/${endpoint}/${asset}?interval=${interval}&count=${count}`;

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

export async function marketSaversQuery(
  endpoint,
  asset,
  interval,
  count,
): Promise<MarketSaversData> {
  const results: any = await getHistory(endpoint, asset, interval, count);
  const history = results.intervals.slice(0, -1);
  const now = results.intervals[results.intervals.length - 1];

  return {
    now,
    history,
    asset,
  };
}
