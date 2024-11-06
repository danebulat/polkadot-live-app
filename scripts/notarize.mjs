// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import 'dotenv/config';
import { notarize } from '@electron/notarize';

export default async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  // Only sign on Mac systems.
  if (electronPlatformName !== 'darwin') {
    return;
  }

  // Don't sign and notarize if in development mode.
  if (process.env.MODE !== 'production') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appId = 'com.jkrb.polkadot-live';

  return await notarize({
    appBundleId: appId,
    appPath: `${appOutDir}/${appName}.app`,
    // Login name of your Apple Developer account.
    appleId: process.env.APPLE_ID,
    // App-specific password.
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    // Team ID for your developer team.
    teamId: process.env.APPLE_TEAM_ID,
    tool: 'notarytool',
  });
}
