import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get, omit } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { SubmissionError } from 'redux-form';
import { actionTypes as windowActionTypes } from 'redux/modules/window';
import history from 'router/history';
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

class List extends Component {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    countries: PropTypes.object.isRequired,
    auth: PropTypes.shape({
      brandId: PropTypes.string,
      uuid: PropTypes.string,
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
    hierarchyOperators: [],
  };

  getChildContext() {
    return {
      getApolloRequestState: this.handleGetRequestState,
    };
  }

  componentDidMount() {
    if (!window.isFrame) {
      window.addEventListener('message', ({ data, origin }) => {
        if (origin === window.location.origin) {
          if (typeof data === 'string') {
            const action = parseJson(data, null);

            if (
              action
              && action.type === windowActionTypes.UPDATE_CLIENT_LIST
              && this.props.profiles
            ) {
              this.props.profiles.refetch();
            }
          }
        }
      });
    }
  }

  componentWillUnmount() {
    this.handleFilterReset();
  }

  setDesksTeamsOperators = (hierarchyOperators) => {
    this.setState({ hierarchyOperators });
  };

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

  handlePlayerClick = ({ playerUUID }) => {
    window.open(`/clients/${playerUUID}/profile`, '_blank');
  };

  handleSelectRow = (condition, index, touchedRowsIds) => {
    const { profiles: { profiles: { data: { content } } } } = this.props;

    this.setState((state) => {
      const selectedRows = [...state.selectedRows];

      if (condition) {
        selectedRows.push(content[index].playerUUID);
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

    const clients = getClientsData(this.state, totalElements, { type }, content);

    representativeModal.show({
      type,
      clients,
      configs: {
        allRowsSelected,
        totalElements,
        multiAssign: true,
        ...query && { searchParams: { ...omit(query.filters, ['size']) } },
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
      profiles: { profiles: { data: { content, totalElements } } },
    } = this.props;
    const { selectedRows } = this.state;

    moveModal.show({
      onSubmit: this.handleBulkMove,
      clientsSelected: selectedRows.length,
      selectedData: {
        ...this.state,
        content,
        totalElements,
      },
    });
  };

  handleBulkMove = async ({ aquisitionStatus }) => {
    const {
      notify,
      bulkRepresentativeUpdate,
      location: { query },
      profiles: { profiles: { data: { content, totalElements } } },
      modals: { moveModal },
    } = this.props;
    const { allRowsSelected } = this.state;

    const type = aquisitionStatus;
    const isMoveAction = true;
    const clients = getClientsData(this.state, totalElements, { type, isMoveAction }, content);

    const { data: { clients: { bulkRepresentativeUpdate: { error } } } } = await bulkRepresentativeUpdate({
      variables: {
        clients,
        isMoveAction,
        type,
        allRowsSelected,
        totalElements,
        ...query && { searchParams: omit(query.filters, ['desks', 'teams', 'size']) },
      },
    });

    if (error) {
      // when we try to move clients, when they don't have assigned {{type}} representative
      // GQL will return exact this error and we catch it to show custom message
      const condition = error.error && error.error === 'clients.bulkUpdate.moveForbidden';

      notify({
        level: 'error',
        title: I18n.t('COMMON.BULK_UPDATE_FAILED'),
        message: condition
          ? I18n.t(error.error, { type })
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });

      if (condition) {
        throw new SubmissionError({
          _error: I18n.t('clients.bulkUpdate.detailedTypeError', { type }),
        });
      }
    } else {
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS.ACQUISITION_STATUS_UPDATED'),
      });

      this.handleSuccessListUpdate();
      moveModal.hide();
    }
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
            rowClassName={({ tradingProfile }) => !tradingProfile && 'disabled'}
            loading={loading && entities.content.length === 0}
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

export default List;
