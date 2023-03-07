import { CW20Addr } from '@thorfi-protocol/types';
import { createCollateralVector } from '../../models/collaterals';
import { BAssetLtv } from '../../queries/borrow/market';

export const vectorizeBAssetMaxLtvs = createCollateralVector(
  (item: [CW20Addr, BAssetLtv]) => {
    return [item[0], item[1].max];
  },
);

export const vectorizeBAssetSafeLtvs = createCollateralVector(
  (item: [CW20Addr, BAssetLtv]) => {
    return [item[0], item[1].safe];
  },
);
