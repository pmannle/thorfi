import { SingleCoin } from './coingecko';
import { setupCache } from 'axios-cache-adapter';

const axios = require('axios');

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

const api = axios.create({
  adapter: cache.adapter,
  // mode: 'cors',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
    // "x-client-id": "runabull",
    // 'X-Requested-With': 'test'
  },
});

// api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// api.defaults.headers.common['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, DELETE';

// api.defaults.headers.common['x-client-id'] = 'runabull'

let start_savers = 8195056; // don't pull blocks from before savers started
let heightNow;
let blocksPerYear = 5256000; // used for APR
let pools = [];

let blocksEndpoint = 'https://thornode.ninerealms.com/blocks/latest';
let poolsEndpoint = 'https://thornode.ninerealms.com/thorchain/pools';

const getCoinGeckoIdfromPoolTicker = {
  'AVAX.AVAX': 'avalanche-2',
  'BCH.BCH': 'bitcoin-cash',
  'BNB.BNB': 'binancecoin',
  'BTC.BTC': 'bitcoin',
  'DOGE.DOGE': 'dogecoin',
  'ETH.ETH': 'ethereum',
  'GAIA.ATOM': 'cosmos',
  'LTC.LTC': 'litecoin',
};

interface Pool {
  asset: string;
  savers_depth: number;
  savers_units: number;
  status: string;
}

interface CoinGeckoData {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      [key: string]: number;
    };
  };
}

interface SaverPool {
  ticker: string;
  depth: string;
  growth_since_start: number;
  apr: string;
  coingecko: CoinGeckoData;
  name: string;
  symbol: string;
  image: string;
  id: string;
  price_in_currency: number;
}

class SaversAPI {
  pools: Pool[];
  saverPools: SaverPool[];
  currency: string;

  constructor(currency: string) {
    this.pools = [];
    this.saverPools = [];
    this.currency = currency.toLowerCase();
  }

  scanPools = async (): Promise<SaverPool[]> => {
    const _saverPools: SaverPool[] = [];

    //   const heightNow = (await api.get(blocksEndpoint)).data.block.header.height;
    //   const poolsAll = (await api.get(poolsEndpoint)).data;
    const heightNow = (await axios.get(blocksEndpoint)).data.block.header
      .height;
    const poolsAll = (await axios.get(poolsEndpoint)).data;
    this.pools = poolsAll.filter((x) => x.status === 'Available');

    for (const pool of this.pools) {
      const assetTicker = pool.asset;
      let saverDepth = pool.savers_depth;
      const saverStart = pool.savers_units;
      const saverGrowth = (saverDepth - saverStart) / saverStart;
      const blocksPast = heightNow - start_savers;
      const saverReturn = (saverGrowth / blocksPast) * blocksPerYear;

      if (Number(saverDepth) === 0) {
        continue;
      }

      saverDepth = saverDepth / 100000000;
      const growth_since_start = saverGrowth * 100;
      const apr = `${Number(saverReturn * 100).toLocaleString()}%`;
      const ticker = `${assetTicker}`;

      // const response = await api.get(SingleCoin(getCoinGeckoIdfromPoolTicker[ticker]));
      const response = await axios.get(
        SingleCoin(getCoinGeckoIdfromPoolTicker[ticker]),
      );
      const data = response.data;
      console.log('CoinGecko', response);

      _saverPools.push({
        ticker,
        depth: `${saverDepth}`,
        growth_since_start,
        apr,
        coingecko: data,
        name: data.name,
        symbol: data.symbol,
        image: data.image.large,
        id: data.id,
        price_in_currency: data.market_data.current_price[this.currency],
      });
    }

    this.saverPools = _saverPools;
    return _saverPools;
  };
}

/*
class SaversAPI {

    constructor(currency) {
        this.pools = []; 
        this.saverPools = [];
        this.currency = currency.toLowerCase();
    }

    scanPools = async () => { 
        const _saverPools = []

        heightNow = (await api.get(blocksEndpoint)).data.block.header.height;
        let poolsAll = (await api.get(poolsEndpoint)).data;
        this.pools = poolsAll.filter((x) => x.status === "Available");

        for (let pool of this.pools) {
            let assetTicker = pool.asset;
            let saverDepth = pool.savers_depth;
            let saverStart = pool.savers_units;
            let saverGrowth = (saverDepth - saverStart) / saverStart;
            let blocksPast = heightNow - start_savers;
            let saverReturn = (saverGrowth / blocksPast) * blocksPerYear;
        
            if (Number(saverDepth) === 0){
                continue
            }

            saverDepth = saverDepth / 100000000
            let growth_since_start = saverGrowth * 100  
            let apr = `${Number(saverReturn * 100).toLocaleString()}%`
            let ticker = `${assetTicker}`

            let response = await api.get(SingleCoin(getCoinGeckoIdfromPoolTicker[ticker]))
            let data = response.data

            _saverPools.push({
                ticker: ticker,
                depth: `${saverDepth}`,
                growth_since_start: growth_since_start,
                apr: apr,
                coingecko: data,
                name: data.name,
                symbol: data.symbol,
                image: data.image.large,
                id: data.id,
                price_in_currency: data.market_data.current_price[this.currency]
            })
        }

        this.saverPools = _saverPools
        return _saverPools
    };


}
*/

export default SaversAPI;
