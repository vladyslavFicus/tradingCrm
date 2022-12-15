import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import CreateOfficeModal from 'modals/CreateOfficeModal';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import OfficesGridFilter from './components/OfficesGridFilter';
import OfficesGrid from './components/OfficesGrid';
import OfficesQuery from './graphql/OfficesQuery';
import './OfficesList.scss';

class OfficesList extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    officesData: PropTypes.branchHierarchyResponse.isRequired,
    modals: PropTypes.shape({
      createOfficeModal: PropTypes.modalType,
    }).isRequired,
  };

  triggerCreateOfficeModal = () => {
    const {
      modals: { createOfficeModal },
      officesData: { refetch },
    } = this.props;

    createOfficeModal.show({
      onSuccess: refetch,
    });
  };

  render() {
    const { officesData } = this.props;

    const totalCount = officesData?.data?.branch?.length;

    return (
      <div className="OfficesList">
        <div className="OfficesList__header">
          <div className="OfficesList__title">
            <strong>{totalCount} </strong>
            {I18n.t('OFFICES.OFFICES')}
          </div>

          <PermissionContent permissions={permissions.HIERARCHY.CREATE_BRANCH}>
            <div className="OfficesList__actions">
              <Button
                tertiary
                onClick={this.triggerCreateOfficeModal}
              >
                {I18n.t('OFFICES.ADD_OFFICE')}
              </Button>
            </div>
          </PermissionContent>
        </div>

        <OfficesGridFilter handleRefetch={officesData.refetch} />
        <OfficesGrid officesData={officesData} />
      </div>
    );
  }
}

export default compose(
  withModals({
    createOfficeModal: CreateOfficeModal,
  }),
  withRequests({
    officesData: OfficesQuery,
  }),
)(OfficesList);
