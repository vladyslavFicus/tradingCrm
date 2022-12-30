import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { startCase } from 'lodash';
import compose from 'compose-function';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { NetworkStatus } from '@apollo/client';
import { withModals } from 'hoc';
import { getBackofficeBrand } from 'config';
import PropTypes from 'constants/propTypes';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { AdjustableTable, Column } from 'components/Table';
import GridEmptyValue from 'components/GridEmptyValue';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import Uuid from 'components/Uuid';
import MiniProfile from 'components/MiniProfile';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import limitItems from 'utils/limitItems';
import { leadStatuses } from '../../../../constants';
import { MAX_SELECTED_LEADS } from '../../constants';
import './LeadsGrid.scss';

class LeadsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    onSelect: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    leadsQuery: PropTypes.query({
      leads: PropTypes.pageable(PropTypes.lead),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      location,
      location: {
        state,
      },
      leadsQuery: {
        data,
        fetchMore,
        variables,
      },
    } = this.props;

    const { currentPage } = limitItems(data?.leads, location);
    const filters = state?.filters;
    const sorts = state?.sorts;
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

  handleSort = (sorts) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  handleRowClick = (uuid) => {
    window.open(`/leads/${uuid}`, '_blank');
  };

  handleSelectError = (select) => {
    const {
      modals: { confirmationModal },
    } = this.props;

    confirmationModal.show({
      onSubmit: confirmationModal.hide,
      modalTitle: `${select.max} ${I18n.t('LEADS.LEADS_SELECTED')}`,
      actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max: select.max }),
      submitButtonLabel: I18n.t('COMMON.OK'),
      hideCancel: true,
    });
  };

  renderLead = ({ uuid, name, surname }) => (
    <>
      <div
        className="LeadsGrid__general LeadsGrid__name"
        onClick={() => this.handleRowClick(uuid)}
      >
        {name} {surname}
      </div>

      <div className="LeadsGrid__additional">
        <MiniProfile id={uuid} type="lead">
          <Uuid uuid={uuid} uuidPrefix="LE" />
        </MiniProfile>
      </div>
    </>
  );

  renderAffiliate = ({ affiliate, source }) => (
    <>
      <Choose>
        <When condition={affiliate || source}>
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

    </>
  );

  renderCountry = ({ country, language }) => (
    <Choose>
      <When condition={country}>
        <CountryLabelWithFlag
          code={country}
          height="14"
          languageCode={language}
        />
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderSales = ({ acquisition }) => (
    <GridAcquisitionStatus
      active
      acquisition="SALES"
      status={acquisition?.salesStatus}
      fullName={acquisition?.salesOperator?.fullName}
      hierarchy={acquisition?.salesOperator?.hierarchy}
    />
  );

  renderRegistrationDate = ({ registrationDate }) => (
    <>
      <div className="LeadsGrid__general">
        {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
      </div>

      <div className="LeadsGrid__additional">
        {moment.utc(registrationDate).local().format('HH:mm:ss')}
      </div>
    </>
  );

  renderLastNote = ({ uuid, lastNote }) => {
    const { content, changedAt, operator } = lastNote || {};

    return (
      <Choose>
        <When condition={content && changedAt}>
          <div className="LeadsGrid__last-note">
            <div className="LeadsGrid__general">
              {moment.utc(changedAt).local().format('DD.MM.YYYY')}
            </div>

            <div className="LeadsGrid__additional">
              {moment.utc(changedAt).local().format('HH:mm:ss')}
            </div>

            <If condition={operator}>
              <span className="LeadsGrid__last-note-author">
                {operator.fullName}
              </span>
            </If>

            <div className="LeadsGrid__last-note-content" id={`note-${uuid}`}>
              {content}
            </div>

            <UncontrolledTooltip
              target={`note-${uuid}`}
              placement="bottom-start"
              delay={{ show: 350, hide: 250 }}
              fade={false}
            >
              {content}
            </UncontrolledTooltip>
          </div>
        </When>
        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }

  renderLastCall = ({ lastCall }) => {
    const { date, callSystem } = lastCall || {};

    return (
      <Choose>
        <When condition={lastCall}>
          <div className="LeadsGrid__general">
            {moment.utc(date).local().format('DD.MM.YYYY')}
          </div>
          <div className="LeadsGrid__additional">
            {moment.utc(date).local().format('HH:mm:ss')}
          </div>
          <div className="LeadsGrid__additional">
            {startCase(callSystem.toLowerCase())}
          </div>
        </When>
        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }

  renderStatus = ({ status, statusChangedDate, convertedByOperatorUuid, convertedToClientUuid }) => (
    <>
      <div
        className={classNames('LeadsGrid__status-title', {
          'LeadsGrid__status-title--new': status === 'NEW',
          'LeadsGrid__status-title--converted': status === 'CONVERTED',
        })}
      >
        {I18n.t(leadStatuses[status])}
      </div>

      <If condition={statusChangedDate}>
        <div className="LeadsGrid__status-converted">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangedDate).local().format('DD.MM.YYYY HH:mm:ss') })}
        </div>
      </If>

      <If condition={convertedToClientUuid && convertedByOperatorUuid}>
        <div className="LeadsGrid__status-operator">
          {I18n.t('COMMON.BY')} <Uuid uuid={convertedByOperatorUuid} />
        </div>
      </If>
    </>
  );

  render() {
    const {
      location,
      leadsQuery,
      onSelect,
    } = this.props;

    const { response } = limitItems(leadsQuery?.data?.leads, location);

    const {
      content = [],
      totalElements = 0,
      last = true,
    } = response || {};

    // Show loader only if initial load or new variables was applied
    const isLoading = [NetworkStatus.loading, NetworkStatus.setVariables].includes(leadsQuery.networkStatus);
    const columnsOrder = getBackofficeBrand()?.tables?.leads?.columnsOrder;

    return (
      <div className="LeadsGrid">
        <AdjustableTable
          columnsOrder={columnsOrder}
          withMultiSelect
          stickyFromTop={157}
          items={content}
          totalCount={totalElements}
          loading={isLoading}
          hasMore={!last}
          onMore={this.handlePageChanged}
          sorts={location?.state?.sorts}
          onSort={this.handleSort}
          maxSelectCount={MAX_SELECTED_LEADS}
          onSelect={onSelect}
          onSelectError={this.handleSelectError}
        >
          <Column
            name="lead"
            header={I18n.t('LEADS.GRID_HEADER.LEAD')}
            render={this.renderLead}
          />
          <Column
            name="country"
            sortBy="country"
            header={I18n.t('LEADS.GRID_HEADER.COUNTRY')}
            render={this.renderCountry}
          />
          <Column
            name="sales"
            header={I18n.t('LEADS.GRID_HEADER.SALES')}
            render={this.renderSales}
          />
          <Column
            name="affiliate"
            header={I18n.t('LEADS.GRID_HEADER.AFFILIATE')}
            render={this.renderAffiliate}
          />
          <Column
            name="registrationDate"
            sortBy="registrationDate"
            header={I18n.t('LEADS.GRID_HEADER.REGISTRATION')}
            render={this.renderRegistrationDate}
          />
          <Column
            name="lastNote"
            header={I18n.t('LEADS.GRID_HEADER.LAST_NOTE')}
            sortBy="lastNote.changedAt"
            render={this.renderLastNote}
          />
          <Column
            name="lastCall"
            header={I18n.t('LEADS.GRID_HEADER.LAST_CALL')}
            sortBy="lastCall.date"
            render={this.renderLastCall}
          />
          <Column
            name="status"
            header={I18n.t('LEADS.GRID_HEADER.STATUS')}
            render={this.renderStatus}
          />
        </AdjustableTable>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(LeadsGrid);
