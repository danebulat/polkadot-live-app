// Copyright 2024 @rossbulat/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ButtonCommonProps, ButtonIconProps } from '../types';
import { onMouseHandlers } from '../Utils';
import { appendOr, appendOrEmpty } from '@polkadot-cloud/utils';
import type { ComponentBaseWithClassName } from '@/renderer/types';

export type ButtonSecondaryProps = ComponentBaseWithClassName &
  ButtonIconProps &
  ButtonCommonProps & {
    // large button, small otherwise.
    lg?: boolean;
    // button text.
    text: string;
  };

/**
 * @name ButtonSecondary
 * @description Secondary button style used within the main interface of dashboards.
 */
export const ButtonSecondary = ({
  disabled,
  grow,
  iconLeft,
  iconRight,
  iconTransform,
  lg,
  marginLeft,
  marginRight,
  marginX,
  className,
  style,
  text,
  onClick,
  onMouseOver,
  onMouseMove,
  onMouseOut,
}: ButtonSecondaryProps) => (
  <button
    className={`btn-secondary${appendOr(lg, 'lg', 'sm')}${appendOrEmpty(
      grow,
      'grow'
    )}${appendOrEmpty(marginRight, 'm-right')}${appendOrEmpty(
      marginLeft,
      'm-left'
    )}${appendOrEmpty(marginX, 'm-x')}${className ? ` ${className}` : ''}`}
    style={style}
    type="button"
    disabled={disabled}
    {...onMouseHandlers({ onClick, onMouseOver, onMouseMove, onMouseOut })}
  >
    {iconLeft ? (
      <FontAwesomeIcon
        icon={iconLeft}
        className={text ? 'icon-left' : undefined}
        transform={iconTransform ? iconTransform : undefined}
      />
    ) : null}
    {text ? text : null}
    {iconRight ? (
      <FontAwesomeIcon
        icon={iconRight}
        className={text ? 'icon-right' : undefined}
        transform={iconTransform ? iconTransform : undefined}
      />
    ) : null}
  </button>
);
