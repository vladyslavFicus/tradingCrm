import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Modal, ModalBody } from 'reactstrap';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, Tooltip, XAxis } from 'recharts';
import PropTypes from 'constants/propTypes';
import { getBrand } from 'config';
import Select from 'components/Select';
import ShortLoader from 'components/ShortLoader';
import { ReactComponent as ExpandIcon } from './img/expand.svg';
import { ReactComponent as CloseIcon } from './img/close.svg';
import createCustomTooltip from './createCustomTooltip';
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

class Chart extends PureComponent {
  static propTypes = {
    withCurrency: PropTypes.bool,
    tooltipTitle: PropTypes.string,
    tooltipAmountFormatter: PropTypes.func,
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
    tooltipAmountFormatter: undefined,
    withCurrency: false,
    xDataKey: '',
  };

  state = {
    selectedOption: this.props.selectOptions[0],
    expanded: false,
  };

  toggleExpand = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
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

  getYAxisWidth = (chartData) => {
    const { lineDataKey } = this.props;
    const maxYAxisValue = Math.max.apply(null, chartData.map(item => item[lineDataKey]));
    const maxYAxisValueLength = maxYAxisValue.toString().length;

    if (maxYAxisValueLength < 7) {
      return undefined;
    }
    if (maxYAxisValueLength === 7) {
      return 80;
    }
    if (maxYAxisValueLength <= 8) {
      return 90;
    }
    return 105;
  }

  tickFormatter = item => (item.toString().length > 10
    ? `${item.toString().substring(0, 7)}...` : item);

  renderContent(expanded = false) {
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
      tooltipAmountFormatter,
      selectOptions,
      chartAndTextColor,
    } = this.props;
    const { selectedOption } = this.state;

    const chartData = data.map(chartPointData => ({
      ...chartPointData,
      entryDate: moment(chartPointData.entryDate).format('DD.MM'),
    }));

    return (
      <div className={classNames('Chart', { 'Chart--expanded': expanded })}>
        <div className="Chart__header">
          <div className="Chart__title">{title}</div>
          <div className="Chart__right-container">
            <Choose>
              <When condition={!expanded}>
                <ExpandIcon className="Chart__icon" onClick={this.toggleExpand} />
              </When>
              <Otherwise>
                <CloseIcon className="Chart__icon" onClick={this.toggleExpand} />
              </Otherwise>
            </Choose>
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
                  <ResponsiveContainer className="Chart__grapfic">
                    <LineChart data={chartData}>
                      <If condition={xDataKey}>
                        <XAxis dataKey={xDataKey} />
                      </If>
                      <YAxis
                        minTickGap={40}
                        width={this.getYAxisWidth(chartData)}
                        axisLine={false}
                        tickFormatter={this.tickFormatter}
                      />
                      <CartesianGrid stroke="#eee" horizontal={false} />
                      <Tooltip
                        formatter={tooltipAmountFormatter}
                        {...(tooltipTitle && { content: createCustomTooltip(tooltipTitle) })}
                      />
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
                    {(withCurrency && totals) ? I18n.toCurrency(totals[key].value, { unit: '' }) : totals[key].value}
                    <If condition={withCurrency}>
                      {` ${getBrand().currencies.base || ''}`}
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

  renderModal() {
    return (
      <Modal
        className="Chart__modal"
        toggle={this.toggleExpand}
        isOpen={this.state.expanded}
      >
        <ModalBody>
          {this.renderContent(true)}
        </ModalBody>
      </Modal>
    );
  }

  render() {
    return (
      <>
        {this.renderContent()}
        {this.renderModal()}
      </>
    );
  }
}

export default Chart;
