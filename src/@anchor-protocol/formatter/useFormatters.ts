import { Chain } from '@anchor-protocol/app-provider';
import { ANC, aUST, Native, Token } from '@anchor-protocol/types';
import { NoMicro, u, UST } from '@libs/types';
import { BigSource } from 'big.js';
import { useMemo } from 'react';
import {
  Formatters,
  Formatter,
  FormatterOutputOptions,
  microfy,
  demicrofy,
  formatOutput,
  formatInput,
} from '.';

const createFormatter = <T>(symbol: string, decimals: number): Formatter<T> => {
  return {
    formatOutput: (amount: T & NoMicro, options?: FormatterOutputOptions) =>
      formatOutput(amount, options),
    formatInput: (amount: BigSource): T => formatInput(amount, decimals),
    microfy: (amount: T): u<T> => microfy(amount, decimals),
    demicrofy: (amount: u<T> | Token<BigSource>): T =>
      demicrofy(amount, decimals),
    symbol,
    decimals,
  };
};

const useFormatters = (): Formatters => {
  return useMemo<Formatters>(() => {
    const tokens = {
      ust: createFormatter<UST>('UST', 6),
      aUST: createFormatter<aUST>('aUST', 6),
      anc: createFormatter<ANC>('ANC', 6),
    };

    return {
      ...tokens,
      native: createFormatter<Native>('LUNA', 6),
    };
  }, []);
};

export { useFormatters };
