import { Midgard } from '@xchainjs/xchain-thorchain-query';
import {
  MidgardApi,
  Configuration,
  MIDGARD_API_TS_URL,
  MIDGARD_API_9R_URL,
} from '@xchainjs/xchain-midgard';

/**** 
 
To understand how APR is caclulated read this article:
https://medium.com/thorchain/introduction-to-luvi-and-midgard-apr-calculation-update-cf15e743276d

We can take data returned from this endpoint to verify APR calcs:
Pull pool data from 2022–01–01 to 2022–04–10 (100 days)
https://midgard.thorswap.net/v2/history/depths/BTC.BTC?interval=day&from=1641081599&to=1649548800

	"meta": {
		"endAssetDepth": "116477891491",
		"endLPUnits": "466614125459040",
		"endRuneDepth": "542948574117125",
		"endSynthUnits": "3005659190530",
		"endTime": "1649548800",
		"luviIncrease": "1.0490043974990912",
		"priceShiftLoss": "0.9700573870348674",
		"startAssetDepth": "50194593505",
		"startLPUnits": "271999088171545",
		"startRuneDepth": "384089791424390",
		"startSynthUnits": "0",
		"startTime": "1640995200"
	}

  let endAssetDepth = parseInt('116477891491');
  let endLPUnits = parseInt('466614125459040');
  let endRuneDepth = parseInt('542948574117125');
  let endSynthUnits = parseInt('3005659190530');
  let endTime = parseInt('1649548800');
  let luviIncrease = parseInt('1.0490043974990912');
  let priceShiftLoss = parseInt('0.9700573870348674');
  let startAssetDepth = parseInt('50194593505');
  let startLPUnits = parseInt('271999088171545');
  let startRuneDepth = parseInt('384089791424390');
  let startSynthUnits = parseInt('0');
  let startTime = parseInt('1640995200');
  
  let startPoolUnits = startLPUnits + startSynthUnits;
  let startLuvi = Math.sqrt(startAssetDepth * startRuneDepth) / startPoolUnits;
  let endPoolUnits = endLPUnits + endSynthUnits;
  let endLuvi = Math.sqrt(endAssetDepth * endRuneDepth) / endPoolUnits;
  let changeInLuvi = endLuvi / startLuvi - 1;
  let annualizedAPR = (changeInLuvi * 365) / 100;
  
  // since the endpoint for history/depths includes luvi, we don't have to calculate it

*/

const getHistory = async (pool, interval, count) => {
  const baseUrl = MIDGARD_API_9R_URL;
  const apiconfig = new Configuration({ basePath: baseUrl });
  const midgardApi = new MidgardApi(apiconfig);
  const response = await midgardApi
    .getDepthHistory(pool, interval, count)
    .catch((error) => {
      console.log(error);
      return error;
    });

  return response.data.intervals;
};

const convertDataToAPR = (rows, lookback) => {
  let data = rows.map((row, index) => {
    if (index >= lookback) {
      let startRowIndex = index - lookback;
      let startLUVI = rows[startRowIndex].luvi;
      let endLUVI = row.luvi;
      let changeInLUVI = endLUVI / startLUVI - 1;
      let annualizedAPR = (changeInLUVI * 365) / 100;
      row.annualizedAPR = annualizedAPR.toString();
      return row;
    }
  });
  data = [...data.slice(lookback)];
  return data;
};

let data = await getHistory('BTC.BTC', 'day', 365);
let aprs = convertDataToAPR(data, 100);
console.log(aprs);
