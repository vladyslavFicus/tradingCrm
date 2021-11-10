import React from 'react';
import I18n from 'i18n';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Button } from 'components/UI';
import { Table, Column } from 'components/Table';
import ScheduleSettingsModal from '../../../../modals/ScheduleSettingsModal';
import './SessionsSettings.scss';

interface Props {
  modals: {
    scheduleSettings: {
      show: (value: any) => void,
    },
  },
}

const scheduleWeek = [
  {
    day: 'SUNDAY',
  },
  {
    day: 'MONDAY',
    quotes: '00:00-24:00',
    trade: '00:00-24:00',
  },
  {
    day: 'TUESDAY',
    quotes: '00:00-24:00',
    trade: '00:00-24:00',
  },
  {
    day: 'WEDNESDAY',
    quotes: '00:00-24:00',
    trade: '00:00-24:00',
  },
  {
    day: 'THURSDAY',
    quotes: '00:00-24:00',
    trade: '00:00-24:00',
  },
  {
    day: 'FRIDAY',
    quotes: '00:00-24:00',
    trade: '00:00-24:00',
  },
  {
    day: 'SATURDAY',
  },
];

const SessionsSettings = (props: Props) => {
  const triggerEditScheduleModal = (value: any) => {
    const {
      modals: { scheduleSettings },
    } = props;

    scheduleSettings.show({
      ...value,
    });
  };

  const renderActions = (value: any) => (
    <Button
      transparent
    >
      <i
        onClick={() => triggerEditScheduleModal(value)}
        className="fa fa-edit SessionsSettings__edit"
      />
    </Button>
  );

  const renderDay = ({ day } : { day: string }) => (
    <Choose>
      <When condition={!!day}>
        <div className="SessionsSettings__day">{I18n.t(`TRADING_ENGINE.NEW_SYMBOL.WEEK.${day}`)}</div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  const renderQuotes = (value: any) => (
    <>
      <Choose>
        <When condition={value?.quotes}>
          <div className="SessionsSettings__text-primary">
            {value.quotes}
          </div>
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>

      {renderActions(value)}
    </>
  );

  const renderTrade = (value: any) => (
    <>
      <Choose>
        <When condition={value?.trade}>
          <div className="SessionsSettings__text-primary">
            {value.trade}
          </div>
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>

      {renderActions(value)}
    </>
  );

  return (
    <>
      <div className="SessionsSettings__section-header">
        <div className="SessionsSettings__section-title">
          {I18n.t('TRADING_ENGINE.NEW_SYMBOL.SESSIONS')}
        </div>
      </div>

      <Table
        items={scheduleWeek}
      >
        <Column
          header={I18n.t('TRADING_ENGINE.NEW_SYMBOL.GRID_HEADER.DAY')}
          render={renderDay}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.NEW_SYMBOL.GRID_HEADER.QUOTES')}
          render={renderQuotes}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.NEW_SYMBOL.GRID_HEADER.TRADE')}
          render={renderTrade}
        />
      </Table>
    </>
  );
};

export default compose(
  React.memo,
  withModals({
    scheduleSettings: ScheduleSettingsModal,
  }),
)(SessionsSettings);
