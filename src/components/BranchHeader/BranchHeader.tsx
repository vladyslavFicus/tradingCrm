import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal } from 'types';
import permissions from 'config/permissions';
import AddBranchManagerModal from 'modals/AddBranchManagerModal';
import RemoveBranchManagerModal from 'modals/RemoveBranchManagerModal';
import { Link } from 'components/Link';
import PermissionContent from 'components/PermissionContent';
import Uuid from 'components/Uuid';
import Placeholder from 'components/Placeholder';
import { Button } from 'components/UI';
import { useGetBranchManagerQuery } from './graphql/__generated__/GetBranchManagerQuery';
import './BranchHeader.scss';

const branchUuidPrefixes: Record<string, string> = {
  OFFICE: 'OF',
  TEAM: 'TE',
  DESC: 'DE',
};

type BranchData = {
  uuid: string,
  name: string,
  country: string,
  branchType: string,
};

type Props = {
  loading: boolean,
  branchId: string,
  branchData: BranchData,
  modals: {
    addBranchManagerModal: Modal,
    removeBranchManagerModal: Modal,
  },
};

const BranchHeader = (props: Props) => {
  const {
    loading,
    branchId,
    branchData: {
      uuid,
      name,
      country,
      branchType,
    },
    modals: {
      addBranchManagerModal,
      removeBranchManagerModal,
    },
  } = props;

  // ===== Requests ===== //
  const branchManagerQuery = useGetBranchManagerQuery({
    variables: { branchId },
    fetchPolicy: 'network-only',
  });

  const branchInfo = branchManagerQuery?.data?.branchInfo;
  const managers = branchInfo?.managers || [];
  const operators = branchInfo?.operators || [];

  const refetchBranchManagerInfo = () => {
    branchManagerQuery.refetch();
  };

  // ===== Handlers ===== //
  const handleOpenConfirmActionModal = () => {
    removeBranchManagerModal.show({
      title: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.TITLE'),
      description: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.DESCRIPTION'),
      branch: { uuid, name, branchType },
      operators,
      onSuccess: refetchBranchManagerInfo,
    });
  };

  const handleOpenManagerModal = () => {
    addBranchManagerModal.show({
      title: I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.ADD_TITLE'),
      description: I18n.t(
        `MODALS.ADD_BRANCH_MANAGER_MODAL.ADD_TO_${branchType}`,
        { branch: name },
      ),
      branch: { uuid, name, branchType },
      managers,
      onSuccess: refetchBranchManagerInfo,
    });
  };

  return (
    <div className="BranchHeader">
      <div className="BranchHeader__left">
        <Placeholder
          ready={!loading}
          rows={[{ width: 220, height: 25 }, { width: 220, height: 12 }, { width: 220, height: 12 }]}
        >
          <div className="BranchHeader__branch">
            <div className="BranchHeader__branch-name">{name}</div>
            <div className="BranchHeader__branch-uuid">
              <Uuid uuid={branchId} uuidPrefix={branchUuidPrefixes[branchType]} /> - {country}
            </div>
          </div>

          <div className="BranchHeader__manager">
            <Choose>
              <When condition={operators.length > 0}>
                <span>{I18n.t('BRANCH_MANAGER_INFO.MANAGED_BY')}: </span>
                {operators.map(operator => (
                  <div key={uuid}>
                    <Link
                      className="BranchHeader__manager-link"
                      to={`/operators/${operator.uuid}/profile`}
                    >
                      {operator.fullName}
                    </Link>
                  </div>
                ))}
              </When>

              <Otherwise>
                <span>{I18n.t('BRANCH_MANAGER_INFO.NO_MANAGER')}</span>
              </Otherwise>
            </Choose>
          </div>
        </Placeholder>
      </div>

      <If condition={!loading}>
        <div className="BranchHeader__right">
          <If condition={operators.length > 0}>
            <PermissionContent permissions={permissions.HIERARCHY.REMOVE_BRAND_MANAGER}>
              <Button
                tertiary
                className="BranchHeader__button"
                onClick={handleOpenConfirmActionModal}
              >
                {I18n.t('COMMON.REMOVE_BRANCH_MANAGER')}
              </Button>
            </PermissionContent>
          </If>

          <PermissionContent permissions={permissions.HIERARCHY.ADD_BRAND_MANAGER}>
            <Button
              tertiary
              className="BranchHeader__button"
              onClick={handleOpenManagerModal}
            >
              {I18n.t('COMMON.ADD_MANAGER_TO_BRANCH')}
            </Button>
          </PermissionContent>
        </div>
      </If>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    addBranchManagerModal: AddBranchManagerModal,
    removeBranchManagerModal: RemoveBranchManagerModal,
  }),
)(BranchHeader);
