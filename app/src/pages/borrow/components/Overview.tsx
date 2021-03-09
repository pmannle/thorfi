import {
  APY,
  BorrowValue,
  CollateralValue,
  BorrowAPR,
} from '@anchor-protocol/icons';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  demicrofy,
  formatRateToPercentage,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uUST } from '@anchor-protocol/types';
import { BigSource } from 'big.js';
import { useConstants } from '@anchor-protocol/web-contexts/contexts/contants';
import { BorrowLimitGraph } from 'pages/borrow/components/BorrowLimitGraph';
import { useMarket } from 'pages/borrow/context/market';
import { apr as _apr } from 'pages/borrow/logics/apr';
import { borrowed as _borrowed } from 'pages/borrow/logics/borrowed';
import { collaterals as _collaterals } from 'pages/borrow/logics/collaterals';
import { useMemo } from 'react';
import styled from 'styled-components';

export interface OverviewProps {
  className?: string;
}

function OverviewBase({ className }: OverviewProps) {
  const {
    borrowRate,
    loanAmount,
    borrowInfo,
    oraclePrice,
    bLunaMaxLtv,
  } = useMarket();

  const { blocksPerYear } = useConstants();

  const apr = useMemo(() => _apr(borrowRate, blocksPerYear), [
    blocksPerYear,
    borrowRate,
  ]);

  const borrowed = useMemo(() => _borrowed(loanAmount), [loanAmount]);

  const collaterals = useMemo(
    () => _collaterals(borrowInfo, oraclePrice?.rate),
    [borrowInfo, oraclePrice?.rate],
  );

  return (
    <Section className={className}>
      <article>
        <div>
          <Tooltip
            title="The sum of all collaterals deposited by the user, in USD"
            placement="top"
          >
            <h3>Collateral Value</h3>
          </Tooltip>
          <div className="value">
            ${formatUSTWithPostfixUnits(demicrofy(collaterals))}
          </div>
          <div>
            <CircleOnly>
              <Circle>
                <CollateralValue />
              </Circle>
            </CircleOnly>
          </div>
        </div>

        <div>
          <Tooltip
            title="The sum of all loans borrowed by the user, in USD"
            placement="top"
          >
            <h3>Borrowed Value</h3>
          </Tooltip>
          <div className="value">
            ${formatUSTWithPostfixUnits(demicrofy(borrowed))}
          </div>
          <div>
            <LabelAndCircle>
              <p>
                <IconSpan>
                  Borrowed: {formatUSTWithPostfixUnits(demicrofy(borrowed))} UST{' '}
                  <InfoTooltip>
                    The borrow amount for this specific stablecoin
                  </InfoTooltip>
                </IconSpan>
              </p>
              <Circle>
                <BorrowValue />
              </Circle>
            </LabelAndCircle>
          </div>
        </div>

        <div className="apy">
          <Tooltip
            title="Annual Percentage Rate. The annualized rate of current interest on loans in USD"
            placement="top"
          >
            <h3>Net APY</h3>
          </Tooltip>
          <div className="value">{formatRateToPercentage(apr)}%</div>
          <div>
            <Circles>
              <div>
                <Circle>
                  <BorrowAPR />
                </Circle>
                <p>
                  Borrow APR
                  <b>
                    <s>3.19%</s>
                  </b>
                </p>
              </div>
              <div>
                <Circle>
                  <APY />
                </Circle>
                <p>
                  Distribution APY
                  <b>
                    <s>3.19%</s>
                  </b>
                </p>
              </div>
            </Circles>
          </div>
        </div>
      </article>

      <figure>
        <BorrowLimitGraph
          bLunaMaxLtv={bLunaMaxLtv ?? (0 as Rate<BigSource>)}
          collateralValue={collaterals}
          loanAmount={loanAmount?.loan_amount ?? (0 as uUST<BigSource>)}
        />
      </figure>
    </Section>
  );
}

export const Circle = styled.div`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.backgroundColor};
  display: inline-grid;
  min-width: 56px;
  max-width: 56px;
  min-height: 56px;
  max-height: 56px;
  place-content: center;
  color: ${({ theme }) => theme.dimTextColor};
`;

export const CircleOnly = styled.div`
  text-align: right;
`;

export const Circles = styled.div`
  display: flex;

  > div {
    flex: 1;

    display: flex;
    align-items: center;

    font-size: 13px;
    color: ${({ theme }) => theme.dimTextColor};

    word-break: keep-all;
    white-space: nowrap;

    b {
      display: block;
      color: ${({ theme }) => theme.textColor};
    }

    > :nth-child(odd) {
      margin-right: 10px;
    }
  }
`;

export const LabelAndCircle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.dimTextColor};
  font-size: 13px;
`;

export const Overview = styled(OverviewBase)`
  article > div {
    background: ${({ theme }) =>
      theme.palette.type === 'light' ? '#fcfcfc' : '#262940'};
    box-shadow: 0 8px 14px -8px rgba(0, 0, 0, 0.07);
    border-radius: 22px;
    padding: 35px 40px;
    height: 238px;

    display: grid;
    grid-template-rows: 20px 100px 1fr;

    h3 {
      font-size: 13px;
      font-weight: 500;
    }

    .value {
      font-size: 40px;
      font-weight: 300;
    }

    &.apy {
      color: ${({ theme }) => theme.colors.positive};

      .value {
        font-weight: 500;
      }
    }
  }
`;
