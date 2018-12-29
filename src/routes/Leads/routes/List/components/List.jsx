import React, { Component, Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { NetworkStatus } from 'apollo-client';
import { TextRow } from 'react-placeholder/lib/placeholders';
import LeadsGridFilter from './LeadsGridFilter';
import history from '../../../../../router/history';
import PropTypes from '../../../../../constants/propTypes';
import { deskTypes, userTypes } from '../../../../../constants/hierarchyTypes';
import { types as miniProfileTypes } from '../../../../../constants/miniProfile';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import Placeholder from '../../../../../components/Placeholder';
import { salesStatuses, salesStatusesColor } from '../../../../../constants/salesStatuses';
import Uuid from '../../../../../components/Uuid';
import MiniProfile from '../../../../../components/MiniProfile';
import CountryLabelWithFlag from '../../../../../components/CountryLabelWithFlag';
import { leadStatuses } from '../../../constants';

class List extends Component {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    countries: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    promoteLead: PropTypes.func.isRequired,
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
      promoteInfoModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }).isRequired,
      leadsUploadModal: PropTypes.modalType,
    }).isRequired,
    fileUpload: PropTypes.func.isRequired,
  };

  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    leads: {
      leads: {},
      loading: false,
    },
  };

  state = {
    selectedRows: [],
    allRowsSelected: false,
    touchedRowsIds: [],
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

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

  handleFiltersChanged = (filters = {}) => {
    this.setState({
      allRowsSelected: false,
      selectedRows: [],
      touchedRowsIds: [],
    }, () => history.replace({ query: { filters } }));
  }

  handleFilterReset = () => {
    this.setState({
      allRowsSelected: false,
      selectedRows: [],
      touchedRowsIds: [],
    }, () => history.replace({ query: { filters: {} } }));
  };

  handleLeadClick = ({ id }) => {
    history.push(`/leads/${id}`);
  };

  handleSelectRow = (condition, index, touchedRowsIds) => {
    const { leads: { leads: { data: { content } } } } = this.props;
    const selectedRows = [...this.state.selectedRows];

    if (condition) {
      selectedRows.push(content[index].id);
    } else {
      selectedRows.splice(index, 1);
    }

    this.setState({
      selectedRows,
      touchedRowsIds,
    });
  };

  handleAllRowsSelect = () => {
    const { leads: { leads: { data: { totalElements } } } } = this.props;
    const { allRowsSelected } = this.state;

    this.setState({
      allRowsSelected: !allRowsSelected,
      touchedRowsIds: [],
      selectedRows: allRowsSelected
        ? []
        : [...Array.from(Array(totalElements).keys())],
    });
  };

  handlePromoteToClient = async () => {
    const { allRowsSelected, selectedRows, touchedRowsIds } = this.state;
    const {
      promoteLead,
      notify,
      location: { query },
      leads: { leads: { data: { content, totalElements } }, refetch },
      modals: { promoteInfoModal },
    } = this.props;

    const filters = get(query, 'filters');
    const leadIds = allRowsSelected ? touchedRowsIds.map(index => content[index].id) : selectedRows;

    const { data: { leads: { bulkPromote: { data, error, errors } } } } = await promoteLead({
      variables: {
        allRecords: allRowsSelected,
        totalRecords: totalElements,
        leadIds,
        ...filters,
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.PROMOTE_FAILED'),
        message: error.error || error.field_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    } else {
      const successAmount = data ? data.length : 0;
      const failedAmount = errors ? errors.length : 0;

      promoteInfoModal.show({
        header: I18n.t('LEADS.PROMOTE_INFO_MODAL.HEADER'),
        body: (
          <Fragment>
            <strong>
              {I18n.t('LEADS.PROMOTE_INFO_MODAL.BODY', {
                successAmount,
                total: successAmount + failedAmount,
              })}
            </strong>
          </Fragment>
        ),
      });

      refetch();
    }
  };

  handleUploadCSV = async ([file]) => {
    const { notify, leads: { refetch }, auth: { isAdministration }, modals: { leadsUploadModal } } = this.props;

    const { data: { upload: { leadCsvUpload: { error } } } } = await this.props.fileUpload({ variables: { file } });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.UPLOAD_FAILED'),
        message: error.error || error.field_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });

      return;
    }

    leadsUploadModal.hide();

    notify({
      level: 'success',
      title: I18n.t('COMMON.SUCCESS'),
      message: I18n.t('COMMON.UPLOAD_SUCCESSFUL'),
    });

    if (isAdministration) {
      refetch();
    }
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

    const { allRowsSelected, selectedRows, touchedRowsIds } = this.state;
    console.log('OBJECT', { allRowsSelected, selectedRows, touchedRowsIds });
    const ids = allRowsSelected
      ? touchedRowsIds.map(index => content[index].id)
      : selectedRows;

    console.log('ids', ids);

    representativeModal.show({
      userType: userTypes.LEAD_CUSTOMER,
      type: deskTypes.SALES,
      ids,
      props: {
        allRowsSelected,
        totalElements,
        ...query && { searchParams: { ...query.filters } },
      },
      onSuccess: this.handleSuccessUpdateRepresentative,
      header: (
        <Fragment>
          <div>{I18n.t(`CLIENTS.MODALS.${deskTypes.SALES}_MODAL.HEADER`)}</div>
          <div className="font-size-11 color-yellow">{selectedRows.length}{' '}{I18n.t('COMMON.LEADS_SELECTED')}</div>
        </Fragment>
      ),
    });
  };

  handleSuccessUpdateRepresentative = () => {
    console.log('SUCCESS');
  }

  renderLead = data => (
    <div id={data.id}>
      <div className="font-weight-700">
        {data.name} {data.surname}
      </div>
      <div className="font-size-11">
        <MiniProfile
          target={data.id}
          dataSource={data}
          type={miniProfileTypes.LEAD}
        >
          <Uuid uuid={data.id} uuidPrefix="LE" />
        </MiniProfile>
      </div>
    </div>
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

  renderStatus = ({ status }) => (
    <div className={classNames('font-weight-700 text-uppercase', leadStatuses[status].color)}>
      {I18n.t(leadStatuses[status].label)}
    </div>
  );

  renderSales = ({ salesStatus }) => {
    if (!salesStatus) {
      return (
        <div className="font-weight-700 text-uppercase">
          <span>&mdash;</span>
        </div>
      );
    }

    const className = salesStatusesColor[salesStatus];
    return (
      <div className={classNames('font-weight-700 text-uppercase', { [className]: className })}>
        {I18n.t(salesStatuses[salesStatus])}
      </div>
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

  render() {
    const {
      locale,
      currencies,
      countries,
      leads: {
        loading,
        networkStatus,
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
                className="btn btn-default-outline"
                onClick={this.handleTriggerRepModal}
              >
                {I18n.t('COMMON.SALES')}
              </button>
              <button
                className="btn btn-default-outline"
              >
                {I18n.t('COMMON.EXPORT_SELECTED')}
              </button>
            </div>
          </If>
          <If condition={selectedRows.length === 0}>
            <div className="ml-auto">
              <button
                className="btn btn-default-outline margin-left-15"
                onClick={this.handleLeadsUploadModalClick}
              >
                {I18n.t('COMMON.UPLOAD')}
              </button>
              <button
                disabled={!allowActions}
                className="btn btn-default-outline margin-left-15"
                onClick={this.handleExport}
                type="button"
              >
                {I18n.t('COMMON.EXPORT')}
              </button>
            </div>
          </If>
        </div>

        <LeadsGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          currencies={currencies}
          countries={countries}
        />

        <div className="card-body card-grid-multiselect">
          <GridView
            tableClassName="table-hovered"
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.page}
            last={entities.last}
            lazyLoad
            loading={[NetworkStatus.loading, NetworkStatus.refetch].includes(networkStatus)}
            multiselect
            allRowsSelected={allRowsSelected}
            touchedRowsIds={touchedRowsIds}
            onAllRowsSelect={this.handleAllRowsSelect}
            onRowSelect={this.handleSelectRow}
            locale={locale}
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
