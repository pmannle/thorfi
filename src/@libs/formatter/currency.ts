import { NominalType, Token, u } from '@libs/types';
import big, { Big, BigSource } from 'big.js';
import { bisect } from 'd3-array';

// ---------------------------------------------
// micro
// ---------------------------------------------
export const MICRO = 1000000;

export function microfy<T extends Token<BigSource>>(
  amount: T,
  decimals: number = 6,
): T extends NominalType<infer N> ? u<Big & NominalType<N>> : u<T> {
  return big(amount).mul(Math.pow(10, decimals)) as any;
}

export function demicrofy<T extends Token<BigSource>>(
  amount: u<T>,
  decimals: number = 6,
): T extends NominalType<infer N> ? Big & NominalType<N> : T {
  return big(amount).div(Math.pow(10, decimals)) as any;
}

/**
 * Formats the given value as a currency string, with the specified currency symbol and number of decimal places.
 *
 * @param value The value to be formatted as a currency.
 * @param symbol The currency symbol to be used.
 * @param decimals The number of decimal places to be displayed.
 */
export function currency(
  value: number,
  symbol: string = '$',
  decimals: number = 2,
): string {
  const digitsRE = /(\d{3})(?=\d)/g;
  if (!isFinite(value) || (!value && value !== 0)) return '';
  var stringified = Math.abs(value).toFixed(decimals);
  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  var i = _int.length % 3;
  var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
  var _float = decimals ? stringified.slice(-1 - decimals) : '';
  //  var sign = value < 0 ? '-' : ''
  //  return sign + symbol + head +
  //    _int.slice(i).replace(digitsRE, '$1,') +
  //    _float
  let returnValue = head + _int.slice(i).replace(digitsRE, '$1,') + _float;

  return returnValue;
}

/**
 * Formats the given value as a percentage string, with the specified number of decimal places and multiplier.
 *
 * @param value The value to be formatted as a percentage.
 * @param decimals The number of decimal places to be displayed.
 * @param multiplier The value to multiply the value by before formatting it as a percentage.
 */
export function percent(
  value: number,
  decimals: number = 2,
  multiplier: number = 100,
): string {
  if (!isFinite(value) || (!value && value !== 0)) return '';
  decimals = decimals != null ? decimals : 2;
  multiplier = multiplier != null ? multiplier : 100;
  var stringified = Math.abs(value * multiplier).toFixed(decimals);
  return stringified;
}
