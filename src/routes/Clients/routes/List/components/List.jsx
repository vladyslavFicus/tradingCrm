import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get, uniq } from 'lodash';
import moment from 'moment';
import { TextRow } from 'react-placeholder/lib/placeholders';
import UserGridFilter from './UserGridFilter';
import history from '../../../../../router/history';
import PropTypes from '../../../../../constants/propTypes';
import { deskTypes } from '../../../../../constants/hierarchyTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import Placeholder from '../../../../../components/Placeholder';
import withPlayerClick from '../../../../../utils/withPlayerClick';
import { getUsersByBranch } from '../../../../../graphql/queries/hierarchy';
import getColumns from './utils';

class List extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    notify: PropTypes.func.isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    onPlayerClick: PropTypes.func.isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    countries: PropTypes.object.isRequired,
    auth: PropTypes.shape({
      brandId: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
    profiles: PropTypes.shape({
      profiles: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.any),
      }),
      loadMore: PropTypes.func,
      loading: PropTypes.bool.isRequired,
    }),
    location: PropTypes.shape({
      query: PropTypes.shape({
        filters: PropTypes.object,
      }),
    }).isRequired,
    modals: PropTypes.shape({
      representativeModal: PropTypes.modalType,
      moveModal: PropTypes.modalType,
    }).isRequired,
    userBranchHierarchy: PropTypes.shape({
      hierarchy: PropTypes.shape({
        userBranchHierarchy: PropTypes.shape({
          data: PropTypes.shape({
            DESK: PropTypes.arrayOf(PropTypes.branchHierarchyType),
          }),
          error: PropTypes.object,
        }),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    agents: PropTypes.shape({
      hierarchy: PropTypes.shape({
        hierarchyUsersByType: PropTypes.shape({
          data: PropTypes.shape({
            SALES_AGENT: PropTypes.arrayOf(PropTypes.userHierarchyType),
            RETENTION_AGENT: PropTypes.arrayOf(PropTypes.userHierarchyType),
          }),
          error: PropTypes.object,
        }),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    bulkRepresentativeUpdate: PropTypes.func.isRequired,
    profileBulkUpdate: PropTypes.func.isRequired,
  };

  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    profiles: {
      profiles: {},
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
      profiles: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = async (filters = {}) => {
    const {
      client,
      notify,
    } = this.props;
    let hierarchyData = [];

    if (filters.desks) {
      const { data: { hierarchy: { usersByBranch: { data, error } } } } = await client.query({
        query: getUsersByBranch,
        variables: { uuid: filters.desks },
      });

      if (error) {
        notify({
          level: 'error',
          title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
          message: I18n.t('COMMON.SOMETHING_WRONG'),
        });

        return;
      }
      hierarchyData = [...hierarchyData, ...data.map(({ uuid }) => uuid)];
    }

    if (filters.teams) {
      const { data: { hierarchy: { usersByBranch: { data, error } } } } = await client.query({
        query: getUsersByBranch,
        variables: { uuid: filters.teams },
      });

      if (error) {
        notify({
          level: 'error',
          title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
          message: I18n.t('COMMON.SOMETHING_WRONG'),
        });

        return;
      }
      hierarchyData = [...hierarchyData, ...data.map(({ uuid }) => uuid)];
    }

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
            repIds: uniq(hierarchyData),
          }),
        },
      },
    }));
  };

  handleFilterReset = () => {
    const registrationDateFrom = moment().startOf('day').utc().format();

    this.setState({
      allRowsSelected: false,
      selectedRows: [],
      touchedRowsIds: [],
    }, () => history.replace({ query: { filters: { registrationDateFrom } } }));
  };

  handlePlayerClick = (data) => {
    this.props.onPlayerClick({ ...data, auth: this.props.auth });
  };

  handleSelectRow = (condition, index, touchedRowsIds) => {
    const { profiles: { profiles: { data: { content } } } } = this.props;
    const selectedRows = [...this.state.selectedRows];

    if (condition) {
      selectedRows.push(content[index].playerUUID);
    } else {
      selectedRows.splice(index, 1);
    }

    this.setState({
      selectedRows,
      touchedRowsIds,
    });
  };

  handleAllRowsSelect = () => {
    const { profiles: { profiles: { data: { totalElements } } } } = this.props;
    const { allRowsSelected } = this.state;

    this.setState({
      allRowsSelected: !allRowsSelected,
      touchedRowsIds: [],
      selectedRows: allRowsSelected
        ? []
        : [...Array.from(Array(totalElements).keys())],
    });
  };

  handleTriggerRepModal = type => () => {
    const {
      modals: { representativeModal },
      userBranchHierarchy: { hierarchy: { userBranchHierarchy: { data: { DESK } } } },
      agents: { hierarchy: { hierarchyUsersByType: { data: {
        [`${type}_AGENT`]: agents,
        [`${type}_HOD`]: hods,
        [`${type}_MANAGER`]: managers,
        [`${type}_LEAD`]: leads,
      } } } },
    } = this.props;
    const { selectedRows } = this.state;

    const operators = [
      ...agents || [],
      ...hods || [],
      ...managers || [],
      ...leads || [],
    ];

    const desks = DESK ? DESK.filter(({ deskType }) => deskType === deskTypes[type]) : [];

    representativeModal.show({
      onSubmit: values => this.handleUpdateRepresentative(type, values),
      i18nPrefix: `${type}_MODAL`,
      clientsSelected: selectedRows.length,
      agents: operators,
      desks,
      type,
    });
  };

  handleUpdateRepresentative = async (type, { teamId, repId, status }) => {
    const {
      notify,
      bulkRepresentativeUpdate,
      location: { query },
      profiles: { refetch, profiles: { data: { content, totalElements } } },
      modals: { representativeModal },
    } = this.props;

    const { allRowsSelected, selectedRows, touchedRowsIds } = this.state;
    const ids = allRowsSelected
      ? touchedRowsIds.map(index => content[index].playerUUID)
      : selectedRows;

    const { data: { clients: { bulkRepresentativeUpdate: { error } } } } = await bulkRepresentativeUpdate({
      variables: {
        teamId,
        type,
        allRowsSelected,
        totalElements,
        ids,
        ...(type === deskTypes.SALES
          ? { salesStatus: status, salesRep: repId }
          : { retentionStatus: status, retentionRep: repId }),
        ...query && { searchParams: { ...query.filters } },
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    } else {
      refetch({
        variables: {
          ...query ? query.filters : { registrationDateFrom: moment().startOf('day').utc().format() },
          page: 1,
          size: 20,
        },
        fetchPolicy: 'network-only',
      });
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: type === deskTypes.SALES
          ? I18n.t('CLIENTS.SALES_INFO_UPDATED')
          : I18n.t('CLIENTS.RETENTION_INFO_UPDATED'),
      });
      this.setState({
        selectedRows: [],
        allRowsSelected: false,
        touchedRowsIds: [],
      });
    }
    representativeModal.hide();
  };

  handleTriggerMoveModal = () => {
    const { modals: { moveModal } } = this.props;
    const { selectedRows } = this.state;

    moveModal.show({
      onSubmit: this.handleBulkMove,
      clientsSelected: selectedRows.length,
    });
  }

  handleBulkMove = async (values) => {
    const {
      notify,
      profileBulkUpdate,
      location: { query },
      profiles: { refetch, profiles: { data: { content, totalElements } } },
      modals: { moveModal },
    } = this.props;

    const { allRowsSelected, selectedRows, touchedRowsIds } = this.state;
    const ids = allRowsSelected
      ? touchedRowsIds.map(index => content[index].playerUUID)
      : selectedRows;

    const { data: { clients: { profileBulkUpdate: { error } } } } = await profileBulkUpdate({
      variables: {
        allRowsSelected,
        totalElements,
        ids,
        ...values,
        ...query && { searchParams: { ...query.filters } },
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    } else {
      refetch({
        variables: {
          ...query ? query.filters : { registrationDateFrom: moment().startOf('day').utc().format() },
          page: 1,
          size: 20,
        },
        fetchPolicy: 'network-only',
      });
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS.ACQUISITION_STATUS_UPDATED'),
      });
      this.setState({
        selectedRows: [],
        allRowsSelected: false,
        touchedRowsIds: [],
      });
    }

    moveModal.hide();
  }

  render() {
    const {
      locale,
      currencies,
      countries,
      profiles: {
        loading,
        profiles,
      },
      fetchPlayerMiniProfile,
      auth,
      location: { query },
      userBranchHierarchy: { hierarchy, loading: branchesLoading },
    } = this.props;

    const {
      allRowsSelected,
      selectedRows,
      touchedRowsIds,
    } = this.state;

    const entities = get(this.props.profiles, 'profiles.data') || { content: [] };
    const filters = get(query, 'filters', {});
    const { TEAM: teams, DESK: desks } = get(hierarchy, 'userBranchHierarchy.data') || { TEAM: [], DESK: [] };

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading && !!profiles}
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
                <span id="users-list-header" className="font-size-20 height-55 users-list-header">
                  <div>
                    <strong>{entities.totalElements} </strong>
                    {I18n.t('COMMON.CLIENTS_FOUND')}
                  </div>
                  <div className="font-size-14">
                    <strong>{selectedRows.length} </strong>
                    {I18n.t('COMMON.CLIENTS_SELECTED')}
                  </div>
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20" id="users-list-header">
                  {I18n.t('COMMON.CLIENTS')}
                </span>
              </Otherwise>
            </Choose>
          </Placeholder>

          <If condition={entities.totalElements !== 0 && selectedRows.length !== 0}>
            <div className="grid-bulk-menu ml-auto">
              <span>{I18n.t('CLIENTS.BULK_ACTIONS')}</span>
              <If condition={auth.isAdministration}>
                <button
                  className="btn btn-default-outline"
                  disabled={branchesLoading}
                  onClick={this.handleTriggerRepModal(deskTypes.SALES)}
                >
                  {I18n.t('COMMON.SALES')}
                </button>
                <button
                  className="btn btn-default-outline"
                  disabled={branchesLoading}
                  onClick={this.handleTriggerRepModal(deskTypes.RETENTION)}
                >
                  {I18n.t('COMMON.RETENTION')}
                </button>
                <button
                  className="btn btn-default-outline"
                  onClick={this.handleTriggerMoveModal}
                >
                  {I18n.t('COMMON.MOVE')}
                </button>
              </If>
              <button
                className="btn btn-default-outline"
                // onClick={this.changeStatus}
              >
                {I18n.t('COMMON.CHANGE_STATUS')}
              </button>
              <button
                className="btn btn-default-outline"
                // onClick={this.handleExportSelected}
              >
                {I18n.t('COMMON.EXPORT_SELECTED')}
              </button>
            </div>
          </If>
        </div>

        <UserGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          currencies={currencies}
          countries={countries}
          teams={teams || []}
          desks={desks || []}
          branchesLoading={branchesLoading}
        />

        <div className="card-body card-grid-multiselect">
          <GridView
            tableClassName="table-hovered"
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.page}
            last={entities.last}
            lazyLoad
            multiselect
            selectedRows={selectedRows}
            allRowsSelected={allRowsSelected}
            touchedRowsIds={touchedRowsIds}
            onAllRowsSelect={this.handleAllRowsSelect}
            onRowSelect={this.handleSelectRow}
            locale={locale}
            showNoResults={!loading && entities.content.length === 0}
            onRowClick={this.handlePlayerClick}
          >
            {getColumns(I18n, auth, fetchPlayerMiniProfile)
              .map(({ name, header, render }) => (
                <GridViewColumn
                  key={name}
                  name={name}
                  header={header}
                  render={render}
                />
              ))
            }
          </GridView>
        </div>
      </div>
    );
  }
}

export default withPlayerClick(List);
