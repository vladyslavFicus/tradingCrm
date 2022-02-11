import React, { Fragment } from 'react';
import moment from 'moment';
import { cloneDeep, set } from 'lodash';
import I18n from 'i18n-js';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import {
  CallHistoryQueryQueryResult,
  CallHistoryQueryVariables,
  CallHistoryQuery,
} from '../../graphql/__generated__/ClientCallHistoryQuery';
import './ClientCallHistoryGrid.scss';

type Props = {
  callHistory: CallHistoryQueryQueryResult
};
type CallHistoryType = ExtractApolloTypeFromPageable<CallHistoryQuery['callHistory']>;


const ClientCallHistoryGrid = ({ callHistory }: Props) => {
  const { content = [], last = false } = callHistory?.data?.callHistory || {};

  const handlePageChanged = () => {
    const { data, variables, fetchMore, loading } = callHistory;
    const page = data?.callHistory?.page || 0;
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as CallHistoryQueryVariables), 'args.page.from', page + 1),
      });
    }
  };

  const renderVoIP = ({ callSystem }: CallHistoryType) => (
    <div className="ClientCallHistoryGrid__info-main">
      {callSystem}
    </div>
  );

  const renderOperator = ({ operator }: CallHistoryType) => (
    <Fragment>
      <div className="ClientCallHistoryGrid__info-main">
        {operator.fullName}
      </div>
      <div className="ClientCallHistoryGrid__info-secondary">
        <Uuid uuid={operator.uuid || ''} />
      </div>
    </Fragment>
  );

  const renderDateTime = ({ createdAt }: CallHistoryType) => (
    <div>
      <div className="ClientCallHistoryGrid__info-main">
        {moment.utc(createdAt).local().format('DD.MM.YYYY')}
      </div>
      <div className="ClientCallHistoryGrid__info-secondary">
        {moment.utc(createdAt).local().format('HH:mm:ss')}
      </div>
    </div>
  );

  return (
    <div className="ClientCallHistoryGrid">
      <Table
        stickyFromTop={188}
        items={content}
        loading={callHistory.loading}
        hasMore={!last && !callHistory.loading}
        onMore={handlePageChanged}
      >
        <Column
          header={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.HEADER.CALL_DATE')}
          render={renderDateTime}
        />
        <Column
          header={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.HEADER.VOIP')}
          render={renderVoIP}
        />
        <Column
          header={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.HEADER.OPERATOR')}
          render={renderOperator}
        />
      </Table>
    </div>
  );
};

export default React.memo(ClientCallHistoryGrid);
