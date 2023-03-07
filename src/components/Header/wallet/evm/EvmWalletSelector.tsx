import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'contexts/account';
import { WalletSelector } from '../../desktop/WalletSelector';
import {
  DropdownContainer,
  DropdownBox,
} from 'components/Header/desktop/DropdownContainer';
import { useEvmWallet, useWeb3React } from '@libs/evm-wallet';
import { ConnectionList } from './ConnectionList';
import { Content } from './Content';
import styled from 'styled-components';
import { UIElementProps } from '@libs/ui';
import { CryptoState } from '@thorfi-protocol/CryptoContext';
import {
  useConnectedSingleAccounts,
  useConnectorSingleConfigs,
  useConnectedMultiAccounts,
  useWalletEvents,
  WalletsContext,
  DisconnectWalletsTrigger,
  DisconnectBtn
} from '@xdefi/wallets-connector';



const EvmWalletSelectorBase = ({ className }: UIElementProps) => {

  const {
    isConnected,
    multi,
    setMulti,
    accounts,
    setAccounts,
    configs,
    setConfigs,
    chains,
    setChains,
    onConnectHandler,
    onCloseHandler,
    onErrorHandler,
    providerId,
    setProviderId
  } = CryptoState();

  let _multi = useConnectedMultiAccounts();
  let _accounts = useConnectedSingleAccounts();
  let _configs = useConnectorSingleConfigs();
  let _chains = useMemo(() => Object.keys(accounts || {}), [accounts]);

  useEffect(() => {
    if (isConnected) {
      setMulti(_multi);
      setAccounts(_accounts);
      setConfigs(_configs);
      setChains(_chains);
      console.log('<--- DATA Wallet Connect --->: ', {
        configs,
        accounts,
        multi,
        chains,
      });
    }
  }, [
    isConnected,
    setMulti,
    _multi,
    setAccounts,
    _accounts,
    setConfigs,
    _configs,
    setChains,
    _chains
  ]);

  useWalletEvents(onConnectHandler, onCloseHandler, onErrorHandler);

  // const { account } = accounts['arbitrum'][0];

  const account = accounts ? accounts[Object.keys(accounts)[0]][0] : ''
  console.log('account', account)

  const context = useContext(WalletsContext)

  const handleDisconnect = useCallback(async () => {
    if (context) {
      await context.disconnect(providerId)
    }
  }, [context, providerId])



  const { disconnect } = useWeb3React();

  const { connection, status } = useEvmWallet();

  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => setOpen((prev) => !prev), []);

  const onClose = useCallback(() => setOpen(false), []);

  const disconnectWallet = useCallback(() => {
    onClose();
    disconnect();
  }, [disconnect, onClose]);



  return (
    <WalletSelector
      className={className}
      walletAddress={account}
      initializing={status === 'initialization'}
      onClick={onClick}
      onClose={onClose}
    >
      <>
        {open && (
          <DropdownContainer>
            <DropdownBox>
              {!isConnected ? (
                <ConnectionList onClose={onClose} />
              ) : (
                <Content
                  walletAddress={account}
                  connection={connection}
                  onClose={onClose}
                  onDisconnectWallet={
                    handleDisconnect
                  }
                />

              )}

            </DropdownBox>
          </DropdownContainer>
        )}
      </>
    </WalletSelector>
  );
};

const EvmWalletSelector = styled(EvmWalletSelectorBase)``;

export { EvmWalletSelector };
