import type { Rate, u, UST } from '@thorfi-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const computeLtvToBorrowAmount = (
  ltv: Rate<BigSource>,
  borrowLimit: u<UST<Big>>,
  borrowedAmount: u<UST<Big>>,
) => {
  return big(ltv).mul(borrowLimit).minus(borrowedAmount) as u<UST<Big>>;
};
