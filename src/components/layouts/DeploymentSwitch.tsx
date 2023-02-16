import { Chain } from '@anchor-protocol/app-provider';
import React, { FunctionComponent, ReactNode } from 'react';

interface DeploymentSwitchProps {
  terra: FunctionComponent | ReactNode;
}

export function DeploymentSwitch(props: DeploymentSwitchProps) {
  const { terra } = props;

  let content: ReactNode;

  content = terra;

  return typeof content === 'function' ? content() : content;
}
