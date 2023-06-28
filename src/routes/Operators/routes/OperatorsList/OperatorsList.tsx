import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import compose from 'compose-function';
import { cloneDeep, set } from 'lodash';
import I18n from 'i18n-js';
import { Modal, Sorts, State } from 'types';
import { withModals } from 'hoc';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { Button } from 'components/Buttons';
import CreateOperatorModal from 'modals/CreateOperatorModal';
import ExistingOperatorModal from 'modals/ExistingOperatorModal';
import { OPERATORS_SORT } from './constants';
import OperatorsGridFilter from './components/OperatorsGridFilter';
import OperatorsGrid from './components/OperatorsGrid';
import { OperatorsQueryVariables, useOperatorsQuery } from './graphql/__generated__/OperatorsQuery';
import './OperatorsList.scss';

// TODO After rewriting CreateOperatorModal & ExistingOperatorModal
// use useModal hook and use FormValues type for ExistingOperatorModal from CreateOperatorModal
type FormValues = {};

type Props = {
  modals : {
    createOperatorModal: Modal,
    existingOperatorModal: Modal,
  },
};

const OperatorsList = (props: Props) => {
  const { modals: { createOperatorModal, existingOperatorModal } } = props;

  const { state } = useLocation<State<OperatorsQueryVariables>>();

  const history = useHistory();

  const permission = usePermission();

  const allowCreateOperator = permission.allows(permissions.OPERATORS.CREATE);

  const { data, loading, variables = {}, refetch, fetchMore } = useOperatorsQuery({
    variables: {
      ...state?.filters as OperatorsQueryVariables,
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts?.length ? state.sorts : OPERATORS_SORT,
      },
    },
  });

  const { content = [], last = true, totalElements = 0, page = 0 } = data?.operators || {};

  // ===== Handlers ===== //
  const handleFetchMore = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as OperatorsQueryVariables), 'page.from', page + 1),
      });
    }
  };

  const handleSort = (sorts: Sorts) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handleOpenCreateOperatorModal = () => {
    createOperatorModal.show({
      onExists: (values: FormValues) => existingOperatorModal.show(values),
    });
  };

  return (
    <div className="OperatorsList">
      <div className="OperatorsList__header">
        <div className="OperatorsList__header-left">
          <div className="OperatorsList__title">
            <strong>{totalElements} </strong>

            {I18n.t('COMMON.OPERATORS_FOUND')}
          </div>
        </div>

        <If condition={allowCreateOperator}>
          <div className="OperatorsList__header-right">
            <Button
              data-testid="OperatorsList-createOperatorButton"
              onClick={handleOpenCreateOperatorModal}
              tertiary
            >
              {I18n.t('OPERATORS.CREATE_OPERATOR_BUTTON')}
            </Button>
          </div>
        </If>
      </div>

      <OperatorsGridFilter onRefetch={refetch} />

      <OperatorsGrid
        content={content}
        loading={loading}
        last={last}
        onFetchMore={handleFetchMore}
        onSort={handleSort}
      />
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    createOperatorModal: CreateOperatorModal,
    existingOperatorModal: ExistingOperatorModal,
  }),
)(OperatorsList);
