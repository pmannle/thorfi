import {
  formatUST,
  formatUTokenInteger,
  formatUTokenIntegerWithoutPostfixUnits,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Rate, u, UST } from '@anchor-protocol/types';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
  useSaversHistoryQuery,
  useMarketCollateralsQuery,
  useMarketDepositAndBorrowQuery,
  useMarketStableCoinQuery,
  useMarketUstQuery,
  convertDataToAPR,
} from '@anchor-protocol/app-provider';
import {
  d2Formatter,
  formatAssetName,
  formatRate,
  formatUTokenDecimal2,
} from '@libs/formatter';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import {
  horizontalRuler,
  pressed,
  verticalRuler,
} from '@libs/styled-neumorphism';
import { AnimateNumber } from '@libs/ui';
import big, { Big } from 'big.js';
import { Footer } from 'components/Footer';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { screen } from 'env';
import { fixHMR } from 'fix-hmr';
import React, { useEffect, useMemo, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';
import { SaverAPRChart } from './components/SaverAPRChart';
import { findPrevDay } from './components/internal/axisUtils';
import { StablecoinChart } from './components/StablecoinChart';
import { TotalValueLockedDoughnutChart } from './components/TotalValueLockedDoughnutChart';
import { CollateralMarket } from './components/CollateralMarket';
import { useDepositApy } from 'hooks/useDepositApy';
import { useSaversPoolStatsQuery } from '@thorfi-protocol/saversPoolStats';
import { MarketSaversData } from '@thorfi-protocol/saversHistoryQuery';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Box } from '@material-ui/core';
import { useLiquidityPoolsQuery } from '@thorfi-protocol/liquidityPools';

export interface DashboardProps {
  className?: string;
}

const EMPTY_ARRAY: any[] = [];

