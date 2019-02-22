import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'constants/propTypes';
import { getActiveBrandConfig } from 'config';
import './ChartFooter.scss';

const totalColumns = [{
  label: 'COMMON.CHART_FOOTER.TOTAL',
  key: 'total',
}, {
  label: 'COMMON.CHART_FOOTER.THIS_MONTH',
  key: 'month',
}, {
  label: 'COMMON.CHART_FOOTER.TODAY',
  key: 'today',
}];

const ChartFooter = ({
  noResults,
  totals,
  color,
  withCurrency,
}) => (
  <div className="chart-footer">
    {totalColumns.map(({ key, label }) => (
      <div key={key} className="chart-footer__total">
        <div>{I18n.t(label)}</div>
        <div style={{ color }}>
          <Choose>
            <When condition={!totals[key] || totals[key].error}>
              <Choose>
                <When condition={noResults}>0</When>
                <Otherwise><span>&mdash;</span></Otherwise>
              </Choose>
            </When>
            <Otherwise>
              {withCurrency ? Number(totals[key].value).toFixed(2) : totals[key].value}
              <If condition={withCurrency}>
                {` ${getActiveBrandConfig().currencies.base || ''}`}
              </If>
            </Otherwise>
          </Choose>
        </div>
      </div>
    ))}
  </div>
);

ChartFooter.propTypes = {
  noResults: PropTypes.bool.isRequired,
  totals: PropTypes.shape({
    total: PropTypes.chartTotal,
    month: PropTypes.chartTotal,
    today: PropTypes.chartTotal,
  }).isRequired,
  color: PropTypes.string.isRequired,
  withCurrency: PropTypes.bool,
};

ChartFooter.defaultProps = {
  withCurrency: false,
};

export default ChartFooter;
