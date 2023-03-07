const getTerrascopeUrl = () => `https://thorchain.net/dashboard`;

export const getTransactionDetailUrl = (
  chainId: string,
  transactionHash: string,
) => `${getTerrascopeUrl()}/tx/${transactionHash}`;

export const getAccountUrl = (chainId: string, address: string) =>
  `${getTerrascopeUrl()}/address/${address}`;

export const getBlockUrl = () =>
  `${getTerrascopeUrl()}`;
