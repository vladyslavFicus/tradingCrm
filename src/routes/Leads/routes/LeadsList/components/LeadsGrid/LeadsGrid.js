import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import moment from 'moment';
import { get } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import { withModals } from 'hoc';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import Grid, { GridColumn } from 'components/Grid';
import GridStatusDeskTeam from 'components/GridStatusDeskTeam';
import GridEmptyValue from 'components/GridEmptyValue';
import GridStatus from 'components/GridStatus';
import Uuid from 'components/Uuid';
import MiniProfile from 'components/MiniProfile';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import renderLabel from 'utils/renderLabel';
import limitItems from 'utils/limitItems';
import { leadStatuses } from '../../../../constants';
import { MAX_SELECTED_LEADS } from '../../constants';
import './LeadsGrid.scss';

class LeadsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    updateLeadsListState: PropTypes.func.isRequired,
    allRowsSelected: PropTypes.bool.isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    leadsData: PropTypes.query({
      leads: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.lead),
      }),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      location,
      leadsData,
      leadsData: {
        loadMore,
        loading,
      },
    } = this.props;

    const defaultSize = 20;
    const { currentPage } = limitItems(leadsData.data.leads, location);

    const searchLimit = get(location, 'query.filters.size');
    const restLimitSize = searchLimit && (searchLimit - (currentPage + 1) * defaultSize);
    const limit = restLimitSize && (restLimitSize < defaultSize) ? Math.abs(restLimitSize) : defaultSize;

    if (!loading) {
      loadMore({
        page: currentPage + 1,
        limit,
      });
    }
  };

  handleSelectRow = (allRowsSelected, touchedRowsIds) => {
    this.props.updateLeadsListState(allRowsSelected, touchedRowsIds);
  };

  handleAllRowsSelect = (allRowsSelected) => {
    const { updateLeadsListState } = this.props;

    updateLeadsListState(allRowsSelected, []);

    if (allRowsSelected) {
      const {
        location,
        leadsData,
        modals: { confirmationModal },
      } = this.props;

      const { totalElements } = get(leadsData, 'data.leads.data') || {};
      const searchLimit = get(location, 'query.filters.size') || null;

      let selectedLimit = totalElements > MAX_SELECTED_LEADS;

      if (searchLimit && (searchLimit < totalElements)) {
        selectedLimit = searchLimit > MAX_SELECTED_LEADS;
      }

      if (selectedLimit) {
        confirmationModal.show({
          onSubmit: confirmationModal.hide,
          modalTitle: `${MAX_SELECTED_LEADS} ${I18n.t('LEADS.LEADS_SELECTED')}`,
          actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max: MAX_SELECTED_LEADS }),
          submitButtonLabel: I18n.t('COMMON.OK'),
        });
      }
    }
  }

  renderLead = ({ uuid, name, surname }) => (
    <>
      <Link
        className="LeadsGrid__primary"
        to={`/leads/${uuid}`}
        target="_blank"
      >
        {name} {surname}
      </Link>

      <div className="LeadsGrid__secondary">
        <MiniProfile id={uuid} type="lead">
          <Uuid uuid={uuid} uuidPrefix="LE" />
        </MiniProfile>
      </div>
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

  renderSales = ({ salesStatus, salesAgent }) => (
    <GridStatus
      colorClassName={salesStatusesColor[salesStatus]}
      statusLabel={I18n.t(renderLabel(salesStatus, salesStatuses))}
      info={(
        <If condition={salesAgent}>
          <GridStatusDeskTeam
            fullName={salesAgent.fullName}
            hierarchy={salesAgent.hierarchy}
          />
        </If>
      )}
    />
  );

  renderRegistrationDate = ({ registrationDate }) => (
    <>
      <div className="LeadsGrid__primary">
        {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
      </div>

      <div className="LeadsGrid__secondary">
        {moment.utc(registrationDate).local().format('HH:mm:ss')}
      </div>
    </>
  );

  renderLastNote = ({ id, lastNote }) => (
    <Choose>
      <When condition={lastNote && lastNote.content && lastNote.changedAt}>
        <div className="LeadsGrid__last-note">
          <div className="LeadsGrid__primary">
            {moment.utc(lastNote.changedAt).local().format('DD.MM.YYYY')}
          </div>

          <div className="LeadsGrid__secondary">
            {moment.utc(lastNote.changedAt).local().format('HH:mm:ss')}
          </div>

          <div className="LeadsGrid__last-note-content" id={`${id}-note`}>
            {lastNote.content}
          </div>

          <UncontrolledTooltip
            target={`${id}-note`}
            placement="bottom-start"
            delay={{ show: 350, hide: 250 }}
          >
            {lastNote.content}
          </UncontrolledTooltip>
        </div>
      </When>
      <Otherwise>
        <GridEmptyValue />
      </Otherwise>
    </Choose>
  );

  renderStatus = ({ status, statusChangedDate, convertedByOperatorUuid, convertedToClientUuid }) => (
    <>
      <div className={classNames('LeadsGrid__status-title', leadStatuses[status].color)}>
        {I18n.t(leadStatuses[status].label)}
      </div>

      <If condition={statusChangedDate}>
        <div className="LeadsGrid__status-converted">
          {I18n.t('COMMON.SINCE', {
            date: moment.utc(statusChangedDate).local().format('DD.MM.YYYY HH:mm:ss'),
          })}
        </div>
      </If>

      <If condition={convertedToClientUuid}>
        <Choose>
          <When condition={convertedByOperatorUuid}>
            <div className="LeadsGrid__status-operator">
              {I18n.t('COMMON.BY')} <Uuid uuid={convertedByOperatorUuid} />
            </div>
          </When>
          <Otherwise>
            <small>
              {I18n.t('LEADS.STATUSES.SELF_CONVETED')}
            </small>
          </Otherwise>
        </Choose>
      </If>
    </>
  );

  render() {
    const {
      location,
      leadsData,
      touchedRowsIds,
      allRowsSelected,
    } = this.props;

    const { response } = limitItems(leadsData.data.leads, location);
    const { content, last } = get(response, 'data') || {};

    const isLoading = leadsData.loading;

    return (
      <div className="LeadsGrid">
        <Grid
          data={content || []}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          handleSelectRow={this.handleSelectRow}
          handleAllRowsSelect={this.handleAllRowsSelect}
          handlePageChanged={this.handlePageChanged}
          isLoading={isLoading}
          isLastPage={last}
          withMultiSelect
          withNoResults={content && content.length === 0}
        >
          <GridColumn
            header={I18n.t('LEADS.GRID_HEADER.LEAD')}
            render={this.renderLead}
          />
          <GridColumn
            header={I18n.t('LEADS.GRID_HEADER.COUNTRY')}
            render={this.renderCountry}
          />
          <GridColumn
            header={I18n.t('LEADS.GRID_HEADER.SALES')}
            render={this.renderSales}
          />
          <GridColumn
            header={I18n.t('LEADS.GRID_HEADER.REGISTRATION')}
            render={this.renderRegistrationDate}
          />
          <GridColumn
            header={I18n.t('LEADS.GRID_HEADER.LAST_NOTE')}
            render={this.renderLastNote}
          />
          <GridColumn
            header={I18n.t('LEADS.GRID_HEADER.STATUS')}
            render={this.renderStatus}
          />
        </Grid>
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
