import React from 'react';
import { useStorageState, Auth } from '@crm/common';
import { Operator } from '__generated__/types';
import OperatorPersonal from './components/OperatorPersonal';
import OperatorDepartments from './components/OperatorDepartments';
import OperatorHierarchy from './components/OperatorHierarchy';
import './OperatorProfileTab.scss';

type Props = {
  operator: Operator,
  onRefetch: () => void,
};

const OperatorProfileTab = (props: Props) => {
  const { operator, onRefetch } = props;

  // ===== Storage ===== //
  const [{ uuid }] = useStorageState<Auth>('auth');

  const isCurrentOperator = uuid === operator.uuid;

  return (
    <div className="OperatorProfileTab">
      <OperatorPersonal operator={operator} />

      <OperatorDepartments operator={operator} isCurrentOperator={isCurrentOperator} onRefetch={onRefetch} />

      <OperatorHierarchy operator={operator} isCurrentOperator={isCurrentOperator} onRefetch={onRefetch} />
    </div>
  );
};

export default React.memo(OperatorProfileTab);
