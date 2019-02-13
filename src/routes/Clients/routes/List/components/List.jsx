import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get, omit } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import history from 'router/history';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { deskTypes } from 'constants/hierarchyTypes';
import { departments } from 'constants/brands';
import GridView, { GridViewColumn } from 'components/GridView';
import PermissionContent from 'components/PermissionContent';
import Placeholder from 'components/Placeholder';
import withPlayerClick from 'utils/withPlayerClick';
import UserGridFilter from './UsersGridFilter';
import { columns } from './attributes';
import { getClientsData } from './utils';

class List extends Component {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    onPlayerClick: PropTypes.func.isRequired,
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
            TEAM: PropTypes.arrayOf(PropTypes.branchHierarchyType),
          }),
          error: PropTypes.object,
        }),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    bulkRepresentativeUpdate: PropTypes.func.isRequired,
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
    hierarchyOperators: [],
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  setDesksTeamsOperators = (hierarchyOperators) => {
    this.setState({ hierarchyOperators });
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
            repIds: filters.repIds || hierarchyOperators,
          }),
        },
      },
    }));
  };

  handleFilterReset = () => this.setState({
    allRowsSelected: false,
    selectedRows: [],
    touchedRowsIds: [],
  }, () => history.replace({ query: null }));

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
      location: { query },
      profiles: { profiles: { data: { content, totalElements } } },
    } = this.props;

    const { allRowsSelected, selectedRows } = this.state;
    const clients = getClientsData(this.state, totalElements, type, content);

    representativeModal.show({
      type,
      clients,
      configs: {
        allRowsSelected,
        totalElements,
        multiAssign: true,
        ...query && { searchParams: { ...query.filters } },
      },
      onSuccess: this.handleSuccessUpdateRepresentative,
      header: (
        <Fragment>
          <div>{I18n.t(`CLIENTS.MODALS.${type}_MODAL.HEADER`)}</div>
          <div className="font-size-11 color-yellow">{selectedRows.length}{' '}{I18n.t('COMMON.CLIENTS_SELECTED')}</div>
        </Fragment>
      ),
    });
  };

  handleSuccessUpdateRepresentative = async () => {
    const {
      location: { query },
      profiles: { refetch },
    } = this.props;

    refetch({
      variables: {
        ...query && query.filters,
        page: 0,
        size: 20,
      },
      fetchPolicy: 'network-only',
    });
    this.setState({
      selectedRows: [],
      allRowsSelected: false,
      touchedRowsIds: [],
    });
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
      bulkRepresentativeUpdate,
      location: { query },
      profiles: { refetch, profiles: { data: { content, totalElements } } },
      modals: { moveModal },
    } = this.props;
    const { allRowsSelected } = this.state;

    const type = values.aquisitionStatus;
    const clients = getClientsData(this.state, totalElements, type, content);

    const { data: { clients: { bulkRepresentativeUpdate: { error } } } } = await bulkRepresentativeUpdate({
      variables: {
        clients,
        type,
        allRowsSelected,
        totalElements,
        ...values,
        ...query && { searchParams: omit(query.filters, ['desks', 'teams']) },
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
          ...query && query.filters,
          page: 0,
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
      countries,
      profiles: {
        loading,
        profiles,
      },
      fetchPlayerMiniProfile,
      auth,
      userBranchHierarchy: { hierarchy, loading: branchesLoading },
    } = this.props;

    const {
      allRowsSelected,
      selectedRows,
      touchedRowsIds,
    } = this.state;

    const entities = get(this.props.profiles, 'profiles.data') || { content: [] };
    const teams = get(hierarchy, 'userBranchHierarchy.data.TEAM') || [];
    const desks = get(hierarchy, 'userBranchHierarchy.data.DESK') || [];

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
              <PermissionContent permissions={permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS}>
                <If condition={auth.department !== departments.RETENTION}>
                  <button
                    className="btn btn-default-outline"
                    disabled={branchesLoading}
                    onClick={this.handleTriggerRepModal(deskTypes.SALES)}
                  >
                    {I18n.t('COMMON.SALES')}
                  </button>
                </If>
                <If condition={auth.department !== departments.SALES}>
                  <button
                    className="btn btn-default-outline"
                    disabled={branchesLoading}
                    onClick={this.handleTriggerRepModal(deskTypes.RETENTION)}
                  >
                    {I18n.t('COMMON.RETENTION')}
                  </button>
                </If>
                <button
                  className="btn btn-default-outline"
                  onClick={this.handleTriggerMoveModal}
                >
                  {I18n.t('COMMON.MOVE')}
                </button>
              </PermissionContent>
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
          countries={countries}
          teams={teams}
          desks={desks}
          branchesLoading={branchesLoading}
          setDesksTeamsOperators={this.setDesksTeamsOperators}
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
            {columns(I18n, auth, fetchPlayerMiniProfile)
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
