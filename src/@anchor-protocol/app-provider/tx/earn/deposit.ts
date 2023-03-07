import { earnDepositTx } from '@anchor-protocol/app-fns';
import { u, UST } from '@thorfi-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
// import { useConnectedWallet } from '@terra-money/wallet-provider';
// import { useConnectedWallet } from '@libs/evm-wallet/providers/EvmWalletProvider';
import { useEvmWallet,
} from '@libs/evm-wallet';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface EarnDepositTxParams {
  depositAmount: UST;
  txFee: u<UST>;
  onTxSucceed?: () => void;
}

export function useEarnDepositTx() {
  const connectedWallet = useEvmWallet();

  const { constants, txErrorReporter, queryClient, contractAddress } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ depositAmount, txFee, onTxSucceed }: EarnDepositTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return earnDepositTx({
        // fabricateMarketDepositStableCoin
        walletAddr: connectedWallet.address,
        // marketAddr: contractAddress.moneyMarket.market,
        depositAmount,
        // post
        network: connectedWallet.provider?._network,
        post: connectedWallet.post,
        txFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.EARN_DEPOSIT);
        },
      });
    },
    [
      connectedWallet,
      // contractAddress.moneyMarket.market,
      // constants.gasWanted,
      // constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
