// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AnyElement } from '@polkadot-live/types';

/*
 * A hook that wraps multiple context providers to a component and makes each parent context accessible.
 */
export const withProviders =
  (...providers: AnyElement) =>
  (WrappedComponent: AnyElement) =>
  (props: AnyElement) =>
    providers.reduceRight(
      (acc: AnyElement, prov: AnyElement) => {
        let Provider = prov;
        if (Array.isArray(prov)) {
          Provider = prov[0];
          return <Provider {...prov[1]}>{acc}</Provider>;
        }

        return <Provider>{acc}</Provider>;
      },
      <WrappedComponent {...props} />
    );
