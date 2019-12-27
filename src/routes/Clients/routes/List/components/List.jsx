import React, { Component, Fragment } from 'react';
import I18n from 'i18n-js';
import { get, omit } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { deskTypes } from 'constants/hierarchyTypes';
import { departments, roles } from 'constants/brands';
import GridView, { GridViewColumn } from 'components/GridView';
import PermissionContent from 'components/PermissionContent';
import Placeholder from 'components/Placeholder';
import parseJson from 'utils/parseJson';
import UserGridFilter from './UsersGridFilter';
import { columns } from './attributes';
import { getClientsData } from './utils';

const MAX_SELECTED_ROWS = 10000;

class List extends Component {
  static propTypes = {
    ...PropTypes.router,
    auth: PropTypes.shape({
      department: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }).isRequired,
    profiles: PropTypes.shape({
      profiles: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.any),
      }),
      refetch: PropTypes.func.isRequired,
      loadMore: PropTypes.func,
      loading: PropTypes.bool.isRequired,
    }),
    location: PropTypes.shape({
      query: PropTypes.shape({
        filters: PropTypes.object,
      }),
      filterSetValues: PropTypes.object,
    }).isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
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
  };

  static childContextTypes = {
    getApolloRequestState: PropTypes.func.isRequired,
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

  getChildContext() {
    return {
      getApolloRequestState: this.handleGetRequestState,
    };
  }

  componentDidMount() {
    window.addEventListener('message', ({ data, origin }) => {
      if (origin === window.location.origin) {
        if (typeof data === 'string') {
          const action = parseJson(data, null);

          if (
            action
            && this.props.profiles
          ) {
            this.props.profiles.refetch();
          }
        }
      }
    });
  }

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handleGetRequestState = () => this.props.profiles.loading;

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
    const { location: { filterSetValues } } = this.props;

    this.setState({
      allRowsSelected: false,
      selectedRows: [],
      touchedRowsIds: [],
    }, () => this.props.history.replace({
      // Not to rewrite form initial Values if exist
      ...(filterSetValues && { filterSetValues }),
      query: { filters },
    }));
  };

  handleFilterReset = () => this.setState({
    allRowsSelected: false,
    selectedRows: [],
    touchedRowsIds: [],
  }, () => this.props.history.replace({ query: null }));

  handlePlayerClick = ({ uuid }) => {
    window.open(`/clients/${uuid}/profile`, '_blank');
  };

  handleSelectRow = (isAllRowsSelected, rowIndex, touchedRowsIds) => {
    this.setState((state) => {
      const selectedRows = [...state.selectedRows];

      if (isAllRowsSelected) {
        selectedRows.push(rowIndex);
      } else {
        const unselectedRowIndex = selectedRows.findIndex(item => item === rowIndex);
        selectedRows.splice(unselectedRowIndex, 1);
      }

      return {
        selectedRows,
        touchedRowsIds,
      };
    });
  };

  handleAllRowsSelect = () => {
    const {
      profiles: { profiles: { data: { totalElements } } },
      modals: { confirmationModal },
      location: { query },
    } = this.props;

    const { allRowsSelected } = this.state;
    const searchLimit = get(query, 'filters.searchLimit') || null;

    let selectedRowsLength = null;

    if (searchLimit) {
      selectedRowsLength = searchLimit;
    } else if (totalElements > MAX_SELECTED_ROWS) {
      selectedRowsLength = MAX_SELECTED_ROWS;
    } else {
      selectedRowsLength = totalElements;
    }

    this.setState({
      allRowsSelected: !allRowsSelected,
      touchedRowsIds: [],
      selectedRows: allRowsSelected
        ? []
        : [...Array.from(Array(selectedRowsLength).keys())],
    });

    // Check if selected all rows and total elements more than max available elements to execute action
    if (allRowsSelected && selectedRowsLength > MAX_SELECTED_ROWS) {
      confirmationModal.show({
        onSubmit: confirmationModal.hide,
        modalTitle: `${MAX_SELECTED_ROWS} ${I18n.t('COMMON.CLIENTS_SELECTED')}`,
        actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { MAX_SELECTED_ROWS }),
        submitButtonLabel: I18n.t('COMMON.OK'),
      });
    }
  };

  handleTriggerRepModal = type => () => {
    const {
      modals: { representativeModal },
      location: { query },
      profiles: { profiles: { data: { content, totalElements } } },
    } = this.props;
    const { allRowsSelected, selectedRows } = this.state;

    const clients = getClientsData(this.state, totalElements, { type }, content);

    representativeModal.show({
      type,
      clients,
      configs: {
        allRowsSelected,
        totalElements: selectedRows.length,
        multiAssign: true,
        ...query && { searchParams: omit(query.filters, ['page.size']) },
      },
      onSuccess: this.handleSuccessListUpdate,
      header: (
        <Fragment>
          <div>{I18n.t(`CLIENTS.MODALS.${type}_MODAL.HEADER`)}</div>
          <div className="font-size-11 color-yellow">{selectedRows.length}{' '}{I18n.t('COMMON.CLIENTS_SELECTED')}</div>
        </Fragment>
      ),
    });
  };

  handleTriggerMoveModal = () => {
    const {
      modals: { moveModal },
      location: { query },
      profiles: { profiles: { data: { content, totalElements } } },
    } = this.props;

    moveModal.show({
      content,
      configs: {
        totalElements,
        ...this.state,
        ...query && { searchParams: omit(query.filters, ['page.size']) },
      },
      onSuccess: this.handleSuccessListUpdate,
    });
  };

  handleSuccessListUpdate = async () => {
    const { profiles: { refetch } } = this.props;

    this.setState({
      selectedRows: [],
      allRowsSelected: false,
      touchedRowsIds: [],
    });

    refetch();
  };

  render() {
    const {
      auth,
      location: { filterSetValues, query },
      profiles: { loading, profiles },
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
    const { searchLimit } = get(query, 'filters') || {};

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
                    <strong>{searchLimit || entities.totalElements} </strong>
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
                    type="button"
                    className="btn btn-default-outline"
                    disabled={branchesLoading}
                    onClick={this.handleTriggerRepModal(deskTypes.SALES)}
                  >
                    {I18n.t('COMMON.SALES')}
                  </button>
                </If>
                <If condition={auth.department !== departments.SALES}>
                  <button
                    type="button"
                    className="btn btn-default-outline"
                    disabled={branchesLoading}
                    onClick={this.handleTriggerRepModal(deskTypes.RETENTION)}
                  >
                    {I18n.t('COMMON.RETENTION')}
                  </button>
                </If>
                <If condition={(auth.role === roles.ROLE4
                  && [departments.ADMINISTRATION, departments.SALES, departments.RETENTION].includes(auth.department))
                  || auth.department === departments.CS}
                >
                  <button
                    type="button"
                    className="btn btn-default-outline"
                    onClick={this.handleTriggerMoveModal}
                  >
                    {I18n.t('COMMON.MOVE')}
                  </button>
                </If>
              </PermissionContent>
            </div>
          </If>
        </div>

        <UserGridFilter
          desks={desks}
          teams={teams}
          isFetchingProfileData={loading}
          initialValues={filterSetValues}
          onReset={this.handleFilterReset}
          branchesLoading={branchesLoading}
          onSubmit={this.handleFiltersChanged}
        />

        <div className="card-body card-grid-multiselect">
          <GridView
            tableClassName="table-hovered"
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.page}
            last={entities.last}
            lazyLoad={!searchLimit}
            multiselect
            selectedRows={selectedRows}
            allRowsSelected={allRowsSelected}
            touchedRowsIds={touchedRowsIds}
            onAllRowsSelect={this.handleAllRowsSelect}
            onRowSelect={this.handleSelectRow}
            showNoResults={!loading && entities.content.length === 0}
            onRowClick={this.handlePlayerClick}
            loading={loading && entities.content.length === 0}
          >
            {columns().map(({ name, header, render }) => (
              <GridViewColumn
                key={name}
                name={name}
                header={header}
                render={render}
              />
            ))}
          </GridView>
        </div>
      </div>
    );
  }
}

export default List;
