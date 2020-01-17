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
import { withModals } from 'components/HighOrder';
import PermissionContent from 'components/PermissionContent';
import HierarchyInfoModal from 'components/HierarchyInfoModal';
import Placeholder from 'components/Placeholder';
import OfficesGridFilter from './OfficesGridFilter';
import OfficesGrid from './OfficesGrid';
import OfficeModal from './OfficeModal';

class List extends Component {
  static propTypes = {
    ...PropTypes.router,
    createOfficeMutation: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      officeModal: PropTypes.modalType,
      infoModal: PropTypes.modalType,
    }).isRequired,
  };

  handleFiltersChanged = (filters = {}) => {
    this.props.history.replace({ query: { filters } });
  };

  handleFilterReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  triggerOfficeModal = () => {
    const { modals: { officeModal } } = this.props;

    officeModal.show({ onSubmit: values => this.handleAddOffice(values) });
  };

  handleAddOffice = async (variables) => {
    const {
      createOfficeMutation,
      offices: { refetch },
      modals: { officeModal, infoModal },
    } = this.props;

    const { data: { hierarchy: { createOffice: { data, error } } } } = await createOfficeMutation({ variables });

    refetch();
    officeModal.hide();
    infoModal.show({
      header: I18n.t('HIERARCHY.INFO_MODAL.OFFICE_BODY'),
      status: error.length === 0
        ? I18n.t('COMMON.SUCCESS')
        : I18n.t('COMMON.FAIL'),
      data,
      error,
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
                onClick={this.triggerOfficeModal}
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
  withModals({
    officeModal: OfficeModal,
    infoModal: HierarchyInfoModal,
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
