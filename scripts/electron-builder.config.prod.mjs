// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Export electron-builder config.
 */
export default {
  /** Metadata */
  appId: 'com.jkrb.polkadot-live',
  asar: true,
  compression: 'normal',
  copyright: `Copyright (C) ${new Date().getFullYear()} Polkadot Live Authors & Contributors`,
  productName: 'Polkadot Live',
  /** Building */
  directories: {
    output: 'releases',
    buildResources: 'dist/renderer',
  },
  files: ['dist/**/*', 'node_modules/**/*', 'package.json'],
  npmRebuild: true,
  /** Publishing */
  publish: {
    provider: 'github',
    owner: 'danebulat',
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
    icon: 'public/assets/icons/icon.icns',
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
    sign: false,
    allowToChangeInstallationDirectory: false,
  },
  win: {
    icon: 'public/assets/icons/icon.ico',
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
  },
  //linux: {
  //  icon: 'assets/LinuxIcons',
  //  category: 'Utility',
  //  target: 'AppImage',
  //},
};
