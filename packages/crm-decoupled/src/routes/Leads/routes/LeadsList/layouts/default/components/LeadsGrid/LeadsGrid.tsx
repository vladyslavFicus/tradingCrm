import React, { useCallback } from 'react';
import { startCase } from 'lodash';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { QueryResult } from '@apollo/client';
import { TableSelection } from 'types';
import { Lead, Sort__Input as Sort } from '__generated__/types';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { AdjustableTable, Column } from 'components/Table';
import GridEmptyValue from 'components/GridEmptyValue';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import Uuid from 'components/Uuid';
import MiniProfilePopover from 'components/MiniProfilePopover';
import { UncontrolledTooltip } from 'components';
import { Hierarchy } from 'components/GridAcquisitionStatus/hooks/useGridAcquisitionStatus';
import { MAX_SELECTED_LEADS, leadStatuses } from 'routes/Leads/routes/LeadsList/constants/leadsGrid';
import useLeadsGrid from 'routes/Leads/routes/LeadsList/hooks/useLeadsGrid';
import { LeadsListQuery } from 'routes/Leads/routes/LeadsList/graphql/__generated__/LeadsListQuery';
import './LeadsGrid.scss';

type Props = {
  leadsQuery: QueryResult<LeadsListQuery>,
  sorts: Array<Sort>,
  onSelect: (selectedLeads: TableSelection) => void,
};

