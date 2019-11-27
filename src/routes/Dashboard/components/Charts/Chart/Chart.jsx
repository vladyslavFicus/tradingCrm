import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import I18n from 'i18n-js';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getActiveBrandConfig } from 'config';
import Select from 'components/Select';
import ShortLoader from 'components/ShortLoader';
import CustomTooltip from './CustomTooltip';
import './chart.scss';

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

class Chart extends Component {
  static propTypes = {
    withCurrency: PropTypes.bool,
    tooltipTitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    hasResults: PropTypes.bool.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    chartAndTextColor: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectOptions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      endDate: PropTypes.string,
    })).isRequired,
    totals: PropTypes.shape({
      total: PropTypes.chartTotal,
      month: PropTypes.chartTotal,
      today: PropTypes.chartTotal,
    }).isRequired,
    lineDataKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    tooltipTitle: '',
    withCurrency: false,
  }

  state = {
    selectedOption: this.props.selectOptions[0],
  }

  handleSelectChange = (value) => {
    const { selectOptions, onSelectChange } = this.props;
    const selectedOption = selectOptions.find(option => option.value === value);

    this.setState(
      { selectedOption },
      () => onSelectChange({
        dateFrom: selectedOption.value,
        dateTo: selectedOption.endDate ? selectedOption.endDate : null,
      }),
    );
  };

  render() {
    const {
      data,
      title,
      totals,
      loading,
      hasResults,
      lineDataKey,
      withCurrency,
      tooltipTitle,
      selectOptions,
      chartAndTextColor,
    } = this.props;
    const { selectedOption } = this.state;

    return (
      <div className="chart">
        <div className="chart__header">
          <div className="chart__title">{title}</div>
          <Select
            value={selectedOption.value}
            customClassName="chart__select"
            onChange={this.handleSelectChange}
          >
            {selectOptions.map(({ value, label }) => (
              <option key={`${label}-${value}`} value={value}>{label}</option>
            ))}
          </Select>
        </div>

        <div className="chart__body">
          <Choose>
            <When condition={loading}>
              <div className="chart__loader">
                <ShortLoader />
              </div>
            </When>
            <Otherwise>
              <Choose>
                <When condition={hasResults}>
                  <ResponsiveContainer className="chart__grapfic" height={200} width="108%">
                    <LineChart data={data}>
                      <YAxis minTickGap={40} axisLine={false} />
                      <CartesianGrid stroke="#eee" horizontal={false} />
                      <Tooltip {...(tooltipTitle && { content: CustomTooltip(tooltipTitle) })} />
                      <Line
                        type="monotone"
                        key={lineDataKey}
                        dataKey={lineDataKey}
                        stroke={chartAndTextColor}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </When>
                <Otherwise>
                  <div className="chart__error">{I18n.t('DASHBOARD.CHART.NO_RESULTS_TEXT')}</div>
                </Otherwise>
              </Choose>
            </Otherwise>
          </Choose>
        </div>

        <div className="chart__footer">
          {totalColumns.map(({ key, label }) => (
            <div key={key} className="chart__footer-item">
              <div className="chart__footer-item-title">{I18n.t(label)}</div>
              <div className="chart__footer-item-value" style={{ color: chartAndTextColor }}>
                <Choose>
                  <When condition={totals && (!totals[key] || totals[key].error)}>
                    <Choose>
                      <When condition={!hasResults}>0</When>
                      <Otherwise><span>&mdash;</span></Otherwise>
                    </Choose>
                  </When>
                  <Otherwise>
                    {(withCurrency && totals) ? Number(totals[key].value).toFixed(2) : totals[key].value}
                    <If condition={withCurrency}>
                      {` ${getActiveBrandConfig().currencies.base || ''}`}
                    </If>
                  </Otherwise>
                </Choose>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Chart;
