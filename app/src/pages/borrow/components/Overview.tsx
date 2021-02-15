import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Label } from '@anchor-protocol/neumorphism-ui/components/Label';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  demicrofy,
  formatRatioToPercentage,
  formatUSTWithPostfixUnits,
  Ratio,
  uUST,
} from '@anchor-protocol/notation';
import { BigSource } from 'big.js';
import { useNetConstants } from 'contexts/net-contants';
import { BorrowLimitGraph } from 'pages/borrow/components/BorrowLimitGraph';
import { useMarket } from 'pages/borrow/context/market';
import { useAPR } from 'pages/borrow/logics/useAPR';
import { useBorrowed } from 'pages/borrow/logics/useBorrowed';
import { useCollaterals } from 'pages/borrow/logics/useCollaterals';

export interface OverviewProps {
  className?: string;
}

export function Overview({ className }: OverviewProps) {
  const {
    borrowRate,
    loanAmount,
    borrowInfo,
    oraclePrice,
    bLunaMaxLtv,
  } = useMarket();

  const { blocksPerYear } = useNetConstants();

  const apr = useAPR(borrowRate?.rate, blocksPerYear);
  const borrowed = useBorrowed(loanAmount?.loan_amount);
  const collaterals = useCollaterals(
    borrowInfo?.balance,
    borrowInfo?.spendable,
    oraclePrice?.rate,
  );

  // TODO
  //const bLunaWhitelistElem = overseerWhitelist.Result.elems.find(
  //  (entry) => entry.collateral_token === addressProvider.bAssetToken('ubluna'),
  //);
  //
  //// will change in the future where there are more collateral types
  //const borrowLimitValue = collateralValue.mul(bLunaWhitelistElem.ltv);
  //const borrowLimitPercentage = big(loanAmount.Result.loan_amount).div(
  //  borrowLimitValue,
  //);

  return (
    <Section className={className}>
      <article>
        <div>
          <Tooltip
            title="The sum of all collaterals deposited by the user, in USD"
            placement="top"
          >
            <Label>Collateral Value</Label>
          </Tooltip>
          <p>${formatUSTWithPostfixUnits(demicrofy(collaterals))}</p>
        </div>

        <div>
          <Tooltip
            title="The sum of all loans borrowed by the user, in USD"
            placement="top"
          >
            <Label>Borrowed Value</Label>
          </Tooltip>
          <p>${formatUSTWithPostfixUnits(demicrofy(borrowed))}</p>
          <p>
            <IconSpan>
              <InfoTooltip>
                The borrow amount for this specific stablecoin / The borrow
                amount for this specific stablecoin in USD
              </InfoTooltip>{' '}
              Borrowed: {formatUSTWithPostfixUnits(demicrofy(borrowed))} UST
            </IconSpan>
          </p>
        </div>

        <div>
          <Tooltip
            title="Annual Percentage Rate. The annualized rate of current interest on loans in USD"
            placement="top"
          >
            <Label>APR</Label>
          </Tooltip>
          <p>{formatRatioToPercentage(apr)}%</p>
          <p>
            <IconSpan>
              <InfoTooltip>
                Current rate of annualized borrowing interest applied for this
                stablecoin / The amount of interest accrued on open loans
              </InfoTooltip>{' '}
              Accrued: {formatUSTWithPostfixUnits(demicrofy(borrowed))} UST
            </IconSpan>
          </p>
        </div>
      </article>

      <figure>
        <BorrowLimitGraph
          bLunaMaxLtv={bLunaMaxLtv ?? (0 as Ratio<BigSource>)}
          collateralValue={collaterals}
          loanAmount={loanAmount?.loan_amount ?? (0 as uUST<BigSource>)}
        />
      </figure>
    </Section>
  );
}
