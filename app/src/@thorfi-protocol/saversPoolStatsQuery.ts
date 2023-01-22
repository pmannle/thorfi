export interface SaversPoolData {
  [asset: string]: {
    totalEarned: any;
    saversDepthUSD: any;
    totalAnnualisedReturn: any;
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
