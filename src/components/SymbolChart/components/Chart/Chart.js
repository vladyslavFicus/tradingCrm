import React, { PureComponent } from 'react';
import { createChart } from 'lightweight-charts';
import { isEqual } from 'lodash';
import { v4 } from 'uuid';
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
    bidLineColor: PropTypes.string,
    askLineColor: PropTypes.string,
  };

  static defaultProps = {
    width: 540,
    height: 600,
    chartNextTickItem: undefined,
    chartConfig: {},
    bidLineColor: '#ff0000',
    askLineColor: '#2196f3',
  }

  id = v4();

  chart = null;

  bidLine = null;

  askLine = null;

  componentDidMount() {
    this.initializationChart();
  }

  componentDidUpdate(prevProps) {
    const { chartData: prevChartData, width: prevWidth, height: prevHeight } = prevProps;
    const { chartNextTickItem, chartData, height, width } = this.props;

    if (!isEqual(chartData, prevChartData)) {
      this.updateChartData(chartData);
    }

    // Update and apply next tick for chart
    if (chartNextTickItem) {
      this.updateNextTickItem(chartNextTickItem);
    }

    // Update size of chart when new sizes received
    if (prevWidth !== width || prevHeight !== height) {
      this.updateChartSize(width, height);
    }
  }

  initializationChart = () => {
    const { width, height, chartData, chartConfig, bidLineColor, askLineColor } = this.props;
    const chartOptions = {
      width,
      height,
      layout: {
        backgroundColor: getComputedStyle(document.querySelector(':root'))
          .getPropertyValue('--surface-frame-background'),
        textColor: getComputedStyle(document.querySelector(':root')).getPropertyValue('--text-secondary'),
      },
      grid: {
        vertLines: {
          color: getComputedStyle(document.querySelector(':root')).getPropertyValue('--surface-frame-border'),
        },
        horzLines: {
          color: getComputedStyle(document.querySelector(':root')).getPropertyValue('--surface-frame-border'),
        },
      },
      timeScale: {
        rightOffset: 2,
        timeVisible: true,
        secondsVisible: true,
      },
      ...chartConfig,
    };

    this.chart = createChart(document.getElementById(this.id), chartOptions);

    this.bidLine = this.chart.addLineSeries({ lineWidth: 1, color: bidLineColor });
    this.askLine = this.chart.addLineSeries({ lineWidth: 1, color: askLineColor });

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

    // Clear state before applying new data on chart
    this.askLine.setData([]);
    this.bidLine.setData([]);

    // We need to use render N-times and use instruments for real-time update chart instead of this.bidLine.setData(...)
    // because it doesn't work correctly with ticks more often than 1 per second.
    chartData.forEach((tick) => {
      this.bidLine.update({ time: chartTimeFormatting(tick.time), value: tick.bid });
      this.askLine.update({ time: chartTimeFormatting(tick.time), value: tick.ask });
    });
  }

  updateNextTickItem = ({ dateTime, ask, bid }) => {
    this.bidLine.update({ time: chartTimeFormatting(dateTime), value: bid });
    this.askLine.update({ time: chartTimeFormatting(dateTime), value: ask });
  }

  updateChartSize = (width, height) => {
    this.chart.applyOptions({ width, height });
  };

  render() {
    return (
      <div id={this.id} className="ChartWrapper" />
    );
  }
}

export default Chart;
