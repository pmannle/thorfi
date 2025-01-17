import {
  computeBorrowAPR,
  computeBorrowedAmount,
  computeBorrowLimit,
  computeCollateralsTotalUST,
  computeNetAPR,
} from '@anchor-protocol/app-fns';
import { computebAssetLtvsAvg } from '@anchor-protocol/app-fns/logics/borrow/computebAssetLtvsAvg';
import {
  useAnchorWebapp,
  useBorrowAPYQuery,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
} from '@anchor-protocol/app-provider';
import { Rate, u, UST } from '@thorfi-protocol/types';
import big, { Big } from 'big.js';
import { useMemo } from 'react';

export function useBorrowOverviewData() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const {
    constants: { blocksPerYear },
  } = { constants: { blocksPerYear: 0 } };

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: { borrowRate, oraclePrices, bAssetLtvs } = {} } =
  { data: { borrowRate: 0, oraclePrices: 0, bAssetLtvs: 0 } }

  const { data: { marketBorrowerInfo, overseerCollaterals } = {} } =
  { data: { marketBorrowerInfo: 0, overseerCollaterals: 0 } }

  const { data: { borrowerDistributionAPYs } = {} } = { data: { borrowerDistributionAPYs: 0  } };

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const { currentLtv, borrowAPR, borrowedValue, collateralValue, borrowLimit } =
    useMemo(() => {
      const collateralsValue =
        overseerCollaterals && oraclePrices
          ? computeCollateralsTotalUST(overseerCollaterals, oraclePrices)
          : (big(0) as u<UST<Big>>);

      const borrowAPR = computeBorrowAPR(borrowRate, blocksPerYear);

      const borrowedValue = computeBorrowedAmount(marketBorrowerInfo);

      const borrowLimit =
        overseerCollaterals && oraclePrices && bAssetLtvs
          ? computeBorrowLimit(overseerCollaterals, oraclePrices, bAssetLtvs)
          : undefined;

      const currentLtv = (
        borrowLimit && borrowLimit.gt(0) ? borrowedValue.div(borrowLimit) : 0
      ) as Rate<big>;

      return {
        currentLtv,
        borrowAPR,
        borrowedValue,
        collateralValue: collateralsValue,
        borrowLimit,
      };
    }, [
      bAssetLtvs,
      blocksPerYear,
      borrowRate,
      marketBorrowerInfo,
      oraclePrices,
      overseerCollaterals,
    ]);

  const netAPR = useMemo(() => {
    return computeNetAPR(borrowerDistributionAPYs, borrowAPR);
  }, [borrowAPR, borrowerDistributionAPYs]);

  const dangerLtv = useMemo(() => {
    if (bAssetLtvs) {
      const bAssetLtvsAvg = computebAssetLtvsAvg(bAssetLtvs);
      return big(bAssetLtvsAvg.max).minus(0.1) as Rate<Big>;
    }
    return big(0.5) as Rate<Big>;
  }, [bAssetLtvs]);

  return {
    blocksPerYear,
    borrowRate,
    oraclePrices,
    bAssetLtvs,
    currentLtv,
    borrowAPR,
    borrowedValue,
    collateralValue,
    borrowLimit,
    netAPR,
    dangerLtv,
    borrowerDistributionAPYs,
  };
}
