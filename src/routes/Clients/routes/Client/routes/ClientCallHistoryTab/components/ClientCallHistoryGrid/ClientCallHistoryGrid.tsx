import React, { Fragment } from 'react';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set, startCase } from 'lodash';
import I18n from 'i18n-js';
import { Sort, State } from 'types';
import { Column, Table } from 'components/Table';
import Uuid from 'components/Uuid';
import {
  CallHistoryQuery,
  CallHistoryQueryQueryResult,
  CallHistoryQueryVariables,
} from '../../graphql/__generated__/ClientCallHistoryQuery';
import './ClientCallHistoryGrid.scss';

type Props = {
  callHistory: CallHistoryQueryQueryResult,
};
type CallHistoryType = ExtractApolloTypeFromPageable<CallHistoryQuery['callHistory']>;


const ClientCallHistoryGrid = ({ callHistory }: Props) => {
  const { content = [], last = false } = callHistory?.data?.callHistory || {};
  const { state } = useLocation<State<CallHistoryQueryVariables['args']>>();
  const history = useHistory();

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
    <div className="ClientCallHistoryGrid__info--main">
      {startCase(callSystem.toLowerCase())}
    </div>
  );

  const renderOperator = ({ operator }: CallHistoryType) => (
    <Fragment>
      <div className="ClientCallHistoryGrid__info--main">
        {operator.fullName}
      </div>
      <div className="ClientCallHistoryGrid__info--secondary">
        <Uuid uuid={operator.uuid || ''} />
      </div>
    </Fragment>
  );

  const renderDateAndTime = (time: string) => (
    <div>
      <div className="ClientCallHistoryGrid__info--main">
        {moment.utc(time).local().format('DD.MM.YYYY')}
      </div>
      <div className="ClientCallHistoryGrid__info--secondary">
        {moment.utc(time).local().format('HH:mm:ss')}
      </div>
    </div>
  );

  const renderCreatedAt = ({ createdAt }: CallHistoryType) => renderDateAndTime(createdAt);

  const renderFinishedAt = ({ finishedAt }: CallHistoryType) => (
    <Choose>
      <When condition={!!finishedAt}>
        {renderDateAndTime(finishedAt as string)}
      </When>
      <Otherwise>
        <div className="ClientCallHistoryGrid__info--secondary">&mdash;</div>
      </Otherwise>
    </Choose>
  );

  const renderCallStatus = ({ callStatus }: CallHistoryType) => (
    <div className="ClientCallHistoryGrid__info--main">
      {I18n.t(`CLIENT_PROFILE.CALL_HISTORY.STATUSES.${callStatus}`)}
    </div>
  );

  /**
   * Duration field comes in minutes, so we multiply them by 60 to get hours and also add "000"
   * as a string to convert to timestamp and render it in date format
   *
   * @param { duration }
   */
  const renderDuration = ({ duration }: CallHistoryType) => (
    <Choose>
      <When condition={!!duration}>
        <div className="ClientCallHistoryGrid__info-main">
          {moment.utc(+(duration as string) * 60 * 1000).format('HH:mm:ss')}
        </div>
      </When>
      <Otherwise>
        <div className="ClientCallHistoryGrid__info--secondary">&mdash;</div>
      </Otherwise>
    </Choose>
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
    <div className="ClientCallHistoryGrid">
      <Table
        stickyFromTop={188}
        items={content}
        loading={callHistory.loading}
        hasMore={!last}
        onSort={handleSort}
        onMore={handlePageChanged}
      >
        <Column
          header={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.HEADER.CALL_STATUS')}
          render={renderCallStatus}
        />
        <Column
          header={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.HEADER.START_DATE')}
          sortBy="createdAt"
          render={renderCreatedAt}
        />
        <Column
          header={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.HEADER.FINISH_DATE')}
          sortBy="finishedAt"
          render={renderFinishedAt}
        />
        <Column
          header={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.HEADER.DURATION')}
          render={renderDuration}
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
