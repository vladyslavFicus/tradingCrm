import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { startCase } from 'lodash';
import compose from 'compose-function';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { NetworkStatus, QueryResult } from '@apollo/client';
import limitItems from 'utils/limitItems';
import { Modal, State, TableSelection } from 'types';
import { withModals } from 'hoc';
import { getBackofficeBrand } from 'config';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Lead, Pageable__Lead as PageableLead, Sort__Input as Sort } from '__generated__/types';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { AdjustableTable, Column } from 'components/Table';
import GridEmptyValue from 'components/GridEmptyValue';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import Uuid from 'components/Uuid';
import MiniProfilePopover from 'components/MiniProfilePopover';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import { MAX_SELECTED_LEADS } from '../../constants';
import { LeadsListQuery, LeadsListQueryVariables } from '../../graphql/__generated__/LeadsListQuery';
import { leadStatuses } from './constants';
import './LeadsGrid.scss';

type Props = {
  onSelect: () => void,
  modals: { confirmationModal: Modal},
  leadsQuery: QueryResult<LeadsListQuery>,
  sorts: Array<Sort>,
};

const LeadsGrid = (props: Props) => {
  const {
    leadsQuery: {
      data,
      fetchMore,
      variables,
      networkStatus,
    },
    modals: {
      confirmationModal,
    },
    sorts,
    onSelect,
  } = props;

  const location = useLocation<State<LeadsListQueryVariables>>();
  const { state } = location;
  const history = useHistory();

  const { response } = limitItems(data?.leads as PageableLead, location);

  const {
    content = [],
    totalElements = 0,
    last = true,
  } = response || {};

  const handlePageChanged = () => {
    const { currentPage } = limitItems(data?.leads as PageableLead, location);
    const filters = state?.filters;
    const size = variables?.args?.page?.size;

    fetchMore({
      variables: {
        args: {
          ...filters,
          page: {
            from: currentPage + 1,
            size,
            sorts,
          },
        },
      },
    });
  };

  const handleSort = (sort: Array<Sort>) => {
    history.replace({
      state: {
        ...state,
        sorts: sort,
      },
    });
  };

  const handleRowClick = (uuid: string) => {
    window.open(`/leads/${uuid}`, '_blank');
  };

  const handleSelectError = (select: TableSelection) => {
    confirmationModal.show({
      onSubmit: confirmationModal.hide,
      modalTitle: `${select.max} ${I18n.t('LEADS.LEADS_SELECTED')}`,
      actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max: select.max }),
      submitButtonLabel: I18n.t('COMMON.OK'),
      hideCancel: true,
    });
  };

  const renderLead = ({ uuid, name, surname }: Lead) => (
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
  );

  const renderAffiliate = ({ affiliate, source }: Lead) => (
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
  );

  const renderCountry = ({ country, language }: Lead) => (
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
  );

  const renderSales = ({ acquisition }: Lead) => (
    <GridAcquisitionStatus
      active
      acquisition="SALES"
      status={acquisition?.salesStatus as string}
      fullName={acquisition?.salesOperator?.fullName as string}
      hierarchy={acquisition?.salesOperator?.hierarchy}
    />
  );

  const renderRegistrationDate = ({ registrationDate }: Lead) => (
    <>
      <div className="LeadsGrid__general">
        {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
      </div>

      <div className="LeadsGrid__additional">
        {moment.utc(registrationDate).local().format('HH:mm:ss')}
      </div>
    </>
  );

  const renderLastNote = ({ uuid, lastNote }: Lead) => {
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
  };

  const renderLastCall = ({ lastCall }: Lead) => {
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
  };

  const renderStatus = ({ status, statusChangedDate, convertedByOperatorUuid, convertedToClientUuid }: Lead) => (
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
  );

  // Show loader only if initial load or new variables was applied
  const isLoading = [NetworkStatus.loading, NetworkStatus.setVariables].includes(networkStatus);
  const columnsOrder = getBackofficeBrand()?.tables?.leads?.columnsOrder || [];

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

export default compose(
  React.memo,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(LeadsGrid);
