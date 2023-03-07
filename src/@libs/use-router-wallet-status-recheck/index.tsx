import { useInterval } from '@libs/use-interval';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// import { WalletContext } from '@terra-money/wallet-provider';
// import { EvmWalletContext } from '@libs/evm-wallet/providers/EvmWalletProvider';
import { XdefiWalletContext } from '@libs/evm-wallet/providers/XdefiWalletProvider';

const interval = 1000 * 60;

export function useRouterWalletStatusRecheck() {
  const { pathname } = useLocation();
  // const { recheckStatus } = useContext(EvmWalletContext);
  const { recheckStatus } = useContext(XdefiWalletContext);

  const lastCheckTime = useRef<number>(Date.now());

  const check = useCallback(() => {
    recheckStatus();
    lastCheckTime.current = Date.now();
  }, [recheckStatus]);

  useEffect(() => {
    check();
  }, [check, pathname]);

  const tick = useCallback(() => {
    const now = Date.now();

    if (now > lastCheckTime.current + interval) {
      check();
    }
  }, [check]);

  useInterval(tick, interval);
}

export function RouterWalletStatusRecheck() {
  useRouterWalletStatusRecheck();
  return null;
}