function DashboardBase({ className }: DashboardProps) {
  const theme = useTheme();

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    function handler() {
      setIsMobile(window.innerWidth < 500);
    }

    window.addEventListener('resize', handler);
    handler();

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  const {
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  const { data: { borrowRate, epochState } = {} } = useMarketStableCoinQuery();

  const depositApy = useDepositApy();

  const stableCoinLegacy = useMemo(() => {
    if (!borrowRate || !epochState) {
      return 0;
    }

    return {
      depositRate: depositApy,
      borrowRate: big(0) as Rate<Big>,
    };
  }, [blocksPerYear, borrowRate, epochState, depositApy]);

  const { data: { moneyMarketEpochState } = {} } = useEarnEpochStatesQuery();
  const { data: marketUST } = useMarketUstQuery();
  const { data: marketSaversStats } = useSaversPoolStatsQuery();
  const { data: liquidityPools } = useLiquidityPoolsQuery();

  const [pool, setPool] = useState('');

  const lookback = 7; // set lookback for APR to 7 days

  const queriesArray = useMemo(() => {
    if (!marketSaversStats) {
      return [];
    }

    let queriesArray = Object.values(marketSaversStats).map((stats) => {
      return {
        interval: 'day',
        count: 100,
        lookback: lookback,
        // endpoint: `./savers_data/${pool}_savers.json`,
        endpoint: `v2/history/savers`,
        asset: stats.asset,
      };
    });

    return queriesArray;
  }, [marketSaversStats]);

  const saversHistoricalData = useSaversHistoryQuery(queriesArray);

  const showSelectedPool = useMemo(() => {
    if (!marketSaversStats) {
      return 0;
    }
    return Object.values(marketSaversStats).filter(
      (stats) => stats.asset === pool,
    )[0];
  }, [pool, marketSaversStats]);

  const saversHistoryChartData = useMemo(() => {
    let _pool = pool ? pool : setPool('BTC.BTC');

    if (saversHistoricalData) {
      let selectedPool = saversHistoricalData
        .filter((saversPools) => saversPools.asset === _pool)
        .map((saverPool) => {
          let history = saverPool.history;

          if (!history) return;

          history = convertDataToAPR(history, lookback);

          const currentDate = new Date();
          const yearAgoDate = currentDate.setFullYear(
            currentDate.getFullYear() - 1,
          );
          const yearAgoTimestamp = yearAgoDate.valueOf();

          return history
            .filter(({ endTime }) => endTime * 1000 >= yearAgoTimestamp)
            .sort((a, b) => a.endTime - b.endTime);
        });

      return selectedPool[0];
    }
  }, [saversHistoricalData]);

  const { data: marketDepositAndBorrow } = useMarketDepositAndBorrowQuery();
  const { data: marketCollaterals } = useMarketCollateralsQuery();

  const saverTotals = useMemo(() => {
    if (!marketSaversStats || !liquidityPools) {
      return 0;
    }

    const totalSaversStats = {
      saversCount: 0,
      totalUSDSaved: 0,
      totalEarn: 0,
      meanAPR: 0,
      totalFilled: 0,
    };

    const totalPoolDepthUSD = Object.values(marketSaversStats)
      .map((d) => Number(d.assetDepth))
      .reduce((a, b) => a + b, 0);

    Object.values(marketSaversStats).forEach((saver, index) => {
      let savers_units = Number(
        Object.values(liquidityPools).filter(
          (values) => values.asset == saver.asset,
        )[0].savers_units,
      );

      totalSaversStats.saversCount += saver.saversCount;
      totalSaversStats.totalUSDSaved += +saver.saversDepth * +saver.assetPrice;
      totalSaversStats.totalEarn +=
        (+saver.saversDepth - +savers_units) * +saver.assetPrice;
      totalSaversStats.meanAPR += saver.saverReturn;
      totalSaversStats.totalFilled +=
        (+saver.synthSupply / 1e8) * +saver.assetPrice;
    });

    return {
      saversCount: totalSaversStats?.saversCount,
      totalCollaterals: marketCollaterals?.now.total_value,
      totalValueSaved: big(totalSaversStats?.totalUSDSaved) as u<UST<Big>>,
      totalEarned: big(totalSaversStats?.totalEarn / 1e8) as u<UST<Big>>,
      meanAPR: big(totalSaversStats.meanAPR) as Rate<Big>,
    };
  }, [pool, marketSaversStats]);

  const stableCoin = useMemo(() => {
    if (
      !marketUST ||
      !marketDepositAndBorrow ||
      marketDepositAndBorrow.history.length === 0
    ) {
      return 0;
    }

    const last = marketDepositAndBorrow.now;
    const last1DayBefore =
      marketDepositAndBorrow.history.find(findPrevDay(last.timestamp)) ??
      marketDepositAndBorrow.history[marketDepositAndBorrow.history.length - 2];

    return {
      totalDeposit: last.total_ust_deposits,
      totalBorrow: last.total_borrowed,
      totalDepositDiff: big(0) as Rate<Big>,
      totalBorrowDiff: big(0) as Rate<Big>,
      borrowAPR: big(0) as Rate<Big>,
      borrowAPRDiff: 'TODO: API not ready...',
    };
  }, [blocksPerYear, marketDepositAndBorrow, marketUST]);

  return (
    <div className={className}>
      <main>
        <div className="content-layout">
          <TitleContainerAndExchangeRate>
            <PageTitle title="ThorFi DASHBOARD" />
          </TitleContainerAndExchangeRate>

          <div className="summary-section">
            <Section className="total-value-locked">
              <section>
                <h2>TOTAL VALUE SAVED</h2>
                <p className="amount">
                  $
                  <AnimateNumber
                    format={formatUTokenIntegerWithoutPostfixUnits}
                  >
                    {saverTotals
                      ? saverTotals.totalValueSaved
                      : (0 as u<UST<number>>)}
                  </AnimateNumber>
                  <span>USD</span>
                </p>
                <figure>
                  <div className="chart">
                    <TotalValueLockedDoughnutChart
                      marketSaversStats={marketSaversStats}
                      saverTotals={saverTotals}
                      totalDeposit={saverTotals?.saversCount ?? ('0' as u<UST>)}
                      totalCollaterals={
                        saverTotals?.totalCollaterals ?? ('1' as u<UST>)
                      }
                      totalDepositColor={theme.colors.secondary}
                      totalCollateralsColor={theme.textColor}
                      setPool={setPool}
                    />
                  </div>
                </figure>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h2
                    style={{
                      display: 'flex',
                      justifyContent: 'right',
                      marginTop: '15px',
                    }}
                  >
                    TOTAL VALUE EARNED
                  </h2>
                  <p className="amount earned">
                    $
                    <AnimateNumber format={formatUST}>
                      {saverTotals
                        ? saverTotals.totalEarned
                        : (0 as u<UST<number>>)}
                    </AnimateNumber>
                    <span>USD</span>
                  </p>
                </div>
              </section>
            </Section>

            <Section className="apr-chart">
              <header style={{ flexDirection: 'column' }}>
                <Box
                  style={{ display: 'grid', gridTemplateColumns: '1fr 8fr' }}
                >
                  <h2 style={{ display: 'inline-flex' }}>
                    <div
                      style={{ flexDirection: 'column', marginRight: '20px' }}
                    >
                      <div>SAVERS</div>
                      <div>POOLS</div>
                    </div>
                  </h2>
                  <div className="apr-chart-buttons">
                    {marketSaversStats &&
                      Object.keys(marketSaversStats).map((asset) => (
                        <ActionButton
                          key={asset}
                          className="asset-button"
                          style={{
                            backgroundColor:
                              asset === pool
                                ? theme.colors.positive
                                : 'inherit',
                          }}
                          onClick={() => setPool(asset)}
                        >
                          {formatAssetName(asset)}
                        </ActionButton>
                      ))}
                  </div>
                </Box>
                <hr className="heavy-ruler" />

                <Section
                  className="asset-chart current-apr"
                  style={{
                    border: 'none',
                    width: '100%',
                    boxShadow: 'none',
                    padding: 0,
                  }}
                >
                  <section style={{ padding: 0 }}>
                    <div>
                      <section>
                        <h2>
                          {showSelectedPool &&
                            formatAssetName(showSelectedPool.asset)}{' '}
                          CURRENT APR (7 day)
                        </h2>
                        {showSelectedPool && (
                          <div>
                            <p>
                              <AnimateNumber format={formatUST}>
                                {showSelectedPool.totalAnnualisedReturn
                                  ? (showSelectedPool.totalAnnualisedReturn as u<
                                      UST<number>
                                    >)
                                  : (0 as u<UST<number>>)}
                              </AnimateNumber>
                              <span>%</span>
                            </p>
                          </div>
                        )}
                      </section>
                      <hr />
                      <section>
                        <h3>Pool Depth</h3>
                        {showSelectedPool && (
                          <div>
                            <p>
                              <span>$</span>
                              <AnimateNumber format={formatUTokenDecimal2}>
                                {showSelectedPool.saversDepthUSD
                                  ? (showSelectedPool.saversDepthUSD as u<
                                      UST<number>
                                    >)
                                  : (0 as u<UST<number>>)}
                              </AnimateNumber>
                            </p>
                          </div>
                        )}
                        <h3 style={{ marginTop: '8px' }}>
                          (
                          {showSelectedPool &&
                            d2Formatter(showSelectedPool.assetDepth)}{' '}
                          {showSelectedPool &&
                            formatAssetName(showSelectedPool.asset)}
                          )
                        </h3>
                      </section>
                      <hr />
                      <section>
                        <h3>Cap Filled</h3>
                        {showSelectedPool && (
                          <div>
                            <p>
                              <AnimateNumber format={formatUST}>
                                {showSelectedPool.filled
                                  ? (showSelectedPool.filled as u<UST<number>>)
                                  : (0 as u<UST<number>>)}
                              </AnimateNumber>
                              <span>%</span>
                            </p>
                          </div>
                        )}
                        <p></p>
                      </section>
                    </div>
                  </section>
                </Section>
              </header>
              <figure>
                <div>
                  <SaverAPRChart
                    data={saversHistoryChartData ?? EMPTY_ARRAY}
                    theme={theme}
                    isMobile={isMobile}
                  />
                </div>
              </figure>
            </Section>
          </div>

          <Section className="stablecoin">
            <header>
              <div>
                <h2>
                  <i style={{ backgroundColor: theme.colors.secondary }} />{' '}
                  TOTAL DEPOSIT
                  {stableCoin && (
                    <span data-negative={big(0).lt(0)}>
                      {big(0).gte(0) ? '+' : ''}
                      {formatRate(stableCoin.totalDepositDiff)}%
                    </span>
                  )}
                </h2>
                <p className="amount">
                  <AnimateNumber
                    format={formatUTokenIntegerWithoutPostfixUnits}
                  >
                    {stableCoin
                      ? stableCoin.totalDeposit
                      : (0 as u<UST<number>>)}
                  </AnimateNumber>
                  <span>UST</span>
                </p>
              </div>
              <div>
                <h2>
                  <i style={{ backgroundColor: theme.textColor }} /> TOTAL
                  BORROW
                  {stableCoin && (
                    <span data-negative={big(0).lt(0)}>
                      {big(0).gte(0) ? '+' : ''}
                      {formatRate(stableCoin.totalBorrowDiff)}%
                    </span>
                  )}
                </h2>
                <p className="amount">
                  <AnimateNumber
                    format={formatUTokenIntegerWithoutPostfixUnits}
                  >
                    {stableCoin
                      ? stableCoin.totalBorrow
                      : (0 as u<UST<number>>)}
                  </AnimateNumber>
                  <span>UST</span>
                </p>
              </div>
              <div />
            </header>

            <figure>
              <div>
                <StablecoinChart
                  data={marketDepositAndBorrow?.history ?? EMPTY_ARRAY}
                  theme={theme}
                  isMobile={isMobile}
                />
              </div>
            </figure>

            <HorizontalScrollTable minWidth={900} className="stablecoin-market">
              <colgroup>
                <col style={{ width: 300 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 200 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>STABLECOIN MARKET</th>
                  <th>
                    <IconSpan>
                      Total Deposit{' '}
                      <InfoTooltip>
                        Total deposited value of this stablecoin market in USD
                      </InfoTooltip>
                    </IconSpan>
                  </th>
                  <th>
                    <IconSpan>
                      Deposit APY{' '}
                      <InfoTooltip>
                        Annualized deposit interest of this stablecoin market
                      </InfoTooltip>
                    </IconSpan>
                  </th>
                  <th>
                    <IconSpan>
                      Total Borrow{' '}
                      <InfoTooltip>
                        Total borrow value of this stable coin market in USD
                      </InfoTooltip>
                    </IconSpan>
                  </th>
                  <th>
                    <IconSpan>
                      Borrow APR{' '}
                      <InfoTooltip>Annualized borrow interest</InfoTooltip>
                    </IconSpan>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <i>
                        <TokenIcon token="ust" />
                      </i>
                      <div>
                        <div className="coin">UST</div>
                        <p className="name">Terra USD</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      ${' '}
                      <AnimateNumber format={formatUTokenInteger}>
                        {stableCoin
                          ? stableCoin.totalDeposit
                          : (0 as u<UST<number>>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      <AnimateNumber format={formatRate}>
                        {stableCoinLegacy
                          ? stableCoinLegacy.depositRate
                          : (0 as Rate<number>)}
                      </AnimateNumber>
                      <span>%</span>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      ${' '}
                      <AnimateNumber format={formatUTokenInteger}>
                        {stableCoin
                          ? stableCoin.totalBorrow
                          : (0 as u<UST<number>>)}
                      </AnimateNumber>
                    </div>
                  </td>
                  <td>
                    <div className="value">
                      <AnimateNumber format={formatRate}>
                        {stableCoinLegacy
                          ? stableCoinLegacy.borrowRate
                          : (0 as Rate<number>)}
                      </AnimateNumber>
                      <span>%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </HorizontalScrollTable>
          </Section>

          <CollateralMarket className="collaterals" />
        </div>

        <Footer style={{ margin: '60px 0' }} />
      </main>
    </div>
  );
}

const TitleContainerAndExchangeRate = styled(TitleContainer)`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  > :nth-child(2) {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.03em;

    small {
      font-size: 0.8em;
    }

    img {
      transform: scale(1.2) translateY(0.1em);
    }
  }

  @media (max-width: 700px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    > :nth-child(2) {
      font-size: 18px;
    }
  }
`;

const hHeavyRuler = css`
  padding: 0;
  margin: 0;

  border: 0;

  height: 5px;
  border-radius: 3px;

  ${({ theme }) =>
    pressed({
      color: theme.sectionBackgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};
`;

const hRuler = css`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};
`;

const vRuler = css`
  ${({ theme }) =>
    verticalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};
`;

const StyledDashboard = styled(DashboardBase)`
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  h2 {
    font-size: 12px;
    font-weight: 500;

    margin-bottom: 8px;

    span {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 22px;
      margin-left: 10px;
      background-color: ${({ theme }) => theme.colors.positive};
      color: ${({ theme }) => theme.highlightBackgroundColor};

      &[data-negative='true'] {
        background-color: ${({ theme }) => theme.colors.negative};
      }
    }
  }

  h3 {
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};
  }

  .amount {
    font-size: 32px;
    font-weight: 500;

    span:last-child {
      margin-left: 8px;
      font-size: 0.555555555555556em;
    }
  }

  .earned {
    display: flex;
    justify-content: right;
    align-items: baseline;
  }

  .total-value-locked {
    figure {
      margin-top: 15px;

      display: flex;
      align-items: center;

      > .chart {
        width: 100%;
        height: 100%;
      }

      > div {
        h3 {
          display: flex;
          align-items: center;

          i {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 3px;
            margin-right: 3px;
          }

          margin-bottom: 8px;
        }

        p {
          font-size: 18px;

          &:nth-of-type(1) {
            margin-bottom: 27px;
          }
        }
      }
    }

    .chartContainer {
      margin: 0 auto;
      max-width: 100%;
      position: relative;
    }

    .chartInner {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: absolute;
      top: 22%;
      right: 20%;
      bottom: 20%;
      left: 20%;
      border-radius: 50%;
      padding: 1.25em 0;
      overflow: hidden;

      > h2 {
        display: flex;
        justify-content: center;
      }

      > p {
        display: flex;
        justify-content: center;
        font-size: 32px;
        font-weight: 500;
      }
    }
  }

  .apr-chart {
    header {
      display: flex;
      align-items: flex-start;

      > div:first-child {
        flex: 1;
      }

      > div:not(:first-child) {
        h3 {
          margin-bottom: 10px;
        }

        p {
          font-size: 18px;

          span:last-child {
            margin-left: 5px;
            font-size: 12px;
          }
        }

        &:last-child {
          margin-left: 30px;
        }
      }

      margin-bottom: 15px;

      .asset-button {
        border-radius: 20px;
        padding: 0px 20px;
        margin: 0px 4px;
        height: 27px;
        border: 1px solid rgba(255, 255, 255, 0.5);
      }
    }

    figure {
      > div {
        width: 100%;
        height: 300px;
      }
    }
  }

  .asset-chart > .NeuSection-content {
    display: flex;
    justify-content: space-between;

    max-width: 1000px;

    hr {
      ${vRuler};
    }

    section {
      div {
        display: flex;

        p {
          display: inline-block;

          font-size: 27px;
          font-weight: 500;

          word-break: keep-all;
          white-space: nowrap;

          /* span {
            font-size: 0.666666666666667em;
            margin-left: 5px;
            color: ${({ theme }) => theme.dimTextColor};
          } */

          &:first-child {
            margin-right: 20px;
          }
        }
      }
    }
  }

  .current-apr > .NeuSection-content {
    padding: 20px;
    width: 100%;
  }

  .current-apr > .NeuSection-content > section {
    width: 100%;
  }

  .current-apr > .NeuSection-content > section > div {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
  }

  section.current-apr > div > section > div > section > h3 {
    margin-bottom: 8px;
  }

  .stablecoin {
    header {
      display: grid;
      grid-template-columns: repeat(3, 1fr);

      h2 {
        i {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 3px;
          margin-right: 3px;
          transform: translateY(1px);
        }
      }

      margin-bottom: 15px;
    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .collaterals {
    header {
      margin-bottom: 15px;
    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .stablecoin-market,
  .basset-market {
    margin-top: 40px;

    table {
      thead {
        th {
          text-align: right;

          &:first-child {
            font-weight: bold;
            color: ${({ theme }) => theme.textColor};
            text-align: left;
          }
        }
      }

      tbody {
        td {
          text-align: right;

          .value,
          .coin {
            font-size: 16px;
          }

          .volatility,
          .name {
            font-size: 13px;
            color: ${({ theme }) => theme.dimTextColor};
          }

          &:first-child > div {
            text-decoration: none;
            color: currentColor;

            text-align: left;

            display: flex;

            align-items: center;

            i {
              width: 60px;
              height: 60px;

              margin-right: 15px;

              svg,
              img {
                display: block;
                width: 60px;
                height: 60px;
              }
            }

            .coin {
              font-weight: bold;

              grid-column: 2;
              grid-row: 1/2;
            }

            .name {
              grid-column: 2;
              grid-row: 2;
            }
          }
        }
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  main {
    .content-layout {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0;
    }
  }

  // pc
  padding: 50px 100px 100px 100px;

  .NeuSection-root {
    margin-bottom: 40px;
  }

  // align section contents to origin
  @media (min-width: 1400px) {
    .summary-section {
      grid-gap: 40px;
      margin-bottom: 40px;

      hr.heavy-ruler {
        ${hHeavyRuler};
        margin-top: 4px;
        margin-bottom: 10px;
        width: 100%;
      }

      .NeuSection-root {
        margin-bottom: 0;
      }

      height: 625px;

      display: grid;
      grid-template-columns: 500px 1fr 1fr;
      grid-template-rows: repeat(5, 1fr);

      .total-value-locked {
        grid-column: 1/2;
        grid-row: 1/6;

        hr {
          ${hHeavyRuler};
          margin-top: 80px;
          margin-bottom: 40px;
        }
      }

      .apr-chart {
        grid-column: 2/4;
        grid-row: 1/6;
      }

      .apr-chart-buttons {
        display: grid;
        grid-template-columns: repeat(8, 60px);
      }

      .asset-chart {
        grid-column: 2/4;
        grid-row: 5/6;
      }
    }
  }

  // align apr-buttons
  @media (min-width: 1450px) {
    .summary-section {
      .apr-chart-buttons {
        display: grid;
        grid-template-columns: repeat(8, 70px);
      }
    }
  }

  // align apr-buttons
  @media (min-width: 1500px) {
    .summary-section {
      .apr-chart-buttons {
        display: grid;
        grid-template-columns: repeat(8, 75px);
      }
    }
  }

  // align section contents to horizontal
  @media (min-width: 940px) and (max-width: 1399px) {
    .summary-section {
      .total-value-locked > .NeuSection-content {
        max-width: 840px;
        display: flex;
        justify-content: space-between;

        hr {
          ${vRuler};
          margin-left: 40px;
          margin-right: 40px;
        }

        padding: 0;
      }
    }

    .stablecoin {
      header {
        grid-template-columns: repeat(2, 1fr);

        > div:empty {
          display: none;
        }
      }
    }
  }

  // under tablet
  // align section contents to horizontal
  @media (max-width: 939px) {
    padding: 20px 30px 30px 30px;

    h1 {
      margin-bottom: 20px;
    }

    h2 {
      span {
        padding: 3px 7px;
      }
    }

    .amount {
      font-size: 28px;
    }

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 30px;
      }
    }

    .summary-section {
      .total-value-locked {
        align-items: stretch !important;
        flex-direction: row;
        display: flex;

        hr {
          ${hHeavyRuler};
          margin-top: 30px;
          margin-bottom: 30px;
        }

        figure {
          > div {
            p {
              font-size: 16px;
            }
          }
        }
      }

      .apr-chart {
        header {
          display: block;

          > div:first-child {
            margin-bottom: 10px;
          }

          > div:not(:first-child) {
            display: grid;
            grid-template-columns: 160px 1fr;
            grid-template-rows: 28px;
            align-items: center;

            h3 {
              margin: 0 0 8px 0;
            }

            p {
              font-size: 16px;

              span:last-child {
                margin-left: 5px;
                font-size: 12px;
              }
            }

            &:first-child {
              flex: 1;

              p {
                font-size: 36px;
                font-weight: 700;

                span {
                  font-size: 20px;
                }
              }
            }

            &:last-child {
              margin-left: 0;
            }
          }

          margin-bottom: 15px;
        }
      }

      .asset-chart > .NeuSection-content {
        display: block;

        section {
          div {
            display: block;

            p {
              display: block;

              font-size: 20px;

              margin-top: 0.5em;
            }
          }
        }

        hr {
          ${hRuler};
          margin: 15px 0;
        }
      }
    }

    .stablecoin {
      header {
        display: block;

        > div:first-child {
          margin-bottom: 15px;
        }

        > div:empty {
          display: none;
        }
      }
    }

    .stablecoin-market,
    .basset-market {
      table {
        tbody {
          td {
            .value,
            .coin {
              font-size: 15px;
            }

            .volatility,
            .name {
              font-size: 12px;
            }

            &:first-child > div {
              i {
                width: 50px;
                height: 50px;

                margin-right: 10px;

                svg,
                img {
                  display: block;
                  width: 50px;
                  height: 50px;
                }
              }
            }
          }
        }
      }
    }
  }

  // under mobile
  // align section contents to vertical
  @media (max-width: ${screen.mobile.max}px) {
    padding: 10px 20px 30px 20px;

    h1 {
      margin-bottom: 10px;
    }

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 20px;
      }
    }

    .summary-section {
      .total-value-locked {
        figure {
          > .chart {
            width: 120px;
            height: 120px;

            margin-right: 30px;
          }

          > div {
            p:nth-of-type(1) {
              margin-bottom: 12px;
            }
          }
        }
      }
    }
  }

  @media (min-width: 1400px) and (max-width: 1500px) {
    .asset-chart > .NeuSection-content {
      section {
        div {
          p {
            font-size: 20px;
          }
        }
      }
    }
  }
`;

export const Dashboard = fixHMR(StyledDashboard);
