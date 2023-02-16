import type { ReactNode } from 'react';
import React from 'react';
import type { DialogProps, OpenDialog } from '@libs/use-dialog';
import { useDialog } from '@libs/use-dialog';
import { FormParams, FormReturn } from './types';
import { TerraWithdrawDialog } from './terra';
import { EvmWithdrawDialog } from './evm';

function Component(props: DialogProps<FormParams, FormReturn>) {
  return <TerraWithdrawDialog {...props} />;
}

export function useWithdrawDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog<FormParams, FormReturn>(Component);
}
