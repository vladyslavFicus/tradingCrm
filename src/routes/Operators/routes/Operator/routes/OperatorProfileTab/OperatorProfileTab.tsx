import React from 'react';
import compose from 'compose-function';
import { Operator } from '__generated__/types';
import { withStorage } from 'providers/StorageProvider';
import OperatorPersonal from './components/OperatorPersonal';
import OperatorDepartments from './components/OperatorDepartments';
import OperatorHierarchy from './components/OperatorHierarchy';
import './OperatorProfileTab.scss';

type Auth = {
  department: string,
  role: string,
  uuid: string,
};

type Props = {
  auth: Auth,
  operator: Operator,
  onRefetch: () => {},
};

const OperatorProfileTab = (props: Props) => {
  const { auth, operator, onRefetch } = props;

  const isCurrentOperator = auth.uuid === operator.uuid;

  return (
    <div className="OperatorProfileTab">
      <OperatorPersonal operator={operator} />

      <OperatorDepartments operator={operator} isCurrentOperator={isCurrentOperator} onRefetch={onRefetch} />

      <OperatorHierarchy operator={operator} isCurrentOperator={isCurrentOperator} onRefetch={onRefetch} />
    </div>
  );
};

export default compose(
  React.memo,
  withStorage(['auth']),
)(OperatorProfileTab);
