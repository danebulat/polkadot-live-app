// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSideNav } from '@polkadot-live/ui/contexts';
import { useEvents } from '@app/contexts/main/Events';
import { useAddresses } from '@app/contexts/main/Addresses';
import { useIntervalSubscriptions } from '@app/contexts/main/IntervalSubscriptions';
import { useHelp } from '@app/contexts/common/Help';
import {
  MainHeading,
  StatsSection,
  StatsGrid,
  StatItem,
  ShiftingMeter,
} from '@polkadot-live/ui/components';

export const Summary: React.FC = () => {
  const { setSelectedId } = useSideNav();
  const { openHelp } = useHelp();
  const { getTotalIntervalSubscriptionCount } = useIntervalSubscriptions();

  const { getEventsCount, getReadableEventCategory, getAllEventCategoryKeys } =
    useEvents();

  const {
    getAddressesCountByChain,
    getAddressesCountBySource,
    getReadableAccountSource,
    getAllAccountSources,
    getAllAccounts,
    getSubscriptionCountForAccount,
    getTotalSubscriptionCount,
  } = useAddresses();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        padding: '2rem 1rem',
      }}
    >
      {/* Title */}
      <MainHeading>Summary</MainHeading>

      {/* Accounts */}
      <StatsSection
        title="Active Accounts"
        btnText="Accounts"
        btnClickHandler={() => {
          window.myAPI.openWindow('import');
          window.myAPI.umamiEvent('window-open-accounts', null);
        }}
      >
        <StatsGrid>
          <StatItem className="total-item">
            <div>
              <h3>Total</h3>
              <div
                className="help"
                onClick={() => openHelp('help:summary:activeAccounts')}
              >
                <FontAwesomeIcon icon={faInfo} />
              </div>
            </div>
            <span>
              <ShiftingMeter
                color={'var(--text-highlight)'}
                value={getAddressesCountByChain()}
                size={1.26}
              />
            </span>
          </StatItem>
          {getAllAccountSources().map((source) => {
            if (getAddressesCountBySource(source) > 0) {
              return (
                <StatItem key={`total_${source}_addresses`}>
                  <h3>{getReadableAccountSource(source)}</h3>
                  <span>
                    <ShiftingMeter
                      value={getAddressesCountBySource(source)}
                      size={1.2}
                    />
                  </span>
                </StatItem>
              );
            }
          })}
        </StatsGrid>
      </StatsSection>

      {/* Events */}
      <StatsSection
        title="Events"
        btnText="Events"
        btnClickHandler={() => {
          setSelectedId(1);
        }}
      >
        <StatsGrid>
          <StatItem className="total-item">
            <div>
              <h3>Total</h3>
              <div
                className="help"
                onClick={() => openHelp('help:summary:events')}
              >
                <FontAwesomeIcon icon={faInfo} />
              </div>
            </div>
            <span>
              <ShiftingMeter
                color={'var(--text-highlight)'}
                value={getEventsCount()}
                size={1.26}
              />
            </span>
          </StatItem>
          {getAllEventCategoryKeys().map((category) => {
            if (getEventsCount(category) > 0) {
              return (
                <StatItem key={`total_${category}_events`}>
                  <h3>{getReadableEventCategory(category)}</h3>
                  <span>
                    <ShiftingMeter
                      value={getEventsCount(category)}
                      size={1.2}
                    />
                  </span>
                </StatItem>
              );
            }
          })}
        </StatsGrid>
      </StatsSection>

      {/* Subscriptions */}
      <StatsSection
        title="Subscriptions"
        btnText="Subscribe"
        btnClickHandler={() => {
          setSelectedId(2);
        }}
      >
        <StatsGrid>
          <StatItem className="total-item">
            <div>
              <h3>Total</h3>
              <div
                className="help"
                onClick={() => openHelp('help:summary:subscriptions')}
              >
                <FontAwesomeIcon icon={faInfo} />
              </div>
            </div>
            <span>
              <ShiftingMeter
                color={'var(--text-highlight)'}
                value={
                  getTotalSubscriptionCount() +
                  getTotalIntervalSubscriptionCount()
                }
                size={1.26}
              />
            </span>
          </StatItem>
          {getAllAccounts().map((flattened) => (
            <StatItem key={`${flattened.address}_subscriptions_count`}>
              <h3>{flattened.name}</h3>
              <span>
                <ShiftingMeter
                  value={getSubscriptionCountForAccount(flattened)}
                  size={1.2}
                />
              </span>
            </StatItem>
          ))}
          {getTotalIntervalSubscriptionCount() > 0 && (
            <StatItem>
              <h3>Referenda</h3>
              <span>
                <ShiftingMeter
                  value={getTotalIntervalSubscriptionCount()}
                  size={1.2}
                />
              </span>
            </StatItem>
          )}
        </StatsGrid>
      </StatsSection>
    </div>
  );
};
