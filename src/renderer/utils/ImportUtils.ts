// Copyright 2024 @rossbulat/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Config as ConfigImport } from '@/config/processes/import';
import { ellipsisFn } from '@w3ux/utils';
import type {
  AccountSource,
  LedgerLocalAddress,
  LocalAddress,
} from '@/types/accounts';
import { getAddressChainId } from '../Utils';

/**
 * @name renameLocalAccount
 * @summary Sets an account's name in local storage.
 */
export const renameLocalAccount = (
  address: string,
  newName: string,
  source: AccountSource
) => {
  // Get serialized addresses from local storage.
  const storageKey = ConfigImport.getStorageKey(source);
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    return;
  }

  // Update local storage account data.
  if (source === 'ledger') {
    const parsed: LedgerLocalAddress[] = JSON.parse(stored);
    const updated = parsed.map((a: LedgerLocalAddress) =>
      a.address !== address ? a : { ...a, name: newName }
    );
    localStorage.setItem(storageKey, JSON.stringify(updated));
  } else {
    const parsed: LocalAddress[] = JSON.parse(stored);
    const updated = parsed.map((a: LocalAddress) =>
      a.address !== address ? a : { ...a, name: newName }
    );
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }
};

/**
 * @name postRenameAccount
 * @summary Post a message to the main renderer to process an account rename.
 */
export const postRenameAccount = (address: string, newName: string) => {
  ConfigImport.portImport.postMessage({
    task: 'renderer:account:rename',
    data: {
      address,
      chainId: getAddressChainId(address),
      newName,
    },
  });
};

/**
 * @name validateAccountName
 * @summary Validate an account name received from user input.
 */

export const validateAccountName = (accountName: string): boolean => {
  // Regulare expression for allowed characters in the account name (including spaces).
  const regex = /^[a-zA-Z0-9._-\s]+$/;

  // Check if the length of the nickname is between 3 and 30 characters.
  if (accountName.length < 3 || accountName.length > 20) {
    return false;
  }

  // Check if the account name contains only allowed characters.
  if (!regex.test(accountName)) {
    return false;
  }

  return true;
};

/**
 * @name getLocalAccountName
 * @summary Returns an account's name by fetching it from local storage or returning the truncated address.
 * @deprecated This function is not currently used.
 */
export const getLocalAccountName = (
  address: string,
  source: AccountSource
): string => {
  const defaultName = ellipsisFn(address);
  const stored = localStorage.getItem(ConfigImport.getStorageKey(source));

  // Return truncated address if no storage found.
  if (!stored) {
    return defaultName;
  }

  // Parse fetched addresses and see if this address has a custom name.
  if (source === 'ledger') {
    const parsed: LedgerLocalAddress[] = JSON.parse(stored);
    const fetched = parsed.find(
      (a: LedgerLocalAddress) => a.address === address
    );
    return fetched ? fetched.name : defaultName;
  } else if (source === 'vault') {
    const parsed: LocalAddress[] = JSON.parse(stored);
    const fetched = parsed.find((a: LocalAddress) => a.address === address);
    return fetched ? fetched.name : defaultName;
  } else {
    return 'System Account';
  }
};

/**
 * @name getSortedLocalAddresses
 * @summary Function to get addresses categorized by chain ID and sorted by name.
 */
export const getSortedLocalAddresses = (addresses: LocalAddress[]) => {
  let sorted: LocalAddress[] = [];

  for (const chainId of ['Polkadot', 'Kusama', 'Westend']) {
    sorted = sorted.concat(
      addresses
        .filter((a) => getAddressChainId(a.address) === chainId)
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }

  return sorted;
};

/**
 * @name getSortedLocalLedgerAddresses
 * @summary Same as `getSortedLocalAddresses` but for the local Ledger address type.
 */
export const getSortedLocalLedgerAddresses = (
  addresses: LedgerLocalAddress[]
) => {
  let sorted: LedgerLocalAddress[] = [];

  for (const chainId of ['Polkadot', 'Kusama', 'Westend']) {
    sorted = sorted.concat(
      addresses
        .filter((a) => getAddressChainId(a.address) === chainId)
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }

  return sorted;
};
