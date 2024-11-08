// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Providers } from './Providers';
import { createRoot } from 'react-dom/client';

// Package styles.
import '@theme-toggles/react/css/Classic.css';

// Network themes.
import '@app/theme/accents/polkadot-relay.css';

// App styles.
import './theme/theme.scss';
import './theme/index.scss';
import './theme/utils.scss';

// Library styles.
import './kits/Buttons/index.scss';
import './kits/Overlay/index.scss';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);
root.render(<Providers />);
