import WalletConnect from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import Torus from '@toruslabs/torus-embed'
import Ledger from '@web3modal/ledger-provider'
import Trezor from '@web3modal/trezor-provider'
import { Web3Auth } from '@web3auth/web3auth'
import { injected } from '@xdefi/wallets-connector'
import { Network } from '@xchainjs/xchain-client'
import { BigNumber } from 'ethers'
import { EtherscanProvider, ExplorerProvider } from '@xchainjs/xchain-evm'
import { AssetETH, Chain } from '@xchainjs/xchain-util'
import { AlchemyProvider } from '@ethersproject/providers'
import { Client as ClientDoge } from "@xchainjs/xchain-doge"
import { Client as ClientAvax, defaultAvaxParams } from "@xchainjs/xchain-avax"
import { Client as ClientBitcoin } from "@xchainjs/xchain-bitcoin"
import { Client as ClientBitCoinCash } from "@xchainjs/xchain-bitcoincash"
import { Client as ClientLitecoin } from "@xchainjs/xchain-litecoin"
import { Client as ClientBinance } from "@xchainjs/xchain-binance"
import { Client as ClientEvm } from '@xchainjs/xchain-evm'
// import Icon from "react-crypto-icons";


const ETHERSCAN_API: any = process.env.REACT_APP_ETHERSCAN_API
const ALCHEMY_API: any = process.env.REACT_APP_ALCHEMY_API
// const COVALENT_API:any = process.env.REACT_APP_COVELANT

export const getProviderOptions = () => {
  const INFURA_ID = process.env.REACT_APP_INFURA_ID
  const providerOptions = {
    xdefi: {},
    injected: {
      display: {
        ...injected.FALLBACK,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Circle-icons-gamecontroller.svg/2048px-Circle-icons-gamecontroller.svg.png'
      }
    },
    metamask: {},
    opera: {},
    safe: {},
    cipher: {},

    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'WalletConnect Example App',
        infuraId: INFURA_ID
      }
    },
    web3auth: {
      package: Web3Auth,
      options: {
        infuraId: INFURA_ID
      }
    },
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: INFURA_ID
      }
    },
    torus: {
      package: Torus
    },
    ledger: {
      package: Ledger
    },
    trezor: {
      package: Trezor
    }
  }
  return providerOptions
}

//=================== Etherum ===================

export const ethersJSProviders = {
  [Network.Mainnet]: new AlchemyProvider("homestead", ALCHEMY_API),
  [Network.Testnet]: new AlchemyProvider("goerli", ALCHEMY_API),
  [Network.Stagenet]: new AlchemyProvider("homestead", ALCHEMY_API)
}
export const ethRootDerivationPaths = {
  [Network.Mainnet]: `m/44'/60'/0'/0/`,
  [Network.Testnet]: `m/44'/60'/0'/0/`,
  [Network.Stagenet]: `m/44'/60'/0'/0/`,
}
export const defaults = {
  [Network.Mainnet]: {
    approveGasLimit: BigNumber.from(200000),
    transferGasAssetGasLimit: BigNumber.from(23000),
    transferTokenGasLimit: BigNumber.from(100000),
    gasPrice: BigNumber.from(30),
  },
  [Network.Testnet]: {
    approveGasLimit: BigNumber.from(200000),
    transferGasAssetGasLimit: BigNumber.from(23000),
    transferTokenGasLimit: BigNumber.from(100000),
    gasPrice: BigNumber.from(30),
  },
  [Network.Stagenet]: {
    approveGasLimit: BigNumber.from(200000),
    transferGasAssetGasLimit: BigNumber.from(23000),
    transferTokenGasLimit: BigNumber.from(100000),
    gasPrice: BigNumber.from(30),
  },
}

export const ETH_MAINNET_EXPLORER = new ExplorerProvider(
  'https://etherscan.io',
  'https://etherscan.io/address/%%ADDRESS%%',
  'https://etherscan.io/tx/%%TX_ID%%'
)
export const ETH_TESTNET_EXPLORER = new ExplorerProvider(
  'https://ropsten.etherscan.io',
  'https://ropsten.etherscan.io/address/%%ADDRESS%%',
  'https://ropsten.etherscan.io/tx/%%TX_ID%%'
)

export const ethExplorerProviders = {
  [Network.Mainnet]: ETH_MAINNET_EXPLORER,
  [Network.Testnet]: ETH_TESTNET_EXPLORER,
  [Network.Stagenet]: ETH_MAINNET_EXPLORER,
}

