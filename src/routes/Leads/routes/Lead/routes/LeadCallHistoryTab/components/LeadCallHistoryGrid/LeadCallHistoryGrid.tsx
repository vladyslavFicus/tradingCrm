import React, { Fragment } from 'react';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set, startCase } from 'lodash';
import I18n from 'i18n-js';
import { Sort, State } from 'types';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import {
  CallHistoryQueryQueryResult,
  CallHistoryQueryVariables,
  CallHistoryQuery,
} from '../../graphql/__generated__/LeadCallHistoryQuery';
import './LeadCallHistoryGrid.scss';

type Props = {
  callHistoryQuery: CallHistoryQueryQueryResult
};

type CallHistoryType = ExtractApolloTypeFromPageable<CallHistoryQuery['callHistory']>;

const LeadCallHistoryGrid = ({ callHistoryQuery }: Props) => {
  const { content = [], last = false } = callHistoryQuery?.data?.callHistory || {};
  const { state } = useLocation<State<CallHistoryQueryVariables['args']>>();
  const history = useHistory();

  const handlePageChanged = () => {
    const { data, variables, fetchMore, loading } = callHistoryQuery;
    const page = data?.callHistory?.page || 0;
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as CallHistoryQueryVariables), 'args.page.from', page + 1),
      });
    }
  };

  const renderVoIP = ({ callSystem }: CallHistoryType) => (
    <div className="LeadCallHistoryGrid__info--main">
      {startCase(callSystem.toLowerCase())}
    </div>
  );

  const renderOperator = ({ operator }: CallHistoryType) => (
    <Fragment>
      <div className="LeadCallHistoryGrid__info--main">
        {operator.fullName}
      </div>
      <div className="LeadCallHistoryGrid__info--secondary">
        <Uuid uuid={operator.uuid} />
      </div>
    </Fragment>
  );

  const renderDateTime = ({ createdAt }: CallHistoryType) => (
    <div>
      <div className="LeadCallHistoryGrid__info-main">
        {moment.utc(createdAt).local().format('DD.MM.YYYY')}
      </div>
      <div className="LeadCallHistoryGrid__info--secondary">
        {moment.utc(createdAt).local().format('HH:mm:ss')}
      </div>
    </div>
  );

  const handleSort = (sorts: Sort[]) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  return (
    <div className="LeadCallHistoryGrid">
      <Table
        stickyFromTop={188}
        items={content}
        loading={callHistoryQuery.loading}
        hasMore={!last}
        onSort={handleSort}
        onMore={handlePageChanged}
      >
        <Column
          header={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.HEADER.CALL_DATE')}
          sortBy="createdAt"
          render={renderDateTime}
        />
        <Column
          header={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.HEADER.VOIP')}
          render={renderVoIP}
        />
        <Column
          header={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.HEADER.OPERATOR')}
          render={renderOperator}
        />
      </Table>
    </div>
  );
};

export default React.memo(LeadCallHistoryGrid);
