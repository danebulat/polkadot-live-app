// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@polkadot-live/types/misc';
import type { ActionMeta, TxStatus } from '@polkadot-live/types/tx';
import type BigNumber from 'bignumber.js';

export interface TxMetaContextInterface {
  txFees: BigNumber;
  notEnoughFunds: boolean;
  setTxFees: (f: BigNumber) => void;
  resetTxFees: () => void;
  sender: string | null;
  setSender: (s: string | null) => void;
  txFeesValid: boolean;
  getTxPayload: () => AnyJson;
  setTxPayload: (u: number, s: AnyJson) => void;
  getGenesisHash: () => AnyJson;
  setGenesisHash: (h: AnyJson) => void;
  resetTxPayloads: () => void;
  getTxSignature: () => AnyJson;
  setTxSignature: (s: AnyJson) => void;

  actionMeta: ActionMeta | null;
  setActionMeta: (m: ActionMeta | null) => void;
  estimatedFee: string;
  setEstimatedFee: (n: string) => void;
  txId: number;
  setTxId: (n: number) => void;
  txStatus: TxStatus;
  setTxStatus: (s: TxStatus) => void;
}