export const ethDataProviders = {
  [Network.Mainnet]: new EtherscanProvider(
    ethersJSProviders.mainnet,
    'https://api.etherscan.io/',
    ETHERSCAN_API,
    Chain.Ethereum,
    AssetETH,
    18
  ),
  [Network.Testnet]: new EtherscanProvider(
    ethersJSProviders.testnet,
    'https://api-goerli.etherscan.io/',
    ETHERSCAN_API,
    Chain.Ethereum,
    AssetETH,
    18
  ),
  [Network.Stagenet]: new EtherscanProvider(
    ethersJSProviders.stagenet,
    'https://api.etherscan.io/',
    ETHERSCAN_API,
    Chain.Ethereum,
    AssetETH,
    18
  ),
}

export const ethParams = {
  chain: Chain.Ethereum,
  gasAsset: AssetETH,
  gasAssetDecimals: 18,
  defaults: defaults,
  providers: ethersJSProviders,
  explorerProviders: ethExplorerProviders,
  dataProviders: ethDataProviders,
  network: Network.Mainnet,
  // phrase,
  feeBounds: {
    lower: 1,
    upper: 1,
  },
  rootDerivationPaths: ethRootDerivationPaths,
}

//=================== Avalanche ===================
/* 
export const transferGasAssetGasLimit: BigNumber = BigNumber.from(21000)
export const transferTokenGasLimit: BigNumber = BigNumber.from(100000)

const AVALANCHE_MAINNET_ETHERS_PROVIDER = new providers.JsonRpcProvider(
  'https://api.avax.network/ext/bc/C/rpc'
  )
const AVALANCHE_TESTNET_ETHERS_PROVIDER = new providers.JsonRpcProvider(
  'https://api.avax-test.network/ext/bc/C/rpc',
)

const avaxJSProviders = {
  [Network.Mainnet]: AVALANCHE_MAINNET_ETHERS_PROVIDER,
  [Network.Testnet]: AVALANCHE_TESTNET_ETHERS_PROVIDER,
  [Network.Stagenet]: AVALANCHE_MAINNET_ETHERS_PROVIDER,
}

const AVAX_ONLINE_PROVIDER_MAINNET = new CovalentProvider(COVALENT_API, Chain.Avalanche, 43114, AssetAVAX, 18)
const AVAX_ONLINE_PROVIDER_TESTNET = new CovalentProvider(COVALENT_API, Chain.Avalanche, 43113, AssetAVAX, 18)

const avaxProviders = {
  [Network.Mainnet]: AVAX_ONLINE_PROVIDER_MAINNET,
  [Network.Testnet]: AVAX_ONLINE_PROVIDER_TESTNET,
  [Network.Stagenet]: AVAX_ONLINE_PROVIDER_MAINNET,
}

const AVAX_MAINNET_EXPLORER = new ExplorerProvider(
  'https://snowtrace.io/',
  'https://snowtrace.io/tx/%%TX_ID%%',
  'https://snowtrace.io/address/%%ADDRESS%%',
)
const AVAX_TESTNET_EXPLORER = new ExplorerProvider(
  'https://testnet.snowtrace.io/',
  'https://testnet.snowtrace.io/tx/%%TX_ID%%',
  'https://testnet.snowtrace.io/address/%%ADDRESS%%',
)
const avaxExplorerProviders = {
  [Network.Mainnet]: AVAX_MAINNET_EXPLORER,
  [Network.Testnet]: AVAX_TESTNET_EXPLORER,
  [Network.Stagenet]: AVAX_MAINNET_EXPLORER,
}

const avaxRootDerivationPaths = {
  [Network.Mainnet]: `m/44'/60'/0'/0/`,
  [Network.Testnet]: `m/44'/60'/0'/0/`,
  [Network.Stagenet]: `m/44'/60'/0'/0/`,
}
const avax_defaults = {
  [Network.Mainnet]: {
    approveGasLimit: BigNumber.from(200000),
    transferGasAssetGasLimit: BigNumber.from(23000),
    transferTokenGasLimit: BigNumber.from(100000),
    gasPrice: BigNumber.from(30),
  },
  [Network.Testnet]: {
    approveGasLimit: BigNumber.from(200000),
    transferGasAssetGasLimit: BigNumber.from(23000),
    transferTokenGasLimit: BigNumber.from(100000),
    gasPrice: BigNumber.from(30),
  },
  [Network.Stagenet]: {
    approveGasLimit: BigNumber.from(200000),
    transferGasAssetGasLimit: BigNumber.from(23000),
    transferTokenGasLimit: BigNumber.from(100000),
    gasPrice: BigNumber.from(30),
  },
}
const avaxParams: EVMClientParams = {
  chain: Chain.Avalanche,
  gasAsset: AssetAVAX,
  gasAssetDecimals: 18,
  defaults,
  providers: ethersJSProviders,
  explorerProviders: avaxExplorerProviders,
  dataProviders: avaxProviders,
  network: Network.Testnet,
  // phrase,
  feeBounds: {
    lower: 1,
    upper: 1,
  },
  rootDerivationPaths: ethRootDerivationPaths,
}

*/


