import React from 'react';
import I18n from 'i18n-js';
import { Link, useLocation, useHistory } from 'react-router-dom';
import compose from 'compose-function';
import { cloneDeep, set } from 'lodash';
import moment from 'moment';
import permissions from 'config/permissions';
import { Sort, State } from 'types';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import PermissionContent from 'components/PermissionContent';
import { tradingEngineTabs } from '../../constants';
import OperatorsFilter from './components/OperatorsFilter';
import {
  OperatorsQueryVariables,
  useOperatorsQuery,
  OperatorsQuery,
} from './graphql/__generated__/OperatorGroupsQuery';
import './Operators.scss';

type Operator = ExtractApolloTypeFromPageable<OperatorsQuery['tradingEngine']['operators']>;

export const statusesColor: Record<string, string> = {
  INACTIVE: 'color-info',
  CLOSED: 'color-danger',
  ACTIVE: 'color-success',
};

const Operators = () => {
  const { state } = useLocation<State<OperatorsQueryVariables['args']>>();
  const history = useHistory();

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

  const { content = [], last = true, totalElements } = operatorsQuery.data?.tradingEngine.operators || {};

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = operatorsQuery;

    const page = data?.tradingEngine.operators.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables as OperatorsQueryVariables), 'args.page.from', page + 1),
    });
  };

  const handleSort = (sorts: Sort[]) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handleNewOperatorClick = () => true;

  return (
    <div className="Operators">
      <Tabs items={tradingEngineTabs} />

      <div className="Operators__header">
        <span className="Operators__title">
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.OPERATORS.HEADLINE')}
        </span>
        <PermissionContent permissions={permissions.WE_TRADING.OPERATORS_ADD_NEW}>
          <div className="Operators__actions">
            <Button
              className="Operators__action"
              onClick={handleNewOperatorClick}
              commonOutline
              small
            >
              {I18n.t('TRADING_ENGINE.OPERATORS.ADD_OPERATOR')}
            </Button>
          </div>
        </PermissionContent>
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
            <Link to={`/trading-engine/operators/${uuid}`} target="_blank">
              <div className="Operators__text-primary">
                {`${firstName} ${lastName}`}
              </div>
              <div className="Operators__text-secondary">
                <Uuid uuid={uuid} />
              </div>
            </Link>
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
              {groupNames}
            </div>
          )}
        />
        <Column
          sortBy="registrationDate"
          header={I18n.t('TRADING_ENGINE.OPERATORS.GRID.REGISTRATION_DATE')}
          render={({ registrationDate }: Operator) => (
            <>
              <div className="Accounts__text-primary">
                {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
              </div>
              <div className="Accounts__text-secondary">
                {moment.utc(registrationDate).local().format('HH:mm:ss')}
              </div>
            </>
          )}
        />
        <Column
          sortBy="status"
          header={I18n.t('TRADING_ENGINE.OPERATORS.GRID.STATUS')}
          render={({ status }: Operator) => (
            <div className={statusesColor[status]}>
              <strong>{I18n.t(`TRADING_ENGINE.OPERATORS.STATUSES.${status}`)}</strong>
            </div>
          )}
        />
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  // add new operator modals
)(Operators);
