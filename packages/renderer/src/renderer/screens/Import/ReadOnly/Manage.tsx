// Copyright 2024 @polkadot-live/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionCaretHeader,
  ControlsWrapper,
  Identicon,
  HardwareAddressWrapper,
  SortControlLabel,
} from '@polkadot-live/ui/components';
import { Address } from './Address';
import { ButtonPrimaryInvert } from '@polkadot-live/ui/kits/buttons';
import { checkAddress } from '@polkadot/util-crypto';
import { ellipsisFn, unescape } from '@w3ux/utils';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { ContentWrapper } from '@app/screens/Wrappers';
import { useState } from 'react';

/// Context imports.
import { useAccountStatuses } from '@app/contexts/import/AccountStatuses';
import { useAddresses } from '@app/contexts/import/Addresses';
import { useImportHandler } from '@app/contexts/import/ImportHandler';

/// Util imports.
import { Scrollable, StatsFooter } from '@polkadot-live/ui/styles';
import { getSortedLocalAddresses, renderToast } from '@app/utils/ImportUtils';

/// Type imports.
import type { FormEvent } from 'react';
import type { ManageReadOnlyProps } from '../types';
import { ItemsColumn } from '../../Home/Manage/Wrappers';

export const Manage = ({ setSection }: ManageReadOnlyProps) => {
  const { readOnlyAddresses: addresses, isAlreadyImported } = useAddresses();
  const { insertAccountStatus } = useAccountStatuses();
  const { handleImportAddress } = useImportHandler();

  /// Component state.
  const [editName, setEditName] = useState<string>('');

  /// Active accordion indices for account subscription tasks categories.
  const [accordionActiveIndices, setAccordionActiveIndices] = useState<
    number[]
  >(
    Array.from(
      {
        length:
          Array.from(getSortedLocalAddresses(addresses).keys()).length + 1,
      },
      (_, index) => index
    )
  );

  /// Verify that the address is compatible with the supported networks.
  const validateAddress = (address: string) => {
    for (const prefix of [0, 2, 42]) {
      const result = checkAddress(address, prefix);

      if (result !== null) {
        const [isValid] = result;

        if (isValid) {
          return true;
        }
      }
    }

    return false;
  };

  /// Cancel button clicked for address field.
  const onCancel = () => {
    setEditName('');
  };

  // Input change handler.
  const onChange = (e: FormEvent<HTMLInputElement>) => {
    let val = e.currentTarget.value || '';
    val = unescape(val);
    setEditName(val);
  };

  /// Handle import button click.
  const onImport = async () => {
    const trimmed = editName.trim();

    if (isAlreadyImported(trimmed)) {
      renderToast('Address is already imported.', 'error', `toast-${trimmed}`);
      return;
    } else if (!validateAddress(trimmed)) {
      renderToast('Invalid Address.', 'error', `toast-${trimmed}`);
      return;
    }

    // The default account name.
    const accountName = ellipsisFn(trimmed);

    // Reset read-only address input state.
    setEditName('');

    // Add account status entry.
    insertAccountStatus(trimmed, 'read-only');

    // Set processing flag to true if online and import via main renderer.
    await handleImportAddress(trimmed, 'read-only', accountName, true);
  };

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
          <SortControlLabel label="Read Only Accounts" />
        </ControlsWrapper>

        {/* Add Read Only Address */}
        <HardwareAddressWrapper
          style={{
            backgroundColor: 'inherit',
            padding: '1.5rem 1.5rem 0rem',
          }}
        >
          <div className="content">
            <div className="inner">
              <div className="identicon">
                <Identicon value={editName} size={28} />
              </div>
              <div>
                <section className="row" style={{ paddingLeft: '1.25rem' }}>
                  <input
                    className="add-input"
                    type="text"
                    placeholder="Input Address"
                    value={editName}
                    onChange={(e) => onChange(e)}
                  />
                  <div className="flex-inner-row">
                    <button
                      style={{ color: 'var(--background-primary)' }}
                      className="btn-mono lg"
                      onPointerDown={async () => await onImport()}
                    >
                      Add
                    </button>
                    <button
                      className="btn-mono-invert lg"
                      onPointerDown={() => onCancel()}
                    >
                      Clear
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </HardwareAddressWrapper>

        {/* Address List */}
        <ContentWrapper
          style={{ padding: '1.25rem 2rem 0', marginTop: '1rem' }}
        >
          <Accordion
            multiple
            defaultIndex={accordionActiveIndices}
            setExternalIndices={setAccordionActiveIndices}
            gap={'0.5rem'}
            panelPadding={'0.5rem 0.25rem'}
          >
            {Array.from(getSortedLocalAddresses(addresses).entries()).map(
              ([chainId, chainAddresses], i) => (
                <div key={`${chainId}_read_only_addresses`}>
                  <AccordionItem>
                    <AccordionCaretHeader
                      title={`${chainId}`}
                      itemIndex={i}
                      wide={true}
                    />
                    <AccordionPanel>
                      <ItemsColumn>
                        {addresses.length ? (
                          <>
                            {chainAddresses.map((localAddress) => (
                              <Address
                                key={`address_${localAddress.name}`}
                                localAddress={localAddress}
                                setSection={setSection}
                              />
                            ))}
                          </>
                        ) : (
                          <p>No read only addresses imported.</p>
                        )}
                      </ItemsColumn>
                    </AccordionPanel>
                  </AccordionItem>
                </div>
              )
            )}
          </Accordion>
        </ContentWrapper>
      </Scrollable>

      <StatsFooter $chainId={'Polkadot'}>
        <div>
          <section className="left">
            <div className="footer-stat">
              <h2>Imported Read Only Accounts:</h2>
              <span>{addresses.length}</span>
            </div>
          </section>
        </div>
      </StatsFooter>
    </>
  );
};
