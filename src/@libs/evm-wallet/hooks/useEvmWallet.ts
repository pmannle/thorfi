import { useContext } from 'react';
import { EvmWalletContext, EvmWallet } from '../providers/EvmWalletProvider';
import { XdefiWalletContext, XdefiWallet } from '@libs/evm-wallet/providers/XdefiWalletProvider';
import {
  WalletsModal,
  useWalletEvents,
  DisconnectBtn,
} from '@xdefi/wallets-connector';
import {
  useConnectedSingleAccounts,
  useConnectorSingleConfigs,
  useConnectedMultiAccounts,
} from '@xdefi/wallets-connector';

export function useEvmWallet(): XdefiWallet | EvmWallet {
  const context = useContext(EvmWalletContext);
  // const context = useContext(XdefiWalletContext);
  if (context === undefined) {
    throw Error('The EvmWalletContext has not been defined.');
  }
  return context;
}
