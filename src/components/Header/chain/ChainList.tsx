import React from 'react';
import { UIElementProps } from '@libs/ui';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { ButtonList } from '../shared';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { ChainListFooter } from './ChainListFooter';
import styled from 'styled-components';
import { Chain } from '@anchor-protocol/app-provider';

interface ChainListProps extends UIElementProps {
  onClose: () => void;
}

function ChainListBase(props: ChainListProps) {
  const { className, onClose } = props;

  return (
    <ButtonList
      className={className}
      title="Switch Chain"
      footer={<ChainListFooter />}
    >
      <FlatButton
        key={Chain.Terra}
        className="button"
        onClick={() => {
          onClose();
        }}
      >
        <IconSpan>
          {Chain.Terra}
          <img src={'/assets/terra-network-logo.png'} alt={Chain.Terra} />
        </IconSpan>
      </FlatButton>
    </ButtonList>
  );
}

export const ChainList = styled(ChainListBase)`
  .button {
    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};
    color: ${({ theme }) => theme.textColor};
  }
`;
