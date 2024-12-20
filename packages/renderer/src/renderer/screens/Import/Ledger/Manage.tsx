// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionCaretHeader,
  ControlsWrapper,
  SortControlLabel,
} from '@polkadot-live/ui/components';
import { faArrowDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { Address } from './Address';
import { determineStatusFromCodes } from './Utils';
import {
  ButtonText,
  ButtonPrimaryInvert,
} from '@polkadot-live/ui/kits/buttons';
import { ContentWrapper } from '../../Wrappers';
import { getSortedLocalLedgerAddresses } from '@app/utils/ImportUtils';
import { useAddresses } from '@app/contexts/import/Addresses';
import { useState } from 'react';
import { ItemsColumn } from '@app/screens/Home/Manage/Wrappers';
import { Scrollable, StatsFooter } from '@polkadot-live/ui/styles';
import type { ImportLedgerManageProps } from '../types';

export const Manage = ({
  isImporting,
  statusCodes,
  toggleImport,
  cancelImport,
  setSection,
}: ImportLedgerManageProps) => {
  const { ledgerAddresses: addresses } = useAddresses();

  // Active accordion indices for account subscription tasks categories.
  const [accordionActiveIndices, setAccordionActiveIndices] = useState<
    number[]
  >(
    Array.from(
      {
        length:
          Array.from(getSortedLocalLedgerAddresses(addresses).keys()).length +
          1,
      },
      (_, index) => index
    )
  );

  return (
    <>
      <Scrollable style={{ paddingTop: 0 }}>
        {/* Top Controls */}
        <ControlsWrapper
          $padWrapper={true}
          $padBottom={false}
          style={{ marginBottom: 0 }}
        >
          <ButtonPrimaryInvert
            className="back-btn"
            text="Back"
            iconLeft={faCaretLeft}
            onClick={() => setSection(0)}
          />
          <SortControlLabel label="Ledger Accounts" />

          <ButtonText
            iconLeft={faArrowDown}
            text={
              isImporting
                ? 'Getting Account'
                : 'Get Another Account (Coming Soon)'
            }
            disabled={isImporting || true}
            onClick={() => toggleImport(true)}
          />
        </ControlsWrapper>

        <ContentWrapper style={{ padding: '1rem 2rem 0', marginTop: '1rem' }}>
          {/* Address List */}
          {addresses.length ? (
            <Accordion
              multiple
              defaultIndex={accordionActiveIndices}
              setExternalIndices={setAccordionActiveIndices}
              gap={'0.5rem'}
              panelPadding={'0.5rem 0.25rem'}
            >
              {Array.from(
                getSortedLocalLedgerAddresses(addresses).entries()
              ).map(([chainId, chainAddresses], i) => (
                <div key={`${chainId}_ledger_addresses`}>
                  <AccordionItem>
                    <AccordionCaretHeader
                      title={`${chainId}`}
                      itemIndex={i}
                      wide={true}
                    />
                    <AccordionPanel>
                      <ItemsColumn>
                        {chainAddresses.map((localAddress) => (
                          <Address
                            key={`address_${localAddress.name}`}
                            localAddress={localAddress}
                            setSection={setSection}
                          />
                        ))}
                      </ItemsColumn>
                    </AccordionPanel>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          ) : null}
        </ContentWrapper>
      </Scrollable>

      <StatsFooter $chainId={'Polkadot'}>
        <div>
          <section className="left">
            <div className="footer-stat">
              <h2>Imported Ledger Accounts:</h2>
              <span>
                {!isImporting
                  ? `${addresses.length}`
                  : !statusCodes.length
                    ? 'Connecting...'
                    : determineStatusFromCodes(statusCodes, true).title}
              </span>
            </div>
          </section>
          <section className="right">
            {/* Look at HardwareStatusBar component when looking into ledger processing */}
            {isImporting && (
              <ButtonPrimaryInvert
                text={'Cancel'}
                style={{
                  padding: '0.3rem 1.25rem',
                  color: 'rgb(169, 74, 117)',
                  borderColor: 'rgb(169, 74, 117)',
                }}
                onClick={() => cancelImport()}
              />
            )}
          </section>
        </div>
      </StatsFooter>
    </>
  );
};
