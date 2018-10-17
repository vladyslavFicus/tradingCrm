import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import Amount from '../../../../../components/Amount';
import './ReportItem.scss';

const ReportItem = (props) => {
  const {
    date,
    deposits,
    withdrawals,
    profits,
  } = props;

  return (
    <div className="report-item">
      <div className="report-item__block report-item__block-date">
        {moment.utc(date).local().format('DD.MM.YYYY')}
      </div>
      <div className="report-item__block">
        <div className="report-item__title">
          {I18n.t('route.reports.component.ReportItem.deposits')}
        </div>
        <For of={deposits} each="deposit">
          <Amount
            tag="div"
            className="report-item__content"
            key={deposit.currency}
            {...deposit}
          />
        </For>
      </div>
      <div className="report-item__block">
        <div className="report-item__title">
          {I18n.t('route.reports.component.ReportItem.withdrawals')}
        </div>
        <For of={withdrawals} each="withdraw">
          <Amount
            tag="div"
            key={withdraw.currency}
            className="report-item__content"
            {...withdraw}
          />
        </For>
      </div>
      <div className="report-item__block">
        <div className="report-item__title">
          {I18n.t('route.reports.component.ReportItem.profit')}
        </div>
        <For of={profits} each="profit">
          <Amount
            tag="div"
            className="report-item__content"
            key={profit.currency}
            {...profit}
          />
        </For>
      </div>
    </div>
  );
};

ReportItem.propTypes = {
  date: PropTypes.string.isRequired,
  deposits: PropTypes.array,
  withdrawals: PropTypes.array,
  profits: PropTypes.array,
};
ReportItem.defaultProps = {
  deposits: [],
  withdrawals: [],
  profits: [],
};

export default ReportItem;
