import { SaversPoolData } from '@anchor-protocol/app-fns/queries/market/saversPoolStats';
import { formatUST } from '@anchor-protocol/notation';
import { u, UST } from '@anchor-protocol/types';
import { AnimateNumber } from '@libs/ui';
import { ConsoleMessage } from 'puppeteer';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'styled-components';
import { DoughnutChart } from './DoughnutChart';

export interface TotalValueLockedDoughnutChartProps {
  totalDeposit: u<UST>;
  totalCollaterals: u<UST>;
  totalDepositColor: string;
  totalCollateralsColor: string;
  marketSaversStats: SaversPoolData;
  saverTotals: any;
  setPool: Function;
}

export const TotalValueLockedDoughnutChart = (
  props: TotalValueLockedDoughnutChartProps,
): JSX.Element => {
  let returnArray: { label: string; color: string; value: any }[] = [];

  const theme = useTheme();

  const descriptors = useMemo(() => {
    if (!props.marketSaversStats) return [];

    // console.log(props.marketSaversStats)
    let saverStats = props.marketSaversStats;

    Object.values(saverStats).forEach((saver, index) => {
      let colorIndex = [
        '#008631',
        '#00ab41',
        '#00c04b',
        '#1fd655',
        '#39e75f',
        '#5ced73',
        '#83f28f',
        '#abf7b1',
        '#cefad0',
      ];

      returnArray.push({
        label: saver.asset,
        color: colorIndex[index],
        value: saver.saversDepth * saver.assetPrice,
      });
    });

    return returnArray;
  }, [props.marketSaversStats]);

  let saverTotals = props.saverTotals;
  const setPool = props.setPool;

  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      chartRef.current.canvasRef.current.addEventListener('click', (e) => {
        var activePoints = chartRef.current.chart.getElementsAtEventForMode(
          e,
          'nearest',
          { mode: 'point', axis: 'xy', intersect: true },
          true,
        );
        let clickedLabel =
          chartRef.current.props.descriptors[activePoints[0].index].label;
        setPool(clickedLabel);
      });
    }
  }, []);

  return (
    <div className="chartContainer">
      <DoughnutChart descriptors={descriptors} ref={chartRef} />
      <div className="chartInner">
        <h2>TOTAL SAVER ACCOUNTS</h2>
        <p>
          <AnimateNumber format={formatUST}>
            {saverTotals
              ? (saverTotals.saversCount as u<UST<number>>)
              : (0 as u<UST<number>>)}
          </AnimateNumber>
        </p>
        <h2>APR MEAN</h2>
        <p>
          <AnimateNumber format={formatUST}>
            {saverTotals
              ? (saverTotals.meanAPR as u<UST<number>>)
              : (0 as u<UST<number>>)}
          </AnimateNumber>
          <span>%</span>
        </p>
      </div>
    </div>
  );
};
