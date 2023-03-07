import { moneyMarket } from '@thorfi-protocol/types';
import { createCollateralVector } from '../../models/collaterals';

export const vectorizeOverseerWhitelist = createCollateralVector(
  (item: moneyMarket.overseer.WhitelistResponse['elems'][number]) => {
    return [item.collateral_token, item.max_ltv];
  },
);
