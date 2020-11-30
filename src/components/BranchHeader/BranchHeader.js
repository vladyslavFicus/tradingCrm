import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import AddBranchManagerModal from 'modals/AddBranchManagerModal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Link } from 'components/Link';
import PermissionContent from 'components/PermissionContent';
import ProfileHeaderPlaceholder from 'components/ProfileHeaderPlaceholder';
import Uuid from 'components/Uuid';
import { Button } from 'components/UI';
import getBranchManagerQuery from './graphql/getBranchManagerQuery';
import removeBranchManagerMutation from './graphql/removeBranchManagerMutation';
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
    branchManager: PropTypes.shape({
      data: PropTypes.shape({
        branchInfo: PropTypes.shape({
          manager: PropTypes.string,
          operator: PropTypes.shape({
            fullName: PropTypes.string,
          }),
        }),
      }),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      addBranchManagerModal: PropTypes.modalType,
      removeManagerConfirmModal: PropTypes.modalType,
    }).isRequired,
    removeBranchManager: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  refetchBranchManagerInfo = () => {
    this.props.branchManager.refetch();
  };

  removeManager = async () => {
    const {
      notify,
      branchId,
      removeBranchManager,
      modals: { removeManagerConfirmModal },
    } = this.props;

    try {
      await removeBranchManager({ variables: { branchUuid: branchId } });

      notify({
        level: 'success',
        title: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.NOTIFICATIONS.SUCCEED.TITLE'),
        message: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.NOTIFICATIONS.SUCCEED.DESC'),
      });

      removeManagerConfirmModal.hide();
      this.refetchBranchManagerInfo();
    } catch {
      notify({
        level: 'error',
        title: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.NOTIFICATIONS.FAILED.TITLE'),
        message: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.NOTIFICATIONS.FAILED.DESC'),
      });
    }
  };

  handleOpenConfirmActionModal = () => {
    const {
      modals: { removeManagerConfirmModal },
    } = this.props;

    removeManagerConfirmModal.show({
      onSubmit: this.removeManager,
      modalTitle: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.TITLE'),
      actionText: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.DESCRIPTION'),
      submitButtonLabel: I18n.t('ACTIONS_LABELS.REMOVE'),
    });
  };

  handleOpenManagerModal = (modalType) => {
    const {
      branchData: { uuid, name, branchType },
      modals: { addBranchManagerModal },
    } = this.props;

    addBranchManagerModal.show({
      title: I18n.t(`MODALS.ADD_BRANCH_MANAGER_MODAL.${modalType}_TITLE`),
      description: I18n.t(
        `MODALS.ADD_BRANCH_MANAGER_MODAL.${modalType}_TO_${branchType}`,
        { branch: name },
      ),
      branch: { uuid, name, branchType },
      onSuccess: () => this.refetchBranchManagerInfo(),
    });
  };

  render() {
    const {
      branchData: { name, country, branchType },
      branchManager,
      branchId,
      loading,
    } = this.props;

    const managerData = get(branchManager, 'data.branchInfo') || {};

    return (
      <div className="BranchHeader">
        <div className="BranchHeader__left">
          <ProfileHeaderPlaceholder ready={!loading}>
            <div className="BranchHeader__branch">
              <div className="BranchHeader__branch-name">{name}</div>
              <div className="BranchHeader__branch-uuid">
                <Uuid uuid={branchId} uuidPrefix={branchUuidPrefixes[branchType]} /> - {country}
              </div>
            </div>

            <div className="BranchHeader__manager">
              <Choose>
                <When condition={managerData.manager}>
                  <span>{I18n.t('BRANCH_MANAGER_INFO.MANAGED_BY')}: </span>
                  <span>
                    <Link
                      className="BranchHeader__manager-link"
                      to={`/operators/${managerData.manager}/profile`}
                    >
                      {managerData.operator.fullName}
                    </Link>
                  </span>
                </When>
                <Otherwise>
                  <span>{I18n.t('BRANCH_MANAGER_INFO.NO_MANAGER')}</span>
                </Otherwise>
              </Choose>
            </div>
          </ProfileHeaderPlaceholder>
        </div>

        <If condition={!loading}>
          <div className="BranchHeader__right">
            <If condition={managerData.manager}>
              <PermissionContent permissions={permissions.HIERARCHY.REMOVE_BRAND_MANAGER}>
                <Button
                  commonOutline
                  className="BranchHeader__button"
                  onClick={this.handleOpenConfirmActionModal}
                >
                  {I18n.t('COMMON.REMOVE_BRANCH_MANAGER')}
                </Button>
              </PermissionContent>
            </If>

            <PermissionContent permissions={permissions.HIERARCHY.ADD_BRAND_MANAGER}>
              <Button
                commonOutline
                className="BranchHeader__button"
                onClick={() => this.handleOpenManagerModal(!managerData.manager ? 'ADD' : 'CHANGE')}
              >
                {I18n.t(!managerData.manager ? 'COMMON.ADD_MANAGER_TO_BRANCH' : 'COMMON.CHANGE_BRANCH_MANAGER')}
              </Button>
            </PermissionContent>
          </div>
        </If>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    branchManager: getBranchManagerQuery,
    removeBranchManager: removeBranchManagerMutation,
  }),
  withModals({
    addBranchManagerModal: AddBranchManagerModal,
    removeManagerConfirmModal: ConfirmActionModal,
  }),
)(BranchHeader);
