import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import SaversAPI from './thorchain';

const defaultContext = {
  currency: 'USD',
  fiat_symbol: '$',
  accounts: false,
  multi: false,
  configs: false,
  chains: false,
  isConnected: false,
  pools: [],
  setCurrency: (currency: string) => {},
  setSymbol: (symbol: string) => {},
  setAccounts: (accounts: any) => {},
  setMulti: (multi: any) => {},
  setConfigs: (configs: any) => {},
  setChains: (chains: any) => {},
  setIsConnected: (isConnected: boolean) => {},
  setPools: (pools: any) => {},
  onConnectHandler: () => {},
  onCloseHandler: () => {},
  onErrorHandler: () => {},
};

const Crypto = createContext(defaultContext);

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [fiat_symbol, setSymbol] = useState('$');
  const [accounts, setAccounts] = useState(false);
  const [multi, setMulti] = useState(false);
  const [configs, setConfigs] = useState(false);
  const [chains, setChains] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [pools, setPools] = useState([]);

  const fetchPools = async () => {
    let saversAPI = new SaversAPI(currency);
    let pools = await saversAPI.scanPools();
    // await saversAPI.scanPools();
    console.log('Savers Pools', pools);
    setPools(pools);
  };

  useEffect(() => {
    switch (currency) {
      case 'BTC':
        setSymbol('฿');
        break;
      case 'USD':
        setSymbol('$');
        break;
      case 'INR':
        setSymbol('₹');
        break;
      case 'JPY':
        setSymbol('¥');
        break;
      default:
        setSymbol('฿');
    }

    fetchPools();
  }, [currency]);

  const onConnectHandler = useCallback(() => {
    setIsConnected(true);
  }, [setIsConnected]);

  const onErrorHandler = useCallback(() => {
    setIsConnected(false);
  }, [setIsConnected]);

  const onCloseHandler = useCallback(() => {
    setIsConnected(false);
  }, [setIsConnected]);

  return (
    <Crypto.Provider
      value={{
        //======== global unit of account ========
        currency,
        setCurrency, // global unit of account for UI
        fiat_symbol, // global unit of account symbol

        //======== connected wallet(s) state ========
        isConnected,
        setIsConnected,
        onConnectHandler,
        onCloseHandler,
        onErrorHandler,
        accounts,
        setAccounts,

        //======== multiple wallets flag ========
        multi,
        setMulti,

        //======== thorchain liquidity ========
        chains,
        setChains,
        pools,

        //======== multiple wallets flag ========
        configs,
        setConfigs,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
