import React, { Component, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import history from 'router/history';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import GridView, { GridViewColumn } from 'components/GridView';
import Placeholder from 'components/Placeholder';
import Uuid from 'components/Uuid';
import { deskTypes } from './constants';
import DesksGridFilter from './DesksGridFilter';

class List extends Component {
  static propTypes = {
    createDesk: PropTypes.func.isRequired,
    userBranchHierarchy: PropTypes.shape({
      hierarchy: PropTypes.shape({
        userBranchHierarchy: PropTypes.shape({
          data: PropTypes.shape({
            OFFICE: PropTypes.arrayOf(PropTypes.branchHierarchyType),
          }),
          error: PropTypes.object,
        }),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        filters: PropTypes.object,
      }),
    }).isRequired,
    modals: PropTypes.shape({
      deskModal: PropTypes.modalType,
      infoModal: PropTypes.modalType,
    }).isRequired,
    desks: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      hierarchy: PropTypes.shape({
        branchHierarchy: PropTypes.shape({
          error: PropTypes.object,
          data: PropTypes.arrayOf(PropTypes.object),
        }),
      }),
    }).isRequired,
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  handleDeskClick = ({ desk: { uuid }, desk: { deskType } }) => {
    history.push(`/desks/${uuid}/rules/${deskType.toLowerCase()}-rules`);
  };

  triggerOfficeModal = () => {
    const {
      modals: { deskModal },
      userBranchHierarchy: { hierarchy: { userBranchHierarchy: { data: { OFFICE } } } },
    } = this.props;

    deskModal.show({
      onSubmit: values => this.handleAddDesk(values),
      offices: OFFICE || [],
    });
  }

  handleAddDesk = async (variables) => {
    const {
      createDesk,
      desks: { refetch },
      modals: { deskModal, infoModal },
    } = this.props;

    const { data: { hierarchy: { createDesk: { data, error } } } } = await createDesk({ variables });

    refetch();
    deskModal.hide();
    infoModal.show({
      header: I18n.t('HIERARCHY.INFO_MODAL.DESK_BODY'),
      status: error.length === 0
        ? I18n.t('COMMON.SUCCESS')
        : I18n.t('COMMON.FAIL'),
      data,
      error,
    });
  };

  renderOffice = ({ office }) => (
    <Choose>
      <When condition={office}>
        <div className="font-weight-700">
          {office.name}
        </div>
        <div className="font-size-11">
          <Uuid uuid={office.uuid} uuidPrefix="OF" />
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderDesk = ({ desk: { name, uuid } }) => (
    <Fragment>
      <div className="font-weight-700 cursor-pointer">
        {name}
      </div>
      <div className="font-size-11">
        <Uuid uuid={uuid} uuidPrefix="DE" />
      </div>
    </Fragment>
  );

  renderDeskType = ({ desk: { deskType } }) => (
    <div className="font-weight-700">
      {I18n.t(deskTypes.find(({ value }) => value === deskType).label)}
    </div>
  );

  renderDefaultDesk = ({ desk: { isDefault } }) => (
    <div className="font-weight-700">
      {isDefault ? I18n.t('COMMON.YES') : I18n.t('COMMON.NO')}
    </div>
  );

  render() {
    const {
      desks: {
        loading,
        hierarchy: desks,
      },
      userBranchHierarchy: { hierarchy, loading: userBranchHierarchyLoading },
      location: { query },
    } = this.props;

    const entities = get(desks, 'branchHierarchy.data') || [];
    const offices = get(hierarchy, 'userBranchHierarchy.data.OFFICE') || [];
    const error = get(desks, 'branchHierarchy.error') || get(hierarchy, 'hierarchyUsersByType.error');
    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading && !!desks}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <span className="font-size-20">
              {I18n.t('DESKS.DESKS')}
            </span>
          </Placeholder>
          <PermissionContent permissions={permissions.HIERARCHY.CREATE_BRANCH}>
            <div className="ml-auto">
              <button
                className="btn btn-default-outline"
                onClick={this.triggerOfficeModal}
                disabled={userBranchHierarchyLoading || error}
                type="button"
              >
                {I18n.t('DESKS.ADD_DESK')}
              </button>
            </div>
          </PermissionContent>
        </div>

        <DesksGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions || error}
          offices={offices}
          officesLoading={userBranchHierarchyLoading}
        />

        <div className="card-body">
          <GridView
            dataSource={entities}
            last
            showNoResults={!loading && entities.length === 0}
            onRowClick={this.handleDeskClick}
          >
            <GridViewColumn
              name="desk"
              header={I18n.t('DESKS.GRID_HEADER.DESK')}
              render={this.renderDesk}
            />
            <GridViewColumn
              name="office"
              header={I18n.t('DESKS.GRID_HEADER.OFFICE')}
              render={this.renderOffice}
            />
            <GridViewColumn
              name="deskType"
              header={I18n.t('DESKS.GRID_HEADER.DESK_TYPE')}
              render={this.renderDeskType}
            />
            <GridViewColumn
              name="defaultDesk"
              header={I18n.t('DESKS.GRID_HEADER.DEFAULT_DESK')}
              render={this.renderDefaultDesk}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default List;
