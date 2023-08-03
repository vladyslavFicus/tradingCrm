import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components/Buttons';
import useOperatorsList from 'routes/Operators/routes/hooks/useOperatorsList';
import OperatorsGridFilter from './components/OperatorsGridFilter';
import OperatorsGrid from './components/OperatorsGrid';
import './OperatorsList.scss';

const OperatorsList = () => {
  const {
    allowCreateOperator,
    loading,
    content,
    last,
    totalElements,
    refetch,
    handleFetchMore,
    handleSort,
    handleOpenCreateOperatorModal,
  } = useOperatorsList();

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

export default React.memo(OperatorsList);
