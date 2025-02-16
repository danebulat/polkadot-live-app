// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { useBootstrapping } from '@app/contexts/main/Bootstrapping';
import { useConnections } from '@app/contexts/common/Connections';
import { useHelp } from '@app/contexts/common/Help';
import { useIntervalTasksManager } from '@app/contexts/main/IntervalTasksManager';
import { useTooltip } from '@polkadot-live/ui/contexts';
import { TaskEntryWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faInfo,
  faTriangleExclamation,
  faXmark,
  faAnglesDown,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Switch } from '@polkadot-live/ui/components';
import { IntervalsController } from '@ren/controller/IntervalsController';
import { getShortIntervalLabel } from '@app/utils/renderingUtils';
import type { AnyData } from '@polkadot-live/types/misc';
import type { IntervalRowProps } from './types';

export const IntervalRow = ({ task }: IntervalRowProps) => {
  const { openHelp } = useHelp();
  const { setTooltipTextAndOpen } = useTooltip();
  const { isConnecting } = useBootstrapping();
  const { getOnlineMode, isImporting } = useConnections();

  const {
    handleIntervalToggle,
    handleIntervalNativeCheckbox,
    handleRemoveIntervalSubscription,
    handleChangeIntervalDuration,
    handleIntervalOneShot,
  } = useIntervalTasksManager();

  const [isToggled, setIsToggled] = useState<boolean>(task.status === 'enable');
  const [oneShotProcessing, setOneShotProcessing] = useState(false);
  const [nativeChecked, setNativeChecked] = useState(
    task.enableOsNotifications
  );

  const [removeClicked, setRemoveClicked] = useState(false);
  const removeTimeoutRef = useRef<null | AnyData>(null);

  const [intervalClicked, setIntervalClicked] = useState(false);
  const [intervalSetting, setIntervalSetting] = useState(
    task.intervalSetting.ticksToWait
  );

  const [isDisabled, setIsDisabled] = useState<boolean>(
    isConnecting || !getOnlineMode() || isImporting
  );

  useEffect(() => {
    setIsDisabled(isConnecting || !getOnlineMode() || isImporting);
  }, [isConnecting, getOnlineMode(), isImporting]);

  useEffect(() => {
    const newStatusToBoolean = task.status === 'enable';
    newStatusToBoolean !== isToggled && setIsToggled(newStatusToBoolean);
  }, [task.status]);

  useEffect(() => {
    setIntervalSetting(task.intervalSetting.ticksToWait);
  }, [task.intervalSetting]);

  useEffect(() => {
    setNativeChecked(task.enableOsNotifications);
  }, [task.enableOsNotifications]);

  useEffect(() => {
    if (!getOnlineMode()) {
      setIntervalClicked(false);
    }
  }, [getOnlineMode()]);

  const handleToggle = async () => {
    await handleIntervalToggle(task);
    setIsToggled(!isToggled);
  };

  const handleNativeCheckbox = async () => {
    if (!isDisabled && task.status === 'enable') {
      const flag = !nativeChecked;
      await handleIntervalNativeCheckbox(task, flag);
      setNativeChecked(flag);
    }
  };

  const handleRemove = async () => {
    if (removeTimeoutRef.current !== null) {
      clearTimeout(removeTimeoutRef.current);
      removeTimeoutRef.current = null;
    }
    // Remove subscription.
    await handleRemoveIntervalSubscription(task);
  };

  return (
    <TaskEntryWrapper whileHover={{ scale: 1.01 }}>
      <div className="inner">
        <div>
          <div className="content">
            <h3>
              <div
                className="icon-wrapper"
                onClick={() => openHelp(task.helpKey)}
              >
                <FontAwesomeIcon icon={faInfo} transform={'shrink-1'} />
              </div>
              {task.label}
            </h3>
          </div>
        </div>
        <div>
          {/* Remove Button */}
          <div
            style={{ display: intervalClicked ? 'none' : 'block' }}
            className="remove-wrapper tooltip-trigger-element"
            data-tooltip-text={'Click Twice to Remove'}
            onMouseMove={() => setTooltipTextAndOpen('Click Twice to Remove')}
          >
            {!removeClicked ? (
              <FontAwesomeIcon
                className="enabled"
                icon={faXmark}
                transform={'grow-6'}
                onClick={() => {
                  removeTimeoutRef.current = setTimeout(() => {
                    removeTimeoutRef.current !== null &&
                      setRemoveClicked(false);
                  }, 5000);
                  setRemoveClicked(true);
                }}
              />
            ) : (
              <FontAwesomeIcon
                className="enabled"
                icon={faTriangleExclamation}
                transform={'grow-8'}
                onClick={async () => await handleRemove()}
              />
            )}
          </div>

          {/* One Shot Button */}
          <div
            style={{ display: intervalClicked ? 'none' : 'block' }}
            className={`one-shot-wrapper ${!oneShotProcessing ? 'tooltip-trigger-element' : ''}`}
            data-tooltip-text={'Get Notification'}
            onMouseMove={() => setTooltipTextAndOpen('Get Notification')}
          >
            {/* One-shot is enabled and not processing. */}
            {!isDisabled && !oneShotProcessing && (
              <FontAwesomeIcon
                className="enabled"
                icon={faAnglesDown}
                transform={'grow-4'}
                onClick={async () =>
                  await handleIntervalOneShot(task, setOneShotProcessing)
                }
              />
            )}

            {/* One-shot is enabled and processing */}
            {!isDisabled && oneShotProcessing && (
              <FontAwesomeIcon
                className="processing"
                fade
                icon={faAnglesDown}
                transform={'grow-4'}
              />
            )}

            {/* One-shot disabled */}
            {isDisabled && (
              <FontAwesomeIcon
                className="disabled"
                icon={faAnglesDown}
                transform={'grow-4'}
              />
            )}
          </div>

          {/* Interval Selector */}
          <div className="interval-wrapper ">
            {!intervalClicked || isDisabled ? (
              <div
                className="badge-container tooltip-trigger-element"
                data-tooltip-text={'Set Interval'}
                onMouseMove={() => setTooltipTextAndOpen('Set Interval')}
                onClick={() =>
                  setIntervalClicked((prev) => (isDisabled ? prev : !prev))
                }
              >
                <div className="interval-badge">
                  {getShortIntervalLabel(intervalSetting)}
                </div>
                <FontAwesomeIcon
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '6px',
                    opacity: isDisabled ? '0.3' : '1',
                  }}
                  className="enabled"
                  icon={faClock}
                  transform={'grow-0'}
                />
              </div>
            ) : (
              <div className="select-wrapper">
                <select
                  disabled={isDisabled}
                  className="select-interval"
                  id="select-interval"
                  value={intervalSetting}
                  onChange={(e) =>
                    handleChangeIntervalDuration(e, task, setIntervalSetting)
                  }
                >
                  {IntervalsController.durations.map(
                    ({ label, ticksToWait }, i) => (
                      <option key={`interval_setting_${i}`} value={ticksToWait}>
                        {label}
                      </option>
                    )
                  )}
                </select>
                <div className="close">
                  <FontAwesomeIcon
                    className="enabled"
                    icon={faXmark}
                    transform={'grow-2'}
                    onClick={() => setIntervalClicked(false)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Native OS Notification Checkbox */}
          <div
            className={'native-wrapper tooltip-trigger-element'}
            data-tooltip-text={'OS Notifications'}
            onMouseMove={() => setTooltipTextAndOpen('OS Notifications')}
          >
            <div
              className="native-content"
              onClick={async () => await handleNativeCheckbox()}
            >
              {/* Main icon */}
              <FontAwesomeIcon
                className={
                  !isDisabled && task.status === 'enable'
                    ? nativeChecked
                      ? 'checked'
                      : 'unchecked'
                    : 'disabled'
                }
                icon={faList}
                transform={'grow-4'}
              />

              {/* Check overlay icon when clicked */}
              {nativeChecked && (
                <div className="checked-icon-wrapper">
                  <FontAwesomeIcon
                    className={task.status === 'disable' ? 'disable' : ''}
                    icon={faCircleCheck}
                    transform={'shrink-3'}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Toggle Switch */}
          <Switch
            disabled={isDisabled}
            size="sm"
            type="primary"
            isOn={isToggled}
            handleToggle={async () => await handleToggle()}
          />
        </div>
      </div>
    </TaskEntryWrapper>
  );
};
