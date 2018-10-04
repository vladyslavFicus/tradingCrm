import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import history from '../../../../../router/history';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import Placeholder from '../../../../../components/Placeholder';
import Uuid from '../../../../../components/Uuid';
import DesksGridFilter from './DesksGridFilter';

class List extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    createDesk: PropTypes.func.isRequired,
    userBranchHierarchy: PropTypes.shape({
      userBranchHierarchy: PropTypes.shape({
        data: PropTypes.shape({
          OFFICE: PropTypes.arrayOf(PropTypes.branchHierarchyType),
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
    auth: PropTypes.shape({
      isAdministration: PropTypes.bool.isRequired,
      operatorHierarchy: PropTypes.object,
    }).isRequired,
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  handleDeskClick = ({ id }) => {
    history.push(`/desks/${id}`);
  };

  triggerOfficeModal = () => {
    const {
      modals: { deskModal },
      userBranchHierarchy: { userBranchHierarchy: { data: { OFFICE = [] } } },
    } = this.props;

    deskModal.show({
      onSubmit: values => this.handleAddDesk(values),
      offices: OFFICE,
    });
  }

  handleAddDesk = async (variables) => {
    const {
      createDesk,
      // leads: { refetch },
      modals: { deskModal, infoModal },
      auth,
    } = this.props;

    const { userType, uuid: operatorId, parentBranches: operatorBranches = [] } = get(auth, 'operatorHierarchy');

    const { data: { hierarchy: { createDesk: { data, error } } } } = await createDesk(
      {
        variables: {
          operatorId,
          userType,
          operatorBranches,
          ...variables,
        },
      }
    );

    // refetch();
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

  renderOffice = data => (
    <Fragment>
      <div className="font-weight-700">
        {data.name} {data.surname}
      </div>
      <div className="font-size-11">
        <Uuid uuid={data.id} uuidPrefix="OF" />
      </div>
    </Fragment>
  );

  renderDesk = data => (
    <Fragment>
      <div className="font-weight-700">
        {data.name} {data.surname}
      </div>
      <div className="font-size-11">
        <Uuid uuid={data.id} uuidPrefix="DE" />
      </div>
    </Fragment>
  );

  renderDeskType = ({ deskType }) => (
    <div className="font-weight-700">
      {deskType}
    </div>
  );

  renderDefaultDesk = ({ defaultDesk }) => (
    <div className="font-weight-700">
      {defaultDesk}
    </div>
  );

  render() {
    const {
      locale,
      // leads: {
      //   loading,
      //   leads,
      // },
      userBranchHierarchy: {
        userBranchHierarchy,
        loading: userBranchHierarchyLoading,
      },
      location: { query },
      auth: { isAdministration },
    } = this.props;

    const loading = false;

    const entities = get(this.props, 'leads.data') || { content: [] };
    const offices = get(userBranchHierarchy, 'data.OFFICE') || [];
    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            // ready={!loading && !!leads}
            ready
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
          <If condition={isAdministration}>
            <div className="ml-auto">
              <button
                className="btn btn-default-outline"
                onClick={this.triggerOfficeModal}
                disabled={userBranchHierarchyLoading}
                type="button"
              >
                {I18n.t('DESKS.ADD_DESK')}
              </button>
            </div>
          </If>
        </div>

        <DesksGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          offices={offices}
          officesLoading={userBranchHierarchyLoading}
        />

        <div className="card-body">
          <GridView
            dataSource={entities.content}
            last
            locale={locale}
            showNoResults={!loading && entities.content.length === 0}
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
