// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Export electron-builder config.
 */
export default {
  appId: 'com.jkrb.polkadot-live',
  compression: 'normal',
  productName: 'Polkadot Live',
  copyright: `Copyright (C) ${new Date().getFullYear()} Polkadot Live Authors & Contributors`,
  asar: true,
  npmRebuild: true,
  directories: {
    output: 'releases',
    buildResources: 'dist/renderer',
  },
  files: ['dist/**/*', 'node_modules/**/*', 'package.json'],
  //afterSign: 'scripts/notarize.mjs',
  publish: {
    provider: 'github',
    owner: 'danebulat',
    repo: 'polkadot-live-app',
    // Options: "draft", "prerelease", or "release"
    // TODO: Control with env variable EP_DRAFT, EP_PRE_RELEASE.
    releaseType: 'release',
  },
  mac: {
    icon: 'public/assets/icons/icon.icns',
    target: [
      {
        target: 'dmg',
        arch: ['arm64'],
      },
    ],
    hardenedRuntime: true,
    notarize: process.env.MODE === 'production',
    entitlements: 'entitlements/extendedInfo.plist',
    entitlementsInherit: 'entitlements/extendedInfo.plist',
    gatekeeperAssess: false,
  },
  dmg: {
    sign: false,
  },
  //linux: {
  //  icon: 'assets/LinuxIcons',
  //  category: 'Utility',
  //  target: 'AppImage',
  //},
};
