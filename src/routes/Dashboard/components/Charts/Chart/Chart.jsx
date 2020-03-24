import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import I18n from 'i18n-js';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, Tooltip, XAxis } from 'recharts';
import { getActiveBrandConfig } from 'config';
import Select from 'components/Select';
import ShortLoader from 'components/ShortLoader';
import CustomTooltip from './CustomTooltip';
import './Chart.scss';

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
    xDataKey: PropTypes.string,
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
  };

  static defaultProps = {
    tooltipTitle: '',
    withCurrency: false,
    xDataKey: '',
  };

  state = {
    selectedOption: this.props.selectOptions[0],
  };

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
      xDataKey,
      hasResults,
      lineDataKey,
      withCurrency,
      tooltipTitle,
      selectOptions,
      chartAndTextColor,
    } = this.props;
    const { selectedOption } = this.state;

    return (
      <div className="Chart">
        <div className="Chart__header">
          <div className="Chart__title">{title}</div>
          <Select
            value={selectedOption.value}
            customClassName="Chart__select"
            onChange={this.handleSelectChange}
          >
            {selectOptions.map(({ value, label }) => (
              <option key={`${label}-${value}`} value={value}>{label}</option>
            ))}
          </Select>
        </div>

        <div className="Chart__body">
          <Choose>
            <When condition={loading}>
              <div className="Chart__loader">
                <ShortLoader />
              </div>
            </When>
            <Otherwise>
              <Choose>
                <When condition={hasResults}>
                  <ResponsiveContainer className="Chart__grapfic" height={200} width="108%">
                    <LineChart data={data}>
                      <If condition={xDataKey}>
                        <XAxis dataKey={xDataKey} />
                      </If>
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
                  <div className="Chart__error">{I18n.t('DASHBOARD.CHART.NO_RESULTS_TEXT')}</div>
                </Otherwise>
              </Choose>
            </Otherwise>
          </Choose>
        </div>

        <div className="Chart__footer">
          {totalColumns.map(({ key, label }) => (
            <div key={key} className="Chart__footer-item">
              <div className="Chart__footer-item-title">{I18n.t(label)}</div>
              <div className="Chart__footer-item-value" style={{ color: chartAndTextColor }}>
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
