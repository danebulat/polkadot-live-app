// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { ChainID } from '@/types/chains';
import { APIsController } from '@/controller/APIsController';
import { WindowsController } from '@/controller/WindowsController';
import { MainDebug } from '@/utils/DebugUtils';
import type { AnyFunction, AnyJson } from '@/types/misc';

const debug = MainDebug.extend('PolkadotState');

export class PolkadotState {
  _chain: ChainID = 'Polkadot';

  _subscribed = false;

  _address: string;

  _existentialDeposit: BigNumber = new BigNumber(0);

  _locks: AnyJson = {};

  _account: AnyJson = {};

  activeSubscriptions: { id: string; unsub: AnyFunction }[] = [];

  constructor(address: string) {
    this._address = address;
    this.subscribe();
  }

  get chain() {
    return this._chain;
  }

  get subscribed() {
    return this._subscribed;
  }

  set subscribed(value: boolean) {
    this._subscribed = value;
  }

  get address() {
    return this._address;
  }

  get existentialDeposit() {
    return this._existentialDeposit;
  }

  set existentialDeposit(value: AnyJson) {
    this._existentialDeposit = value;
  }

  get locks() {
    return this._locks;
  }

  set locks(value: AnyJson) {
    this._locks = value;
  }

  get account() {
    return this._account;
  }

  set account(value: AnyJson) {
    this._account = value;
  }

  getState = (key: keyof PolkadotState) => this[key];

  getAllState() {
    debug('🔗 Getting all state from PolkadotState');
    return {
      account: this.account,
      locks: this.locks,
    };
  }

  reportAccountState(key: keyof PolkadotState) {
    for (const { id } of WindowsController?.active || []) {
      WindowsController.get(id)?.webContents?.send(
        'renderer:account:state',
        this.chain,
        this.address,
        key,
        this.getState(key)
      );
    }
  }

  async subscribe() {
    debug('📩 Subscribe to account %o ', this.address);
    const apiInstance = APIsController.get(this.chain);

    // TODO: this could be handled better. These are 2 separate concerns and warrant their own
    // handles. E.g. a missing API instance is much more severe than already being subscribed.
    if (this.subscribed || !apiInstance) {
      console.log('no API instance');
      return;
    }

    this.subscribed = true;
    const { api } = apiInstance;

    const unsub = await api.queryMulti<AnyJson>(
      [
        [api.query.system.account, this.address],
        [api.query.balances.locks, this.address],
      ],
      async ([{ data: accountData, nonce }, locks]) => {
        const free = new BigNumber(accountData.free.toString());

        this.account = {
          nonce: nonce.toNumber(),
          balance: {
            free,
            reserved: new BigNumber(accountData.reserved.toString()),
            frozen: new BigNumber(accountData.frozen.toString()),
            freeAfterReserve: BigNumber.max(
              free.minus(apiInstance.consts.existentialDeposit),
              0
            ),
          },
        };

        debug('💵 Account for %o', this.address);
        this.reportAccountState('account');

        this.locks = locks.toHuman().map((l: AnyJson) => ({
          ...l,
          id: l.id.trim(),
          amount: new BigNumber(rmCommas(l.amount)),
        }));

        debug('🔓 Got locks for : %o', this.address);
        this.reportAccountState('locks');
      }
    );

    this.activeSubscriptions.push({ id: 'auto', unsub });
  }
}
