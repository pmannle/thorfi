import { formatOutput } from '@anchor-protocol/formatter';
import {
  formatUST,
  formatUSTWithPostfixUnits,
  formatUTokenIntegerWithoutPostfixUnits,
} from '@thorfi-protocol/notation';
import { u, UST } from '@thorfi-protocol/types';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { AnimateNumber } from '@libs/ui';
import { Sub } from 'components/Sub';
import { fixHMR } from 'fix-hmr';
// import { Reward, useRewards } from 'pages/mypage/logics/useRewards';
import { useAssetPriceInUstQuery } from 'queries';
import React, { useMemo } from 'react';
import big from 'big.js';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface TotalClaimableRewardsProps {
  className?: string;
}

const hasReward = (rewards: Reward[] | undefined, target: string) => []
// rewards?.find((reward) =>
//   reward.symbol.toLowerCase().includes(target.toLowerCase()),
// );

function TotalClaimableRewardsBase({ className }: TotalClaimableRewardsProps) {
  const { data: ancPrice } = { data: { ancPrice: 0 } }// useAssetPriceInUstQuery('anc');
  const { data: astroPrice } = { data: { astroPrice: 0 } } // useAssetPriceInUstQuery('astro');

  const { rewards: allRewards, rewardsAmountInUst } = { rewards: { allRewards: [] }, rewardsAmountInUst: 0 }// useRewards();
  const rewards = big(0)
  // useMemo(
  //   () =>
  //     allRewards && allRewards.filter(({ amount }) => !big(amount).eq(big(0))),
  //   [allRewards],
  // );

  const hasAstroReward = useMemo(() => false, [rewards]);

  return (
    <Section className={className}>
      <header>
        <h4>
          <IconSpan>
            TOTAL CLAIMABLE INTEREST EARNED{' '}
            <InfoTooltip>
              Total amount of earned interest available for withdrawal.
            </InfoTooltip>
          </IconSpan>
        </h4>
        <p>
          {/* {rewards &&
            rewards.map(({ amount, symbol }, index) => (
              <React.Fragment key={symbol}>
                <AnimateNumber format={formatOutput}>
                  {demicrofy(amount)}
                </AnimateNumber>
                <Sub>
                  {' '}
                  {symbol}
                  {index < rewards.length - 1 && ' + '}
                </Sub>
              </React.Fragment>
            ))} */}
        </p>
        <p>
          <AnimateNumber
            format={formatUTokenIntegerWithoutPostfixUnits}
          >
            {(0 as u<UST<number>>)}
          </AnimateNumber>
          UST
        </p>
      </header>

      <div className="anc-price">
        <h5>ANC PRICE</h5>
        <p>
          <AnimateNumber
            format={formatUTokenIntegerWithoutPostfixUnits}
          >
            {(0 as u<UST<number>>)}
          </AnimateNumber>
          <Sub> UST</Sub>
        </p>
      </div>

      {hasAstroReward && (
        <div className="anc-price">
          <h5>ASTRO PRICE</h5>
          <p>
            <AnimateNumber
              format={formatUTokenIntegerWithoutPostfixUnits}
            >
              {(0 as u<UST<number>>)}
            </AnimateNumber>
            <Sub> UST</Sub>
          </p>
        </div>
      )}

      <div className="spacer" />

      <ActionButton
        className="claim"
        component={Link}
        to={`/claim/all`}
        disabled
      >
        Claim All Rewards
      </ActionButton>
    </Section>
  );
}

export const StyledTotalClaimableRewards = styled(TotalClaimableRewardsBase)`
  .NeuSection-content {
    display: flex;
    flex-direction: column;

    height: 100%;
  }

  header {
    h4 {
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 10px;
    }

    p:nth-of-type(1) {
      font-size: clamp(20px, 8vw, 32px);
      font-weight: 500;

      sub {
        font-size: 20px;
      }
    }

    p:nth-of-type(2) {
      margin-top: 7px;

      font-size: 13px;
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  .anc-price {
    margin-top: 40px;

    h5 {
      font-size: 12px;
      font-weight: 500;
    }

    p {
      margin-top: 6px;

      font-size: 24px;
      font-weight: 500;

      sub {
        font-size: 13px;
      }
    }
  }

  .spacer {
    flex: 1;
    min-height: 60px;
  }

  @media (max-width: 1200px) {
    .anc-price {
      margin-top: 30px;
    }

    .spacer {
      min-height: 30px;
    }
  }
`;

export const TotalClaimableRewards = fixHMR(StyledTotalClaimableRewards);
