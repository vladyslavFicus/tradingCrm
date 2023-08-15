import React, { Fragment, useCallback } from 'react';
import moment from 'moment';
import { startCase } from 'lodash';
import I18n from 'i18n-js';
import {
  CallHistoryQuery,
  CallHistoryQueryQueryResult,
} from 'routes/Clients/routes/Client/routes/ClientCallHistoryTab/graphql/__generated__/ClientCallHistoryQuery';
import { Column, Table } from 'components/Table';
import Uuid from 'components/Uuid';
import useClientCallHistoryGrid
  from 'routes/Clients/routes/Client/routes/ClientCallHistoryTab/hooks/useClientCallHistoryGrid';
import './ClientCallHistoryGrid.scss';

type CallHistoryType = ExtractApolloTypeFromPageable<CallHistoryQuery['callHistory']>;

type Props = {
  callHistoryQuery: CallHistoryQueryQueryResult,
};

const ClientCallHistoryGrid = (_props: Props) => {
  const {
    content,
    loading,
    last,
    handleSort,
    handlePageChanged,
  } = useClientCallHistoryGrid(_props);


  // ===== Renders ===== //
  const renderVoIP = useCallback(({ callSystem }: CallHistoryType) => (
    <div className="ClientCallHistoryGrid__info--main">
      {startCase(callSystem.toLowerCase())}
    </div>
  ), []);

  const renderOperator = useCallback(({ operator }: CallHistoryType) => (
    <>
      <Choose>
        <When condition={!!operator?.fullName}>
          <div className="ClientCallHistoryGrid__info--main">
            {operator.fullName}
          </div>
        </When>

        <Otherwise>
          <>&mdash;</>
        </Otherwise>
      </Choose>

      <div className="ClientCallHistoryGrid__info--secondary">
        <Uuid uuid={operator.uuid} />
      </div>
    </>
  ), []);

  const renderDateAndTime = useCallback((time: string) => (
    <>
      <div className="ClientCallHistoryGrid__info--main">
        {moment.utc(time).local().format('DD.MM.YYYY')}
      </div>

      <div className="ClientCallHistoryGrid__info--secondary">
        {moment.utc(time).local().format('HH:mm:ss')}
      </div>
    </>
  ), []);

  const renderCreatedAt = useCallback(({ createdAt }: CallHistoryType) => renderDateAndTime(createdAt), []);

  const renderFinishedAt = useCallback(({ finishedAt }: CallHistoryType) => (
    <Choose>
      <When condition={!!finishedAt}>
        {renderDateAndTime(finishedAt as string)}
      </When>

      <Otherwise>
        <div className="ClientCallHistoryGrid__info--secondary">&mdash;</div>
      </Otherwise>
    </Choose>
  ), [renderDateAndTime]);

  const renderCallStatus = useCallback(({ callStatus }: CallHistoryType) => (
    <div className="ClientCallHistoryGrid__info--main">
      {I18n.t(`CLIENT_PROFILE.CALL_HISTORY.STATUSES.${callStatus}`)}
    </div>
  ), []);

  /**
   * Duration field comes in minutes, so we multiply them by 60 to get hours and also add "000"
   * as a string to convert to timestamp and render it in date format
   *
   * @param { duration }
   */
  const renderDuration = useCallback(({ duration }: CallHistoryType) => (
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
  ), []);

  return (
    <div className="ClientCallHistoryGrid">
      <Table
        stickyFromTop={188}
        items={content}
        loading={loading}
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
