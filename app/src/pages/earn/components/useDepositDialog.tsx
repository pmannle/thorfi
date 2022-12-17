import React, { ReactNode } from 'react';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { FormParams, FormReturn } from './types';
import { TerraDepositDialog } from './terra';
import { EvmDepositDialog } from './evm';

function Component({ closeDialog }: DialogProps<FormParams, FormReturn>) {
  return <TerraDepositDialog closeDialog={closeDialog} />;
}

export function useDepositDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog<FormParams, FormReturn>(Component);
}
