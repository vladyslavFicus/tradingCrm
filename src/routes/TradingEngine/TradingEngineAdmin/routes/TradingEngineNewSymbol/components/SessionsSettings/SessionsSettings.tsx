import React, { PureComponent } from 'react';
import I18n from 'i18n';
import compose from 'compose-function';
import classNames from 'classnames';
import { FormikProps } from 'formik';
import moment from 'moment';
import { withModals } from 'hoc';
import { Button } from 'components/UI';
import { Modal } from 'types/modal';
import { Table, Column } from 'components/Table';
import { SymbolSession, SessionType, DayOfWeek, FormValues } from '../../../../types';
import { weekends } from '../../constants';
import ScheduleSettingsModal from '../../../../modals/ScheduleSettingsModal';
import './SessionsSettings.scss';

interface Props {
  modals: {
    scheduleSettings: Modal,
  },
}

interface SymbolSessionWithError extends SymbolSession {
  error?: string;
}

class SessionsSettings extends PureComponent<Props & FormikProps<FormValues>> {
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

  validationSymbolSessions = (value: SymbolSession[]) => (
    value.map((item) => {
      // If session contains trade and does not contain quote, need to add error message
      if (item?.trade && !item?.quote) {
        return {
          ...item,
          error: I18n.t('TRADING_ENGINE.NEW_SYMBOL.SESSIONS_ERROR.QUOTE_REQUIRED_ERROR'),
        };
      }

      // When session contains trade and quote, then need to compare time range
      // (trading session should be <= quote session)
      if (item?.trade && item?.quote) {
        const {
          trade: {
            openTime: tradeOpenTime,
            closeTime: tradeCloseTime,
          },
          quote: {
            openTime: quoteOpenTime,
            closeTime: quoteCloseTime,
          },
        } = item;

        const format = 'HH:mm';
        const quoteOpenTimeMoment = moment(quoteOpenTime, format);
        const quoteCloseTimeMoment = moment(quoteCloseTime, format);
        const tradeOpenTimeMoment = moment(tradeOpenTime, format);
        const tradeCloseTimeMoment = moment(tradeCloseTime, format);

        const isInRangeOpenTime = tradeOpenTimeMoment
          .isBetween(quoteOpenTimeMoment, quoteCloseTimeMoment, undefined, '[)');

        const isInRangeCloseTime = tradeCloseTimeMoment
          .isBetween(quoteOpenTimeMoment, quoteCloseTimeMoment, undefined, '(]');

        if (!isInRangeOpenTime || !isInRangeCloseTime) {
          return {
            ...item,
            error: I18n.t('TRADING_ENGINE.NEW_SYMBOL.SESSIONS_ERROR.RANGE_ERROR'),
          };
        }
      }

      return {
        ...item,
        error: null,
      };
    })
  )

  handleSymbolSessionsChange = (value: SymbolSession) => {
    const { symbolSessions } = this.state;
    // Matched index for existing day in state
    const matchIndex = symbolSessions
      .findIndex((({ dayOfWeek }) => dayOfWeek === value.dayOfWeek));

    // Add/update data for a new or existing day
    symbolSessions.splice(matchIndex, 1, { ...symbolSessions[matchIndex], ...value });

    const validatedSymbolSessions = this.validationSymbolSessions(symbolSessions);

    this.setState({ symbolSessions: validatedSymbolSessions });

    // Get list of days which contains data in trade or quote
    const symbolSessionsContainWorkingHours = validatedSymbolSessions.filter(
      item => Object.keys(item).some(i => ['trade', 'quote'].includes(i)),
    );

    this.props.setFieldValue('symbolSessions', symbolSessionsContainWorkingHours);
  }

  triggerEditScheduleModal = (value: SymbolSession, sessionType: SessionType) => {
    const {
      modals: { scheduleSettings },
    } = this.props;

    scheduleSettings.show({
      ...value,
      sessionType,
      onSuccess: this.handleSymbolSessionsChange,
    });
  };

  renderActions = (value: SymbolSession, sessionType: SessionType) => (
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

      {this.renderActions(value, SessionType.QUOTE)}
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

      {this.renderActions(value, SessionType.TRADE)}
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

        {this.state.symbolSessions.map(
          ({ error, dayOfWeek }: SymbolSessionWithError) => error
            && (
              <div className="SessionsSettings__message-error" key={dayOfWeek}>
                <strong>{I18n.t(`TRADING_ENGINE.NEW_SYMBOL.WEEK.${dayOfWeek}`)}: </strong> { error }
              </div>
            ),
        )}

        <Table
          items={this.state.symbolSessions}
          customClassNameRow={({ dayOfWeek, error }: SymbolSessionWithError) => (
            classNames({
              'SessionsSettings--is-disabled': weekends.includes(dayOfWeek),
              'SessionsSettings--is-error': error,
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
