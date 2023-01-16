import { aUST, bLuna, Rate, u, UST } from '@anchor-protocol/types';
import { reset } from 'numeral';

export interface liquidityPoolsData {
  [asset: string]: {
    LP_units: string;
    asset: string;
    balance_asset: string;
    balance_rune: string;
    pending_inbound_asset: string;
    pending_inbound_rune: string;
    pool_units: string;
    savers_depth: string;
    savers_units: string;
    status: string;
    synth_mint_paused: string;
    synth_supply: string;
    synth_supply_remaining: string;
    synth_units: string;
  };
}

export function liquidityPoolsQuery(
  endpoint: string,
): Promise<liquidityPoolsData> {
  return fetch(`https://thornode.ninerealms.com/thorchain/pools`).then((res) =>
    res.json(),
  );
}
