import { NominalType } from './common';

export type Rate<T = string> = T & NominalType<'ratio'>;

export type Percent<T = string> = T & NominalType<'percent'>;

export type Num<T = string> = T & NominalType<'number'>;

export type JSDateTime = number & NominalType<'jsdatetime'>;

export type DateTime = number & NominalType<'datetime'>;

export type ISODateFormat = string & NominalType<'isodateformat'>;

interface Interval {
  FiveMin: '5min';
  Hour: 'hour';
  Day: 'day';
  Week: 'month';
  Quarter: 'quarter';
  Year: 'year';
}

const Interval: Interval = {
  FiveMin: '5min',
  Hour: 'hour',
  Day: 'day',
  Week: 'month',
  Quarter: 'quarter',
  Year: 'year',
};

export interface SaversQuery {
  pool: string;
  interval: Interval;
  count: number;
  lookback: number; // 7 days
  endpoint: string;
}
