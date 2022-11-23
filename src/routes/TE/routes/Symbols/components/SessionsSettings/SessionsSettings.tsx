import React, { PureComponent } from 'react';
import compose from 'compose-function';
import classNames from 'classnames';
import { FormikProps } from 'formik';
import I18n from 'i18n';
import { withModals } from 'hoc';
import { Modal } from 'types/modal';
import { Table, Column } from 'components/Table';
import { TradingEngineSymbol__SwapsConfigsSwapDayTimes as SwapDayTimes } from '__generated__/types';
import { SymbolSession, SessionType, DayOfWeek, FormValues } from '../../types';
import ScheduleSettingsModal from '../../modals/ScheduleSettingsModal';
import './SessionsSettings.scss';

interface Props extends FormikProps<FormValues> {
  modals: {
    scheduleSettings: Modal,
  },
}

interface State {
  symbolSessions: SymbolSession[],
}


interface SymbolSessionWithError extends SymbolSession {
  error?: string,
}

class SessionsSettings extends PureComponent<Props> {
  state = {
    symbolSessions: [
      { dayOfWeek: DayOfWeek.SUNDAY },
      { dayOfWeek: DayOfWeek.MONDAY },
      { dayOfWeek: DayOfWeek.TUESDAY },
      { dayOfWeek: DayOfWeek.WEDNESDAY },
      { dayOfWeek: DayOfWeek.THURSDAY },
      { dayOfWeek: DayOfWeek.FRIDAY },
      { dayOfWeek: DayOfWeek.SATURDAY },
    ],
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      // Fill symbol sessions depends on formik values (for example when chosen source and settings fetching from BE)
      // or it's initial filling fields on edit symbol page
      symbolSessions: state.symbolSessions.map(item => ({
        dayOfWeek: item.dayOfWeek,
        ...props.values.symbolSessions.find(session => session.dayOfWeek === item.dayOfWeek),
        ...props.values.swapConfigs?.swapDayTimes?.find(session => session.dayOfWeek === item.dayOfWeek),
      })),
    };
  }

  triggerEditScheduleModal = (value: SymbolSession, sessionType: SessionType) => {
    const {
      modals: { scheduleSettings },
    } = this.props;

    scheduleSettings.show({
      ...value,
      sessionType,
      onSuccess: this.props.setFieldValue,
    });
  };

  renderDay = ({ dayOfWeek }: SymbolSession) => (
    <Choose>
      <When condition={!!dayOfWeek}>
        <div className="SessionsSettings__day">{I18n.t(`TRADING_ENGINE.SYMBOL.WEEK.${dayOfWeek}`)}</div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderPeriods = (value: SymbolSession) => (
    <Choose>
      <When condition={!!value.periods}>
        <div className="SessionsSettings__text-primary">
          {value.periods!.map(period => (
            `${I18n.t('COMMON.FROM')} ${period?.openTime}
              ${I18n.t('COMMON.TO')} ${period?.closeTime}
            `
          )).join(', ')}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderSwapTime = (value: SwapDayTimes) => (
    <Choose>
      <When condition={!!value.swapTime}>
        <div className="SessionsSettings__text-primary">
          {value?.swapTime}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderMultiplier = (value: SwapDayTimes) => (
    <Choose>
      <When condition={!!value?.multiplier}>
        <div className="SessionsSettings__text-primary">
          {value?.multiplier}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  render() {
    return (
      <div className="SessionsSettings">
        <div className="SessionsSettings__section-header">
          <div className="SessionsSettings__section-title">
            {I18n.t('TRADING_ENGINE.SYMBOL.SESSIONS')}
          </div>
        </div>

        {this.state.symbolSessions.map(
          ({ error, dayOfWeek }: SymbolSessionWithError) => error
            && (
              <div className="SessionsSettings__message-error" key={dayOfWeek}>
                <strong>{I18n.t(`TRADING_ENGINE.SYMBOL.WEEK.${dayOfWeek}`)}: </strong> {error}
              </div>
            ),
        )}

        <Table
          items={this.state.symbolSessions}
          customClassNameRow={({ error }: SymbolSessionWithError) => (
            classNames({
              'SessionsSettings--is-disabled': true, // Edit of session settings should be disabled all time
              'SessionsSettings--is-error': error,
            }))
          }
        >
          <Column
            header={I18n.t('TRADING_ENGINE.SYMBOL.GRID_HEADER.DAY')}
            render={this.renderDay}
          />
          <Column
            width={450}
            header={I18n.t('TRADING_ENGINE.SYMBOL.GRID_HEADER.PERIODS')}
            render={this.renderPeriods}
          />
          <Column
            width={300}
            header={I18n.t('TRADING_ENGINE.SYMBOL.GRID_HEADER.SWAP_TIME')}
            render={this.renderSwapTime}
          />
          <Column
            width={150}
            header={I18n.t('TRADING_ENGINE.SYMBOL.GRID_HEADER.MULTIPLAYER')}
            render={this.renderMultiplier}
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
