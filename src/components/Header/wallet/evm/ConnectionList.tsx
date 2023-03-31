import React, { useCallback, useState } from 'react';
import { useEvmWallet } from '@libs/evm-wallet';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { ConnectionTypeList } from 'components/Header/desktop/ConnectionTypeList';
import { TermsMessage } from 'components/Header/desktop/TermsMessage';
import { useWeb3React } from '@libs/evm-wallet';
import { getProviderOptions } from "@thorfi-protocol/utils";

import CryptoContext from '@thorfi-protocol/CryptoContext';




import {
  WalletsModal,
  useWalletEvents,
  DisconnectBtn,
  useWalletsOptions,
  // WalletProvider,
} from '@xdefi/wallets-connector';
import {
  useConnectedSingleAccounts,
  useConnectorSingleConfigs,
  useConnectedMultiAccounts,
} from '@xdefi/wallets-connector';
import {
  WalletProvider,
} from './Providers';




interface ConnectionListProps {
  onClose: () => void;
}

const ConnectionList = (props: ConnectionListProps) => {

  const { providers: userOptions } = useWalletsOptions()

  const { onClose } = props;

  // const { connect } = useWeb3React();

  // const { availableConnections } = useEvmWallet();

  const [isChainSelectorVisible, setIsChainSelectorVisible] =
    useState<boolean>(false)

  const handleShowChainSelector = useCallback(() => {
    setIsChainSelectorVisible(true)
  }, [setIsChainSelectorVisible])

  return (
    <ConnectionTypeList footer={<TermsMessage />}>


      {userOptions.map((provider: any) =>
        provider ? (
          <WalletProvider
            key={provider.name}
            provider={provider}
            onSelect={onClose}
            onShowChainSelector={handleShowChainSelector}
          />
        ) : null
      )}



      {/* {availableConnections.map(({ icon, name, type }) => (
        <FlatButton
          key={type}
          className="connect"
          onClick={() => {
            onClose();
            const connector = connect(type);
            connector.activate();
          }}
        >
          <IconSpan>
            {name}
            <img src={icon} alt={name} />
          </IconSpan>
        </FlatButton>
      ))} */}
    </ConnectionTypeList>
  );
};

export { ConnectionList };
