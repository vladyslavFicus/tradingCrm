import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import AddBranchManagerModal from 'modals/AddBranchManagerModal';
import RemoveBranchManagerModal from 'modals/RemoveBranchManagerModal';
import { Link } from 'components/Link';
import PermissionContent from 'components/PermissionContent';
import Uuid from 'components/Uuid';
import { Button } from 'components/UI';
import BranchHeaderPlaceholder from './components/BranchHeaderPlaceholder';
import getBranchManagerQuery from './graphql/getBranchManagerQuery';
import './BranchHeader.scss';

const branchUuidPrefixes = {
  OFFICE: 'OF',
  TEAM: 'TE',
  DESC: 'DE',
};

class BranchHeader extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    branchId: PropTypes.string.isRequired,
    branchData: PropTypes.shape({
      uuid: PropTypes.string,
      name: PropTypes.string,
      country: PropTypes.string,
      branchType: PropTypes.string,
    }).isRequired,
    branchManagers: PropTypes.shape({
      data: PropTypes.shape({
        branchInfo: PropTypes.shape({
          managers: PropTypes.arrayOf(PropTypes.string),
          operators: PropTypes.arrayOf(PropTypes.shape({
            uuid: PropTypes.string,
            fullName: PropTypes.string,
          })),
        }),
      }),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      addBranchManagerModal: PropTypes.modalType,
      removeBranchManagerModal: PropTypes.modalType,
    }).isRequired,
  };

  refetchBranchManagerInfo = () => {
    this.props.branchManagers.refetch();
  };

  handleOpenConfirmActionModal = (operators) => {
    const {
      branchData: { uuid, name, branchType },
      modals: { removeBranchManagerModal },
    } = this.props;

    removeBranchManagerModal.show({
      title: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.TITLE'),
      description: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.DESCRIPTION'),
      branch: { uuid, name, branchType },
      operators,
      onSuccess: this.refetchBranchManagerInfo,
    });
  };

  handleOpenManagerModal = () => {
    const {
      branchData: { uuid, name, branchType },
      modals: { addBranchManagerModal },
      branchManagers,
    } = this.props;
    const managerData = branchManagers?.data?.branchInfo || {};

    addBranchManagerModal.show({
      title: I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.ADD_TITLE'),
      description: I18n.t(
        `MODALS.ADD_BRANCH_MANAGER_MODAL.ADD_TO_${branchType}`,
        { branch: name },
      ),
      branch: { uuid, name, branchType },
      managers: managerData.managers,
      onSuccess: () => this.refetchBranchManagerInfo(),
    });
  };

  render() {
    const {
      branchData: {
        name,
        country,
        branchType,
      },
      branchManagers,
      branchId,
      loading,
    } = this.props;

    const managerData = branchManagers?.data?.branchInfo || {};
    return (
      <div className="BranchHeader">
        <div className="BranchHeader__left">
          <BranchHeaderPlaceholder ready={!loading}>
            <div className="BranchHeader__branch">
              <div className="BranchHeader__branch-name">{name}</div>
              <div className="BranchHeader__branch-uuid">
                <Uuid uuid={branchId} uuidPrefix={branchUuidPrefixes[branchType]} /> - {country}
              </div>
            </div>

            <div className="BranchHeader__manager">
              <Choose>
                <When condition={managerData.operators}>
                  <span>{I18n.t('BRANCH_MANAGER_INFO.MANAGED_BY')}: </span>
                  {managerData.operators.map(({ uuid, fullName }) => (
                    <div key={uuid}>
                      <Link
                        className="BranchHeader__manager-link"
                        to={`/operators/${uuid}/profile`}
                      >
                        {fullName}
                      </Link>
                    </div>
                  ))}
                </When>
                <Otherwise>
                  <span>{I18n.t('BRANCH_MANAGER_INFO.NO_MANAGER')}</span>
                </Otherwise>
              </Choose>
            </div>
          </BranchHeaderPlaceholder>
        </div>

        <If condition={!loading}>
          <div className="BranchHeader__right">
            <If condition={managerData.operators}>
              <PermissionContent permissions={permissions.HIERARCHY.REMOVE_BRAND_MANAGER}>
                <Button
                  commonOutline
                  className="BranchHeader__button"
                  onClick={() => this.handleOpenConfirmActionModal(managerData.operators)}
                >
                  {I18n.t('COMMON.REMOVE_BRANCH_MANAGER')}
                </Button>
              </PermissionContent>
            </If>

            <PermissionContent permissions={permissions.HIERARCHY.ADD_BRAND_MANAGER}>
              <Button
                commonOutline
                className="BranchHeader__button"
                onClick={this.handleOpenManagerModal}
              >
                {I18n.t('COMMON.ADD_MANAGER_TO_BRANCH')}
              </Button>
            </PermissionContent>
          </div>
        </If>
      </div>
    );
  }
}

export default compose(
  withRequests({
    branchManagers: getBranchManagerQuery,
  }),
  withModals({
    addBranchManagerModal: AddBranchManagerModal,
    removeBranchManagerModal: RemoveBranchManagerModal,
  }),
)(BranchHeader);
