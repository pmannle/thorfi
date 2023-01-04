import { aUST, bLuna, Rate, u, UST } from '@anchor-protocol/types';
import { reset } from 'numeral';

export interface SaversPoolData {
  [asset: string]: {
    asset: string;
    filled: number;
    saversCount: number;
    saverReturn: number;
    earned: number;
    assetPrice: string;
    saversDepth: string;
    assetDepth: string;
    synthSupply: string;
  };
}

export function saversPoolStatsQuery(
  endpoint: string,
): Promise<SaversPoolData> {
  return fetch(`https://vanaheimex.com/api/saversExtraData`).then((res) =>
    res.json(),
  );
}
