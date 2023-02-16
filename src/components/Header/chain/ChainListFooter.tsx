import { Chain } from '@anchor-protocol/app-provider';
import { UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';

function ChainListFooterBase({ className }: UIElementProps) {
  return (
    <p className={className}>
      You are currently connected to the{' '}
      <span className="highlight">{Chain.Terra}</span> network.
    </p>
  );
}

export const ChainListFooter = styled(ChainListFooterBase)`
  margin-top: 1.5em;
  font-size: 11px;
  line-height: 1.5;
  color: ${({ theme }) => theme.dimTextColor};

  .highlight {
    color: ${({ theme }) => theme.colors.positive};
    font-weight: 500;
  }
`;
