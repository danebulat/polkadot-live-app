// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise } from '@polkadot/api';
import { Address } from '@polkadot/types/interfaces/runtime';
import { ChainID } from '@/types/chains';
import { MainDebug } from '@/debugging';
import { LiveReporter } from '@/model/LiveReporter';
import { APIsController } from './APIsController';
import { AccountsController } from './AccountsController';
import { BlockStream } from '../blockstream/BlockStream';
import { Discover } from './Discover';
import { WindowsController } from './WindowsController';
import {
  ApiSubscription,
  ConcreteAccount,
  RawAccount,
} from '@/types/blockstream';

const debug = MainDebug.extend('Subscriptions');

// Basic types for services.
type Service = { chain: ChainID; instance: BlockStream };

/**
 * A static class to manage BlockStream subscriptions.
 * @class
 * @property {Service[]} services - list of active BlockStream services.
 */
export class SubscriptionsController {
  static services: Service[] = [];

  /**
   * @name initialize
   * @summary Initializes subscription services.
   */
  static initialize = async () => {
    debug('🕕 Initializing subscriptions');

    // Instantiate `BlockStream` services from initial chains and account configs.
    APIsController.instances.forEach(async ({ chain, api }) => {
      debug('🔴 Using instance %o', chain);

      // Get accounts for `chain` and instantiate service.
      const accounts = AccountsController.accounts[chain];
      debug('💳 API instance accounts pre discover: %o', accounts.length);

      const rawAccounts: RawAccount[] = [];
      for (const account of accounts) {
        // Re-discover config from on-chain state.
        const { chainState, config } = await Discover.start(chain, account);

        // Update config for account.
        account.config = config;
        account.chainState = chainState;
        AccountsController.set(chain, account);

        debug(
          '🗓️ Bootstrap events for an account with chainState: %o',
          chainState
        );

        // Convert `Account` into `RawAccount`.
        rawAccounts.push({
          address: account.address,
          nickname: account.name,
          config,
        });
      }

      debug('📑 Raw accounts: %o', rawAccounts);

      // Start BlockStream services with raw accounts.
      if (rawAccounts) {
        this.startService(chain, api, rawAccounts);
      }

      // Report accounts to windows with updated configs.
      for (const { id } of WindowsController.active) {
        WindowsController.get(id)?.webContents?.send(
          'renderer:broadcast:accounts',
          AccountsController.getAll()
        );
      }
    });
  };

  /**
   * @name addAccountToService
   * @summary Adds an account to an existing service, or instantiates a new one if there is no
   * service for the corresponding chain.
   * @param {ChainID} chain - the chain the account belongs to.
   * @param {string} address - the account address.
   */
  static addAccountToService = async (chain: ChainID, address: string) => {
    const service = this.services.find((s) => s.chain === chain);

    const account = AccountsController.get(chain, address);
    if (!account) {
      return false;
    }

    if (service?.instance) {
      const { instance } = service;
      const concreteAddress = instance.api.createType(
        'Address',
        address
      ) as Address;

      // Remove account if it is already in instance.
      instance.accounts = instance.accounts.filter(
        (a: ConcreteAccount) => !a.address.eq(concreteAddress)
      );

      // Add the account to the instance.
      instance.accounts.push({
        address: concreteAddress,
        nickname: account.name,
        config: account.config,
      });
    } else {
      // get api instance and start service.
      const apiInstance = APIsController.instances.find(
        (i) => i.chain === chain
      );

      if (apiInstance) {
        const rawAccount = {
          address,
          nickname: account.name,
          config: account.config,
        };

        this.startService(apiInstance.chain, apiInstance.api, [rawAccount]);
      } else {
        // Chain instance does not exist (should not happen).
      }
    }
  };

  /**
   * @name removeAccountFromService
   * @summary Removes an account from a subscription service. Shuts down service if there are no
   * more accounts in it.
   * @param {ChainID} chain - the chain the account belongs to.
   * @param {string} address - the account address.
   */
  static removeAccountFromService = async (chain: ChainID, address: string) => {
    // Remove account from running instance.
    const service = this.services.find((s) => s.chain === chain);
    if (service?.instance) {
      const { instance } = service;

      instance.accounts = instance.accounts.filter(
        (a) => a.address.toString() !== address
      );

      if (!instance.accounts.length) {
        await instance.unsub();
        this.services = this.services.filter((s) => s.chain !== chain);
      }
    }
  };

  /**
   * @name startService
   * @summary Starts a service.
   * @param {ChainID} chain - the chain the account belongs to.
   * @param {string} api - the api instance to use in a service.
   * @param {RawAccount[]} accounts - the accounts listening to this subscription.
   */
  private static startService = async (
    chain: ChainID,
    api: ApiPromise,
    accounts: RawAccount[]
  ) => {
    if (accounts.length) {
      const instance = new BlockStream(api, chain, [new LiveReporter()], {
        accounts,
        apiSubscription: ApiSubscription.Head,
      });
      instance.start();
      this.services.push({ chain, instance });
    }
  };
}