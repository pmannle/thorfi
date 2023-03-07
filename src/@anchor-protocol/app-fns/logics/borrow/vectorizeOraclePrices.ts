import { moneyMarket } from '@thorfi-protocol/types';
import { createCollateralVector } from '../../models/collaterals';

export const vectorizeOraclePrices = createCollateralVector(
  (item: moneyMarket.oracle.PricesResponse['prices'][number]) => {
    return [item.asset, item.price];
  },
);
