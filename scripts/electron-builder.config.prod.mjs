// Copyright 2025 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { findFilesThatShouldBeExcluded } from './build-helpers.mjs';

/**
 * Export electron-builder config.
 */
export default {
  /** Metadata */
  appId: 'com.jkrb.polkadot-live',
  asar: true,
  compression: 'normal',
  copyright: `Copyright (C) ${new Date().getFullYear()} Polkadot Live Authors & Contributors`,
  productName: 'PolkadotLive',
  extraMetadata: {
    author: 'JKRB Investments Limited',
  },

  /** Building */
  directories: {
    output: 'releases',
    buildResources: 'packages/renderer/dist',
  },
  files: [
    'packages/main/dist',
    'packages/preload/dist',
    'packages/renderer/dist',
    'packages/core/dist',
    'packages/ui/dist',
    'package.json',
    ...(await findFilesThatShouldBeExcluded()),
  ],
  npmRebuild: true,

  /** Publishing */
  publish: {
    provider: 'github',
    owner: process.env.GH_OWNER,
    repo: 'polkadot-live-app',
    releaseType: 'release',
  },

  /** Mac */
  dmg: {
    sign: false,
  },
  mac: {
    entitlements: 'entitlements/entitlements.mac.inherit.plist',
    forceCodeSigning: true,
    gatekeeperAssess: false,
    hardenedRuntime: true,
    icon: 'assets/icon.icns',
    notarize: true,
    target: [
      {
        target: 'dmg',
        arch: ['arm64'],
      },
    ],
  },

  /** Windows */
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: false,
  },
  win: {
    azureSignOptions: {
      publisherName: process.env.AZURE_COMMON_NAME,
      endpoint: process.env.AZURE_ENDPOINT,
      certificateProfileName: process.env.AZURE_CERTIFICATE_PROFILE_NAME,
      codeSigningAccountName: process.env.AZURE_CODE_SIGNING_ACCOUNT_NAME,
    },
    executableName: 'PolkadotLive',
    icon: 'assets/icon.ico',
    signAndEditExecutable: true,
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
  },

  /** Linux */
  linux: {
    icon: 'assets/1024x1024.png',
    category: 'Network',
    target: 'AppImage',
  },
};