const LeadsGrid = (props: Props) => {
  const { leadsQuery, sorts, onSelect } = props;

  const {
    content,
    totalElements,
    last,
    isLoading,
    columnsOrder,
    handlePageChanged,
    handleSort,
    handleRowClick,
    handleSelectError,
  } = useLeadsGrid({ leadsQuery, sorts });

  // ===== Renders ===== //
  const renderLead = useCallback(({ uuid, name, surname }: Lead) => (
    <>
      <div
        className="LeadsGrid__general LeadsGrid__name"
        onClick={() => handleRowClick(uuid)}
      >
        {name} {surname}
      </div>

      <div className="LeadsGrid__additional">
        <MiniProfilePopover uuid={uuid} type="lead">
          <Uuid uuid={uuid} uuidPrefix="LE" />
        </MiniProfilePopover>
      </div>
    </>
  ), []);

  const renderAffiliate = useCallback(({ affiliate, source }: Lead) => (
    <Choose>
      <When condition={!!affiliate || !!source}>
        <div className="LeadsGrid__general">
          {affiliate}
        </div>

        <div className="LeadsGrid__additional">
          {source}
        </div>
      </When>

      <Otherwise>
        <GridEmptyValue />
      </Otherwise>
    </Choose>
  ), []);

  const renderCountry = useCallback(({ country, language }: Lead) => (
    <Choose>
      <When condition={!!country}>
        <CountryLabelWithFlag
          code={country}
          height="14"
          languageCode={language || ''}
        />
      </When>

      <Otherwise>
        &mdash;
      </Otherwise>
    </Choose>
  ), []);

  const renderSales = useCallback(({ acquisition }: Lead) => (
    <GridAcquisitionStatus
      active
      acquisition="SALES"
      status={acquisition?.salesStatus as string}
      fullName={acquisition?.salesOperator?.fullName as string}
      hierarchy={acquisition?.salesOperator?.hierarchy as Hierarchy}
    />
  ), []);

  const renderRegistrationDate = useCallback(({ registrationDate }: Lead) => (
    <>
      <div className="LeadsGrid__general">
        {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
      </div>

      <div className="LeadsGrid__additional">
        {moment.utc(registrationDate).local().format('HH:mm:ss')}
      </div>
    </>
  ), []);

  const renderLastNote = useCallback(({ uuid, lastNote }: Lead) => {
    const { content: leadContent, changedAt, operator } = lastNote || {};

    return (
      <Choose>
        <When condition={!!leadContent && !!changedAt}>
          <div className="LeadsGrid__last-note">
            <div className="LeadsGrid__general">
              {moment.utc(changedAt).local().format('DD.MM.YYYY')}
            </div>

            <div className="LeadsGrid__additional">
              {moment.utc(changedAt).local().format('HH:mm:ss')}
            </div>

            <If condition={!!operator}>
              <span className="LeadsGrid__last-note-author">
                {operator?.fullName}
              </span>
            </If>

            <div className="LeadsGrid__last-note-content" id={`note-${uuid}`}>
              {leadContent}
            </div>

            <UncontrolledTooltip
              target={`note-${uuid}`}
              placement="bottom-start"
              delay={{ show: 350, hide: 250 }}
              fade={false}
            >
              {leadContent}
            </UncontrolledTooltip>
          </div>
        </When>

        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderLastCall = useCallback(({ lastCall }: Lead) => {
    const { date, callSystem } = lastCall || {};

    return (
      <Choose>
        <When condition={!!lastCall}>
          <div className="LeadsGrid__general">
            {moment.utc(date || '').local().format('DD.MM.YYYY')}
          </div>

          <div className="LeadsGrid__additional">
            {moment.utc(date || '').local().format('HH:mm:ss')}
          </div>

          <div className="LeadsGrid__additional">
            {startCase(callSystem?.toLowerCase())}
          </div>
        </When>

        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderStatus = useCallback((
    { status, statusChangedDate, convertedByOperatorUuid, convertedToClientUuid }: Lead,
  ) => (
    <>
      <div
        className={classNames('LeadsGrid__status-title', {
          'LeadsGrid__status-title--new': status === 'NEW',
          'LeadsGrid__status-title--converted': status === 'CONVERTED',
        })}
      >
        {I18n.t(leadStatuses[status as string])}
      </div>

      <If condition={!!statusChangedDate}>
        <div className="LeadsGrid__status-converted">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangedDate || '').local().format('DD.MM.YYYY HH:mm:ss') })}
        </div>
      </If>

      <If condition={!!convertedToClientUuid && !!convertedByOperatorUuid}>
        <div className="LeadsGrid__status-operator">
          {I18n.t('COMMON.BY')} <Uuid uuid={convertedByOperatorUuid || ''} />
        </div>
      </If>
    </>
  ), []);

  return (
    <div className="LeadsGrid">
      <AdjustableTable
        columnsOrder={columnsOrder}
        withMultiSelect
        stickyFromTop={157}
        items={content as Array<Lead>}
        totalCount={totalElements}
        loading={isLoading}
        hasMore={!last}
        onMore={handlePageChanged}
        sorts={sorts}
        onSort={handleSort}
        maxSelectCount={MAX_SELECTED_LEADS}
        onSelect={onSelect}
        onSelectError={handleSelectError}
      >
        <Column
          name="lead"
          header={I18n.t('LEADS.GRID_HEADER.LEAD')}
          render={renderLead}
        />

        <Column
          name="country"
          sortBy="country"
          header={I18n.t('LEADS.GRID_HEADER.COUNTRY')}
          render={renderCountry}
        />

        <Column
          name="sales"
          header={I18n.t('LEADS.GRID_HEADER.SALES')}
          render={renderSales}
        />

        <Column
          name="affiliate"
          header={I18n.t('LEADS.GRID_HEADER.AFFILIATE')}
          render={renderAffiliate}
        />

        <Column
          name="registrationDate"
          sortBy="registrationDate"
          header={I18n.t('LEADS.GRID_HEADER.REGISTRATION')}
          render={renderRegistrationDate}
        />

        <Column
          name="lastNote"
          header={I18n.t('LEADS.GRID_HEADER.LAST_NOTE')}
          sortBy="lastNote.changedAt"
          render={renderLastNote}
        />

        <Column
          name="lastCall"
          header={I18n.t('LEADS.GRID_HEADER.LAST_CALL')}
          sortBy="lastCall.date"
          render={renderLastCall}
        />

        <Column
          name="status"
          header={I18n.t('LEADS.GRID_HEADER.STATUS')}
          render={renderStatus}
        />
      </AdjustableTable>
    </div>
  );
};

export default React.memo(LeadsGrid);
