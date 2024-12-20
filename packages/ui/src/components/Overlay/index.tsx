// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOverlay } from '../../contexts';
import { ContentWrapper, HeightWrapper, OverlayWrapper } from './Wrappers';

export const Overlay = () => {
  const {
    closeOverlay,
    size,
    status,
    transparent,
    Overlay: OverlayInner,
  } = useOverlay();

  if (status === 0) {
    return null;
  }

  return (
    <OverlayWrapper>
      <div>
        <HeightWrapper size={size}>
          <ContentWrapper
            className={transparent === true ? 'transparent' : 'bg'}
          >
            {OverlayInner}
          </ContentWrapper>
        </HeightWrapper>
        <button type="button" className="close" onClick={() => closeOverlay()}>
          &nbsp;
        </button>
      </div>
    </OverlayWrapper>
  );
};
