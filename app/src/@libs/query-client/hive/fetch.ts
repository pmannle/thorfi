import { HiveFetchError } from '../errors';

export type HiveFetcher = <Variables extends {}, Data>(
  query: string,
  variables: Variables,
  endpoint: string,
  requestInit?: Omit<RequestInit, 'method' | 'body'>,
) => Promise<Data>;

export const defaultHiveFetcher = () => {
  return null;
};

const workerPool: Worker[] = [];

export const webworkerHiveFetcher = () => {
  return null;
};
