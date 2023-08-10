import React from 'react';
import I18n from 'i18n-js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import { Config, usePermission, useModal } from '@crm/common';
import { Button } from 'components';
import { TradingEngine__OperatorStatuses__Enum as OperatorStatusesEnum } from '__generated__/types';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { Sort, State } from 'types';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import NewOperatorModal, { NewOperatorModalProps } from 'routes/TE/modals/NewOperatorModal';
import { tradingEngineTabs } from '../../constants';
import OperatorsFilter from './components/OperatorsFilter';
import {
  OperatorsQueryVariables,
  useOperatorsQuery,
  OperatorsQuery,
} from './graphql/__generated__/OperatorGroupsQuery';
import './Operators.scss';

type Operator = ExtractApolloTypeFromPageable<OperatorsQuery['tradingEngine']['operators']>;

const Operators = () => {
  const state = useLocation().state as State<OperatorsQueryVariables['args']>;
  const navigate = useNavigate();

  const permission = usePermission();

  const newOperatorModal = useModal<NewOperatorModalProps>(NewOperatorModal);

  const operatorsQuery = useOperatorsQuery({
    variables: {
      args: {
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });
  const { data } = operatorsQuery;
  const page = data?.tradingEngine.operators.number || 0;
  const { content = [], last = true, totalElements } = data?.tradingEngine.operators || {};

  const handlePageChanged = useHandlePageChanged({
    query: operatorsQuery,
    page,
    path: 'page.from',
  });

  const handleSort = (sorts: Sort[]) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handleNewOperatorClick = () => newOperatorModal.show({
    onSuccess: operatorsQuery.refetch,
  });

  return (
    <div className="Operators">
      <Tabs items={tradingEngineTabs} />

      <div className="Operators__header">
        <span className="Operators__title">
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.OPERATORS.HEADLINE')}
        </span>
        <If condition={permission.allows(Config.permissions.WE_TRADING.OPERATORS_ADD_NEW)}>
          <div className="Operators__actions">
            <Button
              className="Operators__action"
              onClick={handleNewOperatorClick}
              tertiary
              small
            >
              {I18n.t('TRADING_ENGINE.OPERATORS.ADD_OPERATOR')}
            </Button>
          </div>
        </If>
      </div>

      <OperatorsFilter onRefresh={operatorsQuery.refetch} />

      <Table
        stickyFromTop={125}
        items={content}
        sorts={state?.sorts}
        loading={operatorsQuery.loading}
        hasMore={!last}
        onMore={handlePageChanged}
        onSort={handleSort}
      >
        <Column
          sortBy="firstName"
          header={I18n.t('TRADING_ENGINE.OPERATORS.GRID.OPERATOR')}
          render={({ uuid, firstName, lastName }: Operator) => (
            <>
              <Link to={`/trading-engine/operators/${uuid}`} target="_blank">
                <div className="Operators__text-primary">
                  {`${firstName} ${lastName}`}
                </div>
              </Link>
              <div className="Operators__uuid">
                <Uuid uuid={uuid} />
              </div>
            </>
          )}
        />
        <Column
          sortBy="role"
          header={I18n.t('TRADING_ENGINE.OPERATORS.GRID.ROLE')}
          render={({ role }: Operator) => (
            <div className="Operators__text-primary">
              {role}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.OPERATORS.GRID.GROUPS')}
          render={({ groupNames }: Operator) => (
            <div className="Operators__text-primary">
              {groupNames.join(', ')}
            </div>
          )}
        />
        <Column
          sortBy="registrationDate"
          header={I18n.t('TRADING_ENGINE.OPERATORS.GRID.REGISTRATION_DATE')}
          render={({ registrationDate }: Operator) => (
            <>
              <div className="Operators__text-primary">
                {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
              </div>
              <div className="Operators__text-secondary">
                {moment.utc(registrationDate).local().format('HH:mm:ss')}
              </div>
            </>
          )}
        />
        <Column
          sortBy="status"
          header={I18n.t('TRADING_ENGINE.OPERATORS.GRID.STATUS')}
          render={({ status }: Operator) => (
            <div className={
              classNames('Operators__status', {
                'Operators__status--inactive': status === OperatorStatusesEnum.INACTIVE,
                'Operators__status--active': status === OperatorStatusesEnum.ACTIVE,
                'Operators__status--closed': status === OperatorStatusesEnum.CLOSED,
              })}
            >
              <strong>{I18n.t(`TRADING_ENGINE.OPERATORS.STATUSES.${status}`)}</strong>
            </div>
          )}
        />
      </Table>
    </div>
  );
};

export default React.memo(Operators);
