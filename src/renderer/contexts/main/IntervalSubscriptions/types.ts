// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IntervalSubscription } from '@/types/subscriptions';
import type { ChainID } from '@/types/chains';

export interface IntervalSubscriptionsContextInterface {
  subscriptions: Map<ChainID, IntervalSubscription[]>;
  setSubscriptions: (
    subscriptions: Map<ChainID, IntervalSubscription[]>
  ) => void;
  addIntervalSubscription: (task: IntervalSubscription) => void;
  removeIntervalSubscription: (task: IntervalSubscription) => void;
  updateIntervalSubscription: (task: IntervalSubscription) => void;
  getIntervalSubscriptionsForChain: (
    chainId: ChainID
  ) => IntervalSubscription[];
  getSortedKeys: () => ChainID[];
  getTotalIntervalSubscriptionCount: () => number;
}
