import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import { HierarchyBranch } from '__generated__/types';
import Link from 'components/Link';
import Uuid from 'components/Uuid';
import Placeholder from 'components/Placeholder';
import { branchUuidPrefixes } from 'components/BranchHeader/constants';
import useBranchHeader from 'components/BranchHeader/hooks/useBranchHeader';
import './BranchHeader.scss';

type Props = {
  branchId: string,
  branchData: HierarchyBranch,
};

const BranchHeader = (props: Props) => {
  const {
    branchId,
    branchData,
    branchData: {
      uuid,
      name,
      country,
      branchType,
    },
  } = props;

  const {
    allowRemoveBrandManager,
    allowAddBrandManager,
    handleOpenConfirmActionModal,
    handleOpenManagerModal,
    operators,
  } = useBranchHeader({ branchId, branchData });

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
