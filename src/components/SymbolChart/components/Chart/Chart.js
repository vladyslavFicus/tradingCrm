import React, { PureComponent } from 'react';
import { createChart } from 'lightweight-charts';
import { isEqual } from 'lodash';
import PropTypes from 'constants/propTypes';
import { countPrecisionAndMinMove, chartTimeFormatting } from './utils';

class Chart extends PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    chartData: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      ask: PropTypes.number.isRequired,
      bid: PropTypes.number.isRequired,
      time: PropTypes.string.isRequired,
    })).isRequired,
    chartNextTickItem: PropTypes.shape({
      ask: PropTypes.number.isRequired,
      bid: PropTypes.number.isRequired,
      dateTime: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }),
    chartConfig: PropTypes.object,
  };

  static defaultProps = {
    width: 540,
    height: 600,
    chartNextTickItem: undefined,
    chartConfig: {},
  }

  chart = null;

  bidLine = null;

  askLine = null;

  componentDidMount() {
    this.initializationChart();
  }

  componentDidUpdate({ chartData: prevChartData }) {
    const { chartNextTickItem, chartData } = this.props;

    if (!isEqual(chartData, prevChartData)) {
      this.updateChartData(chartData);
    }

    if (chartNextTickItem) {
      this.updateNextTickItem(chartNextTickItem);
    }
  }

  initializationChart = () => {
    const { width, height, chartData, chartConfig } = this.props;
    const chartOptions = {
      width,
      height,
      timeScale: {
        rightOffset: 2,
        timeVisible: true,
        secondsVisible: true,
      },
      ...chartConfig,
    };

    this.chart = createChart(document.getElementById('symbol_chart'), chartOptions);
    this.bidLine = this.chart.addLineSeries({ lineWidth: 1 });
    this.askLine = this.chart.addLineSeries({ lineWidth: 1, color: 'red' });

    this.updateChartData(chartData);
  }

  updateChartData = (chartData) => {
    const formattedData = {
      ask: chartData.map(({ name, time, ask }) => ({
        name,
        value: ask,
        time: chartTimeFormatting(time),
      })),
      bid: chartData.map(({ name, time, bid }) => ({
        name,
        value: bid,
        time: chartTimeFormatting(time),
      })),
    };

    const { ask, bid } = formattedData;
    const { minMove, precision } = countPrecisionAndMinMove(ask, bid);
    const priceFormat = {
      type: 'price',
      minMove,
      precision,
    };

    this.bidLine.applyOptions({ priceFormat });
    this.askLine.applyOptions({ priceFormat });
    this.askLine.setData(ask);
    this.bidLine.setData(bid);
  }

  updateNextTickItem = ({ dateTime, ask, bid }) => {
    this.bidLine.update({ time: chartTimeFormatting(dateTime), value: bid });
    this.askLine.update({ time: chartTimeFormatting(dateTime), value: ask });
  }

  render() {
    return (
      <div id="symbol_chart" className="ChartWrapper" />
    );
  }
}

export default Chart;
