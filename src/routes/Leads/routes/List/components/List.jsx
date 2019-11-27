import React, { Component, Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { get, omit } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import history from 'router/history';
import PropTypes from 'constants/propTypes';
import { deskTypes, userTypes } from 'constants/hierarchyTypes';
import GridView, { GridViewColumn } from 'components/GridView';
import Placeholder from 'components/Placeholder';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import Uuid from 'components/Uuid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import GridStatusDeskTeam from 'components/GridStatusDeskTeam';
import GridStatus from 'components/GridStatus';
import GridEmptyValue from 'components/GridEmptyValue';
import renderLabel from 'utils/renderLabel';
import ConvertedBy from '../../../components/ConvertedBy';
import { leadStatuses } from '../../../constants';
import { getLeadsData } from './utils';
import LeadsGridFilter from './LeadsGridFilter';

const MAX_SELECTED_ROWS = 10000;

class List extends Component {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    leads: PropTypes.shape({
      leads: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.lead),
      }),
      loadMore: PropTypes.func,
      refetch: PropTypes.func,
      loading: PropTypes.bool.isRequired,
    }),
    location: PropTypes.shape({
      query: PropTypes.shape({
        filters: PropTypes.object,
      }),
    }).isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
      promoteInfoModal: PropTypes.modalType,
      leadsUploadModal: PropTypes.modalType,
    }).isRequired,
    fileUpload: PropTypes.func.isRequired,
  };

  static defaultProps = {
    leads: {
      leads: {},
      loading: false,
    },
  };

  static childContextTypes = {
    getApolloRequestState: PropTypes.func.isRequired,
  };

  state = {
    selectedRows: [],
    allRowsSelected: false,
    touchedRowsIds: [],
    hierarchyOperators: [],
  };

  getChildContext() {
    return {
      getApolloRequestState: this.handleGetRequestState,
    };
  }

  componentWillUnmount() {
    this.handleFilterReset();
  }

  setDesksTeamsOperators = (hierarchyOperators) => {
    this.setState({ hierarchyOperators });
  };

  handleGetRequestState = () => this.props.leads.loading;

  handlePageChanged = () => {
    const {
      leads: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = async (filters = {}) => {
    const { hierarchyOperators } = this.state;

    this.setState({
      allRowsSelected: false,
      selectedRows: [],
      touchedRowsIds: [],
    }, () => history.replace({
      query: {
        filters: {
          ...filters,
          ...((filters.teams || filters.desks) && {
            teams: null,
            desks: null,
            salesAgents: filters.salesAgents || hierarchyOperators,
          }),
        },
      },
    }));
  };

  handleFilterReset = () => {
    this.setState({
      allRowsSelected: false,
      selectedRows: [],
      touchedRowsIds: [],
    }, () => history.replace({ query: { filters: {} } }));
  };

  handleLeadClick = ({ uuid }) => {
    window.open(`/leads/${uuid}`, '_blank');
  };

  handleSelectRow = (condition, index, touchedRowsIds) => {
    const { leads: { leads: { data: { content } } } } = this.props;

    this.setState((state) => {
      const selectedRows = [...state.selectedRows];

      if (condition) {
        selectedRows.push(content[index].uuid);
      } else {
        selectedRows.splice(index, 1);
      }

      return {
        selectedRows,
        touchedRowsIds,
      };
    });
  };

  handleAllRowsSelect = () => {
    const { leads: { leads: { data: { totalElements } } }, modals: { confirmationModal } } = this.props;
    const { allRowsSelected } = this.state;
    const selectedRows = allRowsSelected
      ? []
      : [...Array.from(Array(totalElements > MAX_SELECTED_ROWS ? MAX_SELECTED_ROWS : totalElements).keys())];

    this.setState({
      allRowsSelected: !allRowsSelected,
      touchedRowsIds: [],
      selectedRows,
    });

    // Check if selected all rows and total elements more than max available elements to execute action
    if (!allRowsSelected && totalElements > MAX_SELECTED_ROWS) {
      const max = selectedRows.length.toLocaleString('en');

      confirmationModal.show({
        onSubmit: confirmationModal.hide,
        modalTitle: `${max} ${I18n.t('LEADS.LEADS_SELECTED')}`,
        actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max }),
        submitButtonLabel: I18n.t('COMMON.OK'),
      });
    }
  };

  handleUploadCSV = async ([file]) => {
    const {
      notify,
      leads: { refetch },
      modals: { leadsUploadModal },
    } = this.props;

    const { data: { upload: { leadCsvUpload: { error } } } } = await this.props.fileUpload({ variables: { file } });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.UPLOAD_FAILED'),
        message: error.error || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });

      return;
    }

    leadsUploadModal.hide();

    notify({
      level: 'success',
      title: I18n.t('COMMON.SUCCESS'),
      message: I18n.t('COMMON.UPLOAD_SUCCESSFUL'),
    });

    refetch();
  };

  handleLeadsUploadModalClick = () => {
    this.props.modals.leadsUploadModal.show({
      onDropAccepted: this.handleUploadCSV,
    });
  };

  handleTriggerRepModal = () => {
    const {
      modals: { representativeModal },
      location: { query },
      leads: { leads: { data: { content, totalElements } } },
    } = this.props;

    const { allRowsSelected, selectedRows } = this.state;
    const leads = getLeadsData(this.state, totalElements, content);

    representativeModal.show({
      leads,
      userType: userTypes.LEAD_CUSTOMER,
      type: deskTypes.SALES,
      configs: {
        allRowsSelected,
        totalElements: selectedRows.length,
        multiAssign: true,
        ...query && { searchParams: { ...omit(query.filters, ['size', 'teams', 'desks']) } },
      },
      onSuccess: this.handleSuccessUpdateLeadList,
      header: (
        <Fragment>
          <div>{I18n.t(`CLIENTS.MODALS.${deskTypes.SALES}_MODAL.HEADER`)}</div>
          <div className="font-size-11 color-yellow">{selectedRows.length}{' '}{I18n.t('COMMON.LEADS_SELECTED')}</div>
        </Fragment>
      ),
    });
  };

  handleSuccessUpdateLeadList = () => {
    this.props.leads.refetch();

    this.setState({
      selectedRows: [],
      allRowsSelected: false,
      touchedRowsIds: [],
    });
  };

  renderLead = (data) => {
    const { uuid, name, surname } = data;

    return (
      <div id={uuid}>
        <div className="font-weight-700">
          {name} {surname}
        </div>
        <div className="font-size-11">
          <Uuid uuid={uuid} uuidPrefix="LE" />
        </div>
      </div>
    );
  };

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

  renderSales = ({ salesStatus, salesAgent }) => {
    const className = salesStatusesColor[salesStatus];

    return (
      <GridStatus
        colorClassName={className}
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
  };

  renderRegistrationDate = ({ registrationDate }) => (
    <Fragment>
      <div className="font-weight-700">{moment.utc(registrationDate).local().format('DD.MM.YYYY')}</div>
      <div className="font-size-11">
        {moment.utc(registrationDate).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  );

  renderLastNote = ({ id, lastNote }) => (
    <Choose>
      <When condition={lastNote && lastNote.content}>
        <div className="max-width-200">
          <div className="font-weight-700">{moment.utc(lastNote.changedAt).local().format('DD.MM.YYYY')}</div>
          <div className="font-size-11">{moment.utc(lastNote.changedAt).local().format('HH:mm:ss')}</div>
          <div className="text-truncate-2-lines max-height-35 font-size-11" id={`${id}-note`}>{lastNote.content}</div>
          <UncontrolledTooltip
            placement="bottom-start"
            target={`${id}-note`}
            delay={{
              show: 350, hide: 250,
            }}
          >
            {lastNote.content}
          </UncontrolledTooltip>
        </div>
      </When>
      <Otherwise>
        <GridEmptyValue I18n={I18n} />
      </Otherwise>
    </Choose>
  );

  renderStatus = ({ status, statusChangedDate, convertedByOperatorUuid, convertedToClientUuid }) => (
    <Fragment>
      <div className={classNames('font-weight-700 text-uppercase', leadStatuses[status].color)}>
        {I18n.t(leadStatuses[status].label)}
      </div>
      <If condition={statusChangedDate}>
        <div className="header-block-small">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangedDate).local().format('DD.MM.YYYY HH:mm:ss') })}
        </div>
      </If>
      <ConvertedBy
        convertedToClientUuid={convertedToClientUuid}
        convertedByOperatorUuid={convertedByOperatorUuid}
      />
    </Fragment>
  );

  render() {
    const {
      leads: {
        loading,
        leads,
      },
      location: { query },
    } = this.props;

    const {
      allRowsSelected,
      selectedRows,
      touchedRowsIds,
    } = this.state;

    const entities = get(leads, 'data') || { content: [] };
    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading && !!leads}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <Choose>
              <When condition={!!entities.totalElements}>
                <span className="font-size-20 height-55 users-list-header">
                  <div>
                    <strong>{entities.totalElements} </strong>
                    {I18n.t('LEADS.LEADS_FOUND')}
                  </div>
                  <div className="font-size-14">
                    <strong>{selectedRows.length} </strong>
                    {I18n.t('LEADS.LEADS_SELECTED')}
                  </div>
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20">
                  {I18n.t('LEADS.LEADS')}
                </span>
              </Otherwise>
            </Choose>
          </Placeholder>

          <If condition={entities.totalElements !== 0 && selectedRows.length !== 0}>
            <div className="grid-bulk-menu ml-auto">
              <span>Bulk actions</span>
              <button
                type="button"
                className="btn btn-default-outline"
                onClick={this.handleTriggerRepModal}
              >
                {I18n.t('COMMON.SALES')}
              </button>
            </div>
          </If>
          <If condition={selectedRows.length === 0}>
            <div className="ml-auto">
              <button
                type="button"
                className="btn btn-default-outline margin-left-15"
                onClick={this.handleLeadsUploadModalClick}
              >
                {I18n.t('COMMON.UPLOAD')}
              </button>
              {/*
                <button
                  disabled={!allowActions}
                  className="btn btn-default-outline margin-left-15"
                  onClick={this.handleExport}
                  type="button"
                >
                  {I18n.t('COMMON.EXPORT')}
                </button>
              */}
            </div>
          </If>
        </div>

        <LeadsGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          setDesksTeamsOperators={this.setDesksTeamsOperators}
          isFetchingProfileData={loading}
        />
        <div className="card-body card-grid-multiselect">
          <GridView
            tableClassName="table-hovered"
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.page}
            last={entities.last}
            lazyLoad
            loading={loading && entities.content.length === 0}
            multiselect
            allRowsSelected={allRowsSelected}
            touchedRowsIds={touchedRowsIds}
            onAllRowsSelect={this.handleAllRowsSelect}
            onRowSelect={this.handleSelectRow}
            showNoResults={entities.content.length === 0}
            onRowClick={this.handleLeadClick}
          >
            <GridViewColumn
              name="lead"
              header={I18n.t('LEADS.GRID_HEADER.LEAD')}
              render={this.renderLead}
            />
            <GridViewColumn
              name="country"
              header={I18n.t('LEADS.GRID_HEADER.COUNTRY')}
              render={this.renderCountry}
            />
            <GridViewColumn
              name="sales"
              header={I18n.t('LEADS.GRID_HEADER.SALES')}
              render={this.renderSales}
            />
            <GridViewColumn
              name="registrationDate"
              header={I18n.t('LEADS.GRID_HEADER.REGISTRATION')}
              render={this.renderRegistrationDate}
            />
            <GridViewColumn
              name="lastNote"
              header={I18n.t('LEADS.GRID_HEADER.LAST_NOTE')}
              render={this.renderLastNote}
            />
            <GridViewColumn
              name="status"
              header={I18n.t('LEADS.GRID_HEADER.STATUS')}
              render={this.renderStatus}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default List;
