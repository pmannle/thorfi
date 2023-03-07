import type { bAsset, u } from '@thorfi-protocol/types';
import big from 'big.js';

export function validateDepositAmount(
  depositAmount: u<bAsset>,
  balance: u<bAsset>,
): string | undefined {
  if (depositAmount.length === 0) {
    return undefined;
  } else if (big(depositAmount).gt(balance ?? 0)) {
    return `Not enough assets`;
  }
  return undefined;
}
