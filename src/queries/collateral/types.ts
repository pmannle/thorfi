import { CW20Addr, ERC20Addr, moneyMarket } from '@thorfi-protocol/types';
import { WasmQuery } from '@libs/query-client';

export interface WhitelistWasmQuery {
  whitelist: WasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >;
}

export type WhitelistCollateral =
  moneyMarket.overseer.WhitelistResponse['elems'][0] & {
    icon?: string;
    decimals: number;
    bridgedAddress?: CW20Addr | ERC20Addr;
  };
