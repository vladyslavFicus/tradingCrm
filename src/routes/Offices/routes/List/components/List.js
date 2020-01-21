import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { TextRow } from 'react-placeholder/lib/placeholders';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { getBranchHierarchy } from 'graphql/queries/hierarchy';
import { createOffice } from 'graphql/mutations/hierarchy';
import PropTypes from 'constants/propTypes';
import { branchTypes } from 'constants/hierarchyTypes';
import permissions from 'config/permissions';
import { withModals, withNotifications } from 'components/HighOrder';
import PermissionContent from 'components/PermissionContent';
import Placeholder from 'components/Placeholder';
import OfficesGridFilter from './OfficesGridFilter';
import OfficesGrid from './OfficesGrid';
import AddOfficeModal from './AddOfficeModal';

class List extends Component {
  static propTypes = {
    ...PropTypes.router,
    createOfficeMutation: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      addOfficeModal: PropTypes.modalType,
      infoModal: PropTypes.modalType,
    }).isRequired,
  };

  handleFiltersChanged = (filters = {}) => {
    this.props.history.replace({ query: { filters } });
  };

  handleFilterReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  triggerAddOfficeModal = () => {
    const { modals: { addOfficeModal } } = this.props;

    addOfficeModal.show({
      onSubmit: values => this.handleAddOffice(values),
    });
  };

  handleAddOffice = async (variables) => {
    const {
      createOfficeMutation,
      offices: { refetch },
      modals: { addOfficeModal },
      notify,
    } = this.props;

    const { data: { hierarchy: { createOffice: { error } } } } = await createOfficeMutation({ variables });
    const hasError = error.length;

    refetch();
    addOfficeModal.hide();

    notify({
      level: hasError ? 'error' : 'success',
      title: hasError ? I18n.t('COMMON.FAIL') : I18n.t('COMMON.SUCCESS'),
      message: hasError
        ? I18n.t('MODALS.ADD_OFFICE_MODAL.NOTIFICATION.ERROR')
        : I18n.t('MODALS.ADD_OFFICE_MODAL.NOTIFICATION.SUCCESS'),
    });
  };

  render() {
    const {
      offices: {
        loading,
        hierarchy,
      },
    } = this.props;

    const officesList = get(hierarchy, 'branchHierarchy.data') || [];
    const error = get(hierarchy, 'branchHierarchy.error');

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading && !!hierarchy}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <span className="font-size-20">
              {I18n.t('OFFICES.OFFICES')}
            </span>
          </Placeholder>
          <PermissionContent permissions={permissions.HIERARCHY.CREATE_BRANCH}>
            <div className="ml-auto">
              <button
                className="btn btn-default-outline"
                onClick={this.triggerAddOfficeModal}
                disabled={error}
                type="button"
              >
                {I18n.t('OFFICES.ADD_OFFICE')}
              </button>
            </div>
          </PermissionContent>
        </div>

        <OfficesGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
        />

        <OfficesGrid
          isLoading={loading}
          officesList={officesList}
        />
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withModals({
    addOfficeModal: AddOfficeModal,
  }),
  graphql(createOffice, {
    name: 'createOfficeMutation',
  }),
  graphql(getBranchHierarchy, {
    name: 'offices',
    options: ({
      location: { query },
    }) => ({
      variables: {
        ...query && query.filters,
        branchType: branchTypes.OFFICE.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(List);
