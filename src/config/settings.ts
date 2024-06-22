// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SettingItem } from '@/renderer/screens/Settings/types';
import { faFileExport, faFileImport } from '@fortawesome/pro-solid-svg-icons';

export const SettingsList: SettingItem[] = [
  {
    action: 'settings:execute:dockedWindow',
    category: 'General',
    enabled: true,
    helpKey: 'help:settings:dockedWindow',
    settingType: 'switch',
    title: 'Docked Window',
  },
  {
    action: 'settings:execute:showOnAllWorkspaces',
    category: 'General',
    enabled: false,
    helpKey: 'help:settings:showOnAllWorkspaces',
    settingType: 'switch',
    title: 'Show On All Workspaces',
  },
  {
    action: 'settings:execute:silenceOsNotifications',
    category: 'General',
    enabled: false,
    helpKey: 'help:settings:silenceOsNotifications',
    settingType: 'switch',
    title: 'Silence OS Notifications',
  },
  {
    action: 'settings:execute:enablePolkassembly',
    category: 'General',
    enabled: false,
    helpKey: 'help:settings:enablePolkassembly',
    settingType: 'switch',
    title: 'Enable Polkassembly Data',
  },
  {
    action: 'settings:execute:showDebuggingSubscriptions',
    category: 'Subscriptions',
    enabled: false,
    helpKey: 'help:settings:showDebuggingSubscriptions',
    settingType: 'switch',
    title: 'Show Debugging Subscriptions',
  },
  {
    action: 'settings:execute:enableAutomaticSubscriptions',
    category: 'Subscriptions',
    enabled: false,
    helpKey: 'help:settings:enableAutomaticSubscriptions',
    settingType: 'switch',
    title: 'Enable Automatic Subscriptions',
  },
  {
    action: 'settings:execute:keepOutdatedEvents',
    category: 'Subscriptions',
    enabled: true,
    helpKey: 'help:settings:keepOutdatedEvents',
    settingType: 'switch',
    title: 'Keep Outdated Events',
  },
  {
    action: 'settings:execute:importData',
    category: 'Backup',
    buttonIcon: faFileImport,
    buttonText: 'Import',
    enabled: true,
    helpKey: 'help:settings:importData',
    settingType: 'button',
    title: 'Import Accounts',
  },
  {
    action: 'settings:execute:exportData',
    category: 'Backup',
    buttonIcon: faFileExport,
    buttonText: 'Export',
    enabled: true,
    helpKey: 'help:settings:exportData',
    settingType: 'button',
    title: 'Export Accounts',
  },
];
