import { Discord } from '@thorfi-protocol/icons';
import {
  useLastSyncedHeightQuery,
  useNetwork,
} from '@anchor-protocol/app-provider';
import { IconButton } from '@material-ui/core';
import {
  Brightness3,
  Brightness5,
  GitHub,
  Telegram,
  Twitter,
} from '@material-ui/icons';
import { useTheme } from 'contexts/theme';
import { screen } from 'env';
import c from 'color';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BlockInfo } from './BlockInfo';
// import { Chain } from '@anchor-protocol/app-provider';
// import { EvmBlockInfo } from './EvmBlockInfo';
import { getBlockUrl } from 'utils/thorscope';

export interface FooterProps {
  className?: string;
  style?: CSSProperties;
}

function FooterBase({ className, style }: FooterProps) {
  const { network } = useNetwork();
  const { data: lastSyncedHeight = 0 } = { data: { lastSyncedHeight: 0 } } // useLastSyncedHeightQuery();

  const { themeColor, switchable, updateTheme } = useTheme();

  const appVersion = '0.01';

  return (
    <footer className={className} style={style}>
      <Info>
        <div className="blocks">
          <a
            href={getBlockUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <BlockInfo
              chainName={'Thorchain'}
              networkName={'mainnet'}
              blockNumber={['9,823,341']}
            />
          </a>
        </div>

        {appVersion && <p>{appVersion}</p>}

        <Link to="/terms">Terms</Link>
      </Info>
      <div>
        <IconButton
          component="a"
          href="#"
          target="_blank"
          rel="noreferrer"
        >
          <Discord />
        </IconButton>
        <IconButton
          component="a"
          href="#"
          target="_blank"
          rel="noreferrer"
        >
          <Twitter />
        </IconButton>
        <IconButton
          component="a"
          href="#"
          target="_blank"
          rel="noreferrer"
        >
          <Telegram />
        </IconButton>
        <IconButton
          component="a"
          href="#"
          target="_blank"
          rel="noreferrer"
        >
          <GitHub />
        </IconButton>
        {switchable && (
          <IconButton
            onClick={() =>
              updateTheme(themeColor === 'light' ? 'dark' : 'light')
            }
          >
            {themeColor === 'light' ? <Brightness5 /> : <Brightness3 />}
          </IconButton>
        )}
      </div>
    </footer>
  );
}

export const Footer = styled(FooterBase)`
  font-size: 12px;
  color: ${({ theme }) => c(theme.dimTextColor).alpha(0.5).toString()};

  a {
    text-decoration: none;
  }

  a,
  .MuiIconButton-root {
    color: ${({ theme }) => c(theme.dimTextColor).alpha(0.5).toString()};

    &:hover {
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  > :last-child {
    > :not(:first-child) {
      margin-left: 0.7em;
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${screen.tablet.max}px) {
    flex-direction: column;
  }

  .blocks {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 28px;
`;
