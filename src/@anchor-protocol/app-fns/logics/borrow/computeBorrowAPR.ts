import type { Rate } from '@thorfi-protocol/types';
import { moneyMarket } from '@thorfi-protocol/types';
import big, { Big } from 'big.js';

export function computeBorrowAPR(
  borrowRate: moneyMarket.interestModel.BorrowRateResponse | undefined,
  blocksPerYear: number,
): Rate<Big> {
  return big(borrowRate?.rate ?? 0).mul(blocksPerYear) as Rate<Big>;
}
