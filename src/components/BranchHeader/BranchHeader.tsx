import React from 'react';
import I18n from 'i18n-js';
import { HierarchyBranch } from '__generated__/types';
import { Button } from 'components/Buttons';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import permissions from 'config/permissions';
import AddBranchManagerModal, { AddBranchManagerModalProps } from 'modals/AddBranchManagerModal';
import RemoveBranchManagerModal, { RemoveBranchManagerModalProps } from 'modals/RemoveBranchManagerModal';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import Placeholder from 'components/Placeholder';
import { useGetBranchManagerQuery } from './graphql/__generated__/GetBranchManagerQuery';
import './BranchHeader.scss';

const branchUuidPrefixes: Record<string, string> = {
  OFFICE: 'OF',
  TEAM: 'TE',
  DESC: 'DE',
};

type Props = {
  branchId: string,
  branchData: HierarchyBranch,
};

const BranchHeader = (props: Props) => {
  const {
    branchId,
    branchData: {
      uuid,
      name,
      country,
      branchType,
    },
  } = props;

  const permission = usePermission();

  const allowRemoveBrandManager = permission.allows(permissions.HIERARCHY.REMOVE_BRAND_MANAGER);
  const allowAddBrandManager = permission.allows(permissions.HIERARCHY.ADD_BRAND_MANAGER);

  // ===== Modals ===== //
  const addBranchManagerModal = useModal<AddBranchManagerModalProps>(AddBranchManagerModal);
  const removeBranchManagerModal = useModal<RemoveBranchManagerModalProps>(RemoveBranchManagerModal);

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
      branch: { uuid },
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
          ready
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

      <div className="BranchHeader__right">
        <If condition={operators.length > 0 && allowRemoveBrandManager}>
          <Button
            tertiary
            className="BranchHeader__button"
            data-testid="BranchHeader-removeBranchManagerButton"
            onClick={handleOpenConfirmActionModal}
          >
            {I18n.t('COMMON.REMOVE_BRANCH_MANAGER')}
          </Button>
        </If>

        <If condition={allowAddBrandManager}>
          <Button
            tertiary
            className="BranchHeader__button"
            data-testid="BranchHeader-addManagerToBranchButton"
            onClick={handleOpenManagerModal}
          >
            {I18n.t('COMMON.ADD_MANAGER_TO_BRANCH')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default React.memo(BranchHeader);
