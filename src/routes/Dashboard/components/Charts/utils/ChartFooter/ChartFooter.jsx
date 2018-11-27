import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
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
            <Otherwise>{totals[key].count}</Otherwise>
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
};

export default ChartFooter;
