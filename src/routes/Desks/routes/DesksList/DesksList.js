import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import getDesksQuery from './graphql/getDesksQuery';
import getOfficesQuery from './graphql/getOfficesQuery';
import CreateDeskModal from './components/CreateDeskModal';
import DesksGridFilter from './components/DesksGridFilter';
import DesksGrid from './components/DesksGrid';
import './DesksList.scss';

class DesksList extends PureComponent {
  static propTypes = {
    desksData: PropTypes.branchHierarchyResponse.isRequired,
    officesData: PropTypes.userBranchHierarchyResponse.isRequired,
    modals: PropTypes.shape({
      createDeskModal: PropTypes.modalType,
    }).isRequired,
  };

  handleOpenAddDeskModal = () => {
    const {
      desksData,
      officesData,
      modals: {
        createDeskModal,
      },
    } = this.props;

    createDeskModal.show({
      officesData,
      onSuccess: () => {
        desksData.refetch();
      },
    });
  };

  render() {
    const { desksData, officesData } = this.props;

    const totalCount = desksData?.data?.branch?.length;

    return (
      <div className="DesksList">
        <div className="DesksList__header">
          <div className="DesksList__title">{totalCount} {I18n.t('DESKS.DESKS')}</div>
          <PermissionContent permissions={permissions.HIERARCHY.CREATE_BRANCH}>
            <Button
              onClick={this.handleOpenAddDeskModal}
              commonOutline
            >
              {I18n.t('DESKS.ADD_DESK')}
            </Button>
          </PermissionContent>
        </div>

        <DesksGridFilter
          officesData={officesData}
          handleRefetch={desksData.refetch}
        />

        <DesksGrid desksData={desksData} />
      </div>
    );
  }
}

export default compose(
  withRequests({
    desksData: getDesksQuery,
    officesData: getOfficesQuery,
  }),
  withModals({
    createDeskModal: CreateDeskModal,
  }),
)(DesksList);
