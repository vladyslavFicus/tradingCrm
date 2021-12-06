import React, { PureComponent } from 'react';
import I18n from 'i18n';
import compose from 'compose-function';
import classNames from 'classnames';
import { withModals } from 'hoc';
import { Button } from 'components/UI';
import { Modal } from 'types/modal';
import { Table, Column } from 'components/Table';
import ScheduleSettingsModal from '../../../../modals/ScheduleSettingsModal';
import './SessionsSettings.scss';

interface SymbolSessionWorkingHours {
  openTime: string,
  closeTime: string,
}

interface SymbolSession {
  dayOfWeek: string,
  trade?: SymbolSessionWorkingHours,
  quote?: SymbolSessionWorkingHours,
}

interface Props {
  modals: {
    scheduleSettings: Modal,
  },
  updateSymbolSessionsState: (value: SymbolSession[]) => void,
  symbolSessions: SymbolSession[],
}

class SessionsSettings extends PureComponent<Props> {
  state = {
    symbolSessions: [
      { dayOfWeek: 'SUNDAY' },
      { dayOfWeek: 'MONDAY' },
      { dayOfWeek: 'TUESDAY' },
      { dayOfWeek: 'WEDNESDAY' },
      { dayOfWeek: 'THURSDAY' },
      { dayOfWeek: 'FRIDAY' },
      { dayOfWeek: 'SATURDAY' },
    ],
  };

  handleSymbolSessionsChange = (value: SymbolSession) => {
    const { symbolSessions } = this.state;
    const matchIndex = symbolSessions
      .findIndex((({ dayOfWeek }) => dayOfWeek === value?.dayOfWeek));

    symbolSessions.splice(matchIndex, 1, { ...symbolSessions[matchIndex], ...value });

    this.setState({ symbolSessions });

    const symbolSessionsContainWorkingHours = symbolSessions.filter(
      item => Object.keys(item).some(i => ['trade', 'quote'].includes(i)),
    );

    this.props.updateSymbolSessionsState(symbolSessionsContainWorkingHours);
  }

  triggerEditScheduleModal = (value: SymbolSession, sessionType: string) => {
    const {
      modals: { scheduleSettings },
    } = this.props;

    scheduleSettings.show({
      ...value,
      sessionType,
      onSuccess: (data: SymbolSession) => this.handleSymbolSessionsChange(data),
    });
  };

  renderActions = (value: SymbolSession, sessionType: string) => (
    <Button
      transparent
      className="SessionsSettings__edit"
    >
      <i
        onClick={() => this.triggerEditScheduleModal(value, sessionType)}
        className="fa fa-edit"
      />
    </Button>
  );

  renderDay = ({ dayOfWeek } : SymbolSession) => (
    <Choose>
      <When condition={!!dayOfWeek}>
        <div className="SessionsSettings__day">{I18n.t(`TRADING_ENGINE.NEW_SYMBOL.WEEK.${dayOfWeek}`)}</div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderQuotes = (value: SymbolSession) => (
    <>
      <Choose>
        <When condition={!!value?.quote}>
          <div className="SessionsSettings__text-primary">
            {`
              ${I18n.t('COMMON.FROM')} ${value?.quote?.openTime}
              ${I18n.t('COMMON.TO')} ${value?.quote?.closeTime}
            `}
          </div>
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>

      {this.renderActions(value, 'quote')}
    </>
  );

  renderTrade = (value: SymbolSession) => (
    <>
      <Choose>
        <When condition={!!value?.trade}>
          <div className="SessionsSettings__text-primary">
            {`
              ${I18n.t('COMMON.FROM')} ${value?.trade?.openTime}
              ${I18n.t('COMMON.TO')} ${value?.trade?.closeTime}
            `}
          </div>
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>

      {this.renderActions(value, 'trade')}
    </>
  );

  render() {
    return (
      <div className="SessionsSettings">
        <div className="SessionsSettings__section-header">
          <div className="SessionsSettings__section-title">
            {I18n.t('TRADING_ENGINE.NEW_SYMBOL.SESSIONS')}
          </div>
        </div>

        <Table
          items={this.state.symbolSessions}
          customClassNameRow={({ dayOfWeek }: SymbolSession) => (
            classNames({
              'SessionsSettings--is-disabled': ['SUNDAY', 'SATURDAY'].includes(dayOfWeek),
            }))
          }
        >
          <Column
            header={I18n.t('TRADING_ENGINE.NEW_SYMBOL.GRID_HEADER.DAY')}
            render={this.renderDay}
          />
          <Column
            width={470}
            header={I18n.t('TRADING_ENGINE.NEW_SYMBOL.GRID_HEADER.QUOTES')}
            render={this.renderQuotes}
          />
          <Column
            width={470}
            header={I18n.t('TRADING_ENGINE.NEW_SYMBOL.GRID_HEADER.TRADE')}
            render={this.renderTrade}
          />
        </Table>
      </div>
    );
  }
}

export default compose(
  React.memo,
  withModals({
    scheduleSettings: ScheduleSettingsModal,
  }),
)(SessionsSettings);
