import { LcdFault } from '../errors';
import { WasmFetchBaseParams, WasmQueryData } from '../interface';
import { defaultLcdFetcher, LcdFetcher, LcdResult } from './fetch';

export interface LcdFetchParams<WasmQueries>
  extends WasmFetchBaseParams<WasmQueries> {
  lcdFetcher?: LcdFetcher;
  lcdEndpoint: string;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
}

export async function lcdFetch({
  id,
  wasmQuery,
  lcdEndpoint,
  lcdFetcher = defaultLcdFetcher,
  requestInit,
}) {
  return {};
}
