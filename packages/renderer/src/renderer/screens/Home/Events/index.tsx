// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEvents } from '@app/contexts/main/Events';
import { useState, useMemo } from 'react';
import { Category } from './Category';
import { NoEvents } from './NoEvents';
import { EventGroup, Wrapper } from './Wrappers';
import { faSort, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { EventItem } from './EventItem';
import { getEventChainId } from '@ren/utils/EventUtils';
import {
  Accordion,
  MainHeading,
  ControlsWrapper,
  SortControlButton,
} from '@polkadot-live/ui/components';

export const Events = () => {
  /// State for sorting controls.
  const [newestFirst, setNewestFirst] = useState(true);
  const [groupingOn, setGroupingOn] = useState(true);

  /// Get events state.
  const { events, sortAllGroupedEvents, sortAllEvents } = useEvents();

  const sortedGroupedEvents = useMemo(
    () => sortAllGroupedEvents(newestFirst),
    [events, newestFirst]
  );

  const sortedEvents = useMemo(
    () => sortAllEvents(newestFirst),
    [events, newestFirst]
  );

  /// Active accordion indices for event categories.
  const [accordionActiveIndices, setAccordionActiveIndices] = useState<
    number[]
  >(
    Array.from(
      { length: Array.from(sortedGroupedEvents.keys()).length },
      (_, index) => index
    )
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '0.75rem',
        padding: '2rem 1rem 1rem',
      }}
    >
      <MainHeading>Events</MainHeading>

      {/* Sorting controls */}
      <ControlsWrapper $padBottom={!groupingOn}>
        <SortControlButton
          isActive={newestFirst}
          isDisabled={false}
          faIcon={faSort}
          onClick={() => setNewestFirst(!newestFirst)}
          onLabel="Newest First"
          offLabel="Oldest First"
        />
        <SortControlButton
          isActive={groupingOn}
          isDisabled={false}
          faIcon={faLayerGroup}
          onClick={() => setGroupingOn(!groupingOn)}
          onLabel="Grouping"
          offLabel="Grouping"
          fixedWidth={false}
        />
      </ControlsWrapper>

      {/* List Events */}
      <Wrapper>
        {events.size === 0 && <NoEvents />}

        <div
          style={
            groupingOn
              ? { display: 'block', width: '100%' }
              : { display: 'none', width: '100%' }
          }
        >
          <Accordion
            multiple
            defaultIndex={accordionActiveIndices}
            setExternalIndices={setAccordionActiveIndices}
            panelPadding={'0.5rem 0.25rem'}
            gap={'0.5rem'}
          >
            {Array.from(sortedGroupedEvents.entries()).map(
              ([category, categoryEvents], i) => (
                <Category
                  key={`${category}_events`}
                  accordionIndex={i}
                  category={category}
                  events={categoryEvents}
                />
              )
            )}
          </Accordion>
        </div>
        <div
          style={
            groupingOn
              ? { display: 'none', width: '100%' }
              : { display: 'block', width: '100%' }
          }
        >
          <EventGroup>
            <div className="items-wrapper">
              {sortedEvents.map((event) => (
                <EventItem
                  key={`${getEventChainId(event)}_${event.uid}`}
                  event={event}
                />
              ))}
            </div>
          </EventGroup>
        </div>
      </Wrapper>
    </div>
  );
};
