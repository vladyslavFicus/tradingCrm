import React from 'react';
import I18n from 'i18n-js';
import { Config, usePermission } from '@crm/common';
import { Operator } from '__generated__/types';
import OperatorHierarchyUserType from './components/OperatorHierarchyUserType';
import OperatorHierarchyBranches from './components/OperatorHierarchyBranches';
import './OperatorHierarchy.scss';

type Props = {
  operator: Operator,
  isCurrentOperator: boolean,
  onRefetch: () => void,
};

const OperatorHierarchy = (props: Props) => {
  const { operator, isCurrentOperator, onRefetch } = props;

  const permission = usePermission();

  const allowUpdateBranch = permission.allows(Config.permissions.HIERARCHY.UPDATE_USER_BRANCH);

  return (
    <div className="OperatorHierarchy">
      <div className="OperatorHierarchy__title">
        {I18n.t('OPERATORS.PROFILE.HIERARCHY.LABEL')}
      </div>

      <OperatorHierarchyUserType
        operator={operator}
        allowToUpdateHierarchy={allowUpdateBranch && !isCurrentOperator}
        onRefetch={onRefetch}
      />

      <hr />

      <div className="OperatorHierarchy__title">
        {I18n.t('OPERATORS.PROFILE.HIERARCHY.BRANCHES')}
      </div>

      <OperatorHierarchyBranches
        operator={operator}
        allowToUpdateHierarchy={allowUpdateBranch && !isCurrentOperator}
      />
    </div>
  );
};

export default React.memo(OperatorHierarchy);
