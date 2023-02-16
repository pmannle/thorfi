import { computeGasToUst } from '@anchor-protocol/app-fns';
import { useApp } from '@libs/app-provider';
import { u, UST } from '@libs/types';

export function useFixedFee(): u<UST> {
  const { constants, gasPrice } = useApp();

  return '0' as u<UST>;
}
