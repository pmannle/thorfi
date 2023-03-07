import React, { useEffect, useMemo } from 'react';
// import { FaUserSecret } from 'react-icons/fa'
import { GiWallet } from 'react-icons/gi';
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
import { Button, makeStyles } from '@material-ui/core';
// import { AiOutlineLogout } from "react-icons/ai";
import styled from 'styled-components';
import { CryptoState } from './CryptoContext';

// Inherit Xdefi button and overide styles
const LogOutButton = styled(DisconnectBtn)`
  background: none;
  cursor: pointer;
  flex-basis: min-content;
  color: white;
  border: none;
  padding: 10px;
  height: 40px;
`;

const WalletConnect = () => {
  //const classes = useStyles();
  // const history = useHistory()

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
    _chains,
  ]);

  useWalletEvents(onConnectHandler, onCloseHandler, onErrorHandler);

  return (
    // <div className={classes.button_row}>
    <div>
      {!isConnected && (
        <WalletsModal
          isDark={true}
          trigger={(props) => (
            // <button {...props}>Connect</button>
            <Button
              {...props}
              // className={
              //   // isConnected ? classes.button__connected : classes.button
              // }
              variant="outlined"
            >
              {isConnected ? (
                // <GiWallet className={classes.icon__size} />
                <GiWallet />
              ) : (
                'Connect Wallet'
              )}
            </Button>
          )}
        />
      )}

      {isConnected && (
        <>
          <Button
            // className={classes.button__connected}
            variant="outlined"
            onClick={() => console.log('click') /*history.push('/stake/')  */}
          >
            {/* <GiWallet className={classes.icon__size} /> */}
            <GiWallet />
          </Button>
          <LogOutButton>{/* <AiOutlineLogout size='25px' /> */}</LogOutButton>
        </>
      )}
    </div>
  );
};

export default WalletConnect;
