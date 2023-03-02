import { computeApy } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import { useMemo } from 'react';

export const useDepositApy = () => {
  const { constants } = useAnchorWebapp();
  const { data: { overseerConfig, overseerEpochState } = {} } =
    { data: {overseerConfig: 0, overseerEpochState: 0 }};

  return useMemo(() => {
    return 0;
  }, []);
};
