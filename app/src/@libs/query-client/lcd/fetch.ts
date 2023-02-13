import { LcdFetchError } from '../errors';

export type LcdResult<Data> =
  | {
      height: string;
      result: Data;
    }
  | {
      txhash: string;
      code: number;
      raw_log: string;
    };

export type LcdFetcher = <Data>(
  endpoint: string,
  requestInit?: Omit<RequestInit, 'method' | 'body'>,
) => Promise<Data>;

export function defaultLcdFetcher(endpoint: string, requestInit?: RequestInit) {
  return null;
}
