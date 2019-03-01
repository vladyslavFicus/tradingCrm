import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Select from '../Select';
import ShortLoader from '../ShortLoader';
import CustomTooltip from './CustomTooltip';
import './Chart.scss';

class Chart extends Component {
  static propTypes = {
    headerTitle: PropTypes.string.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    selectOptions: PropTypes.array.isRequired,
    className: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.arrayOf(PropTypes.object),
    yAxis: PropTypes.shape({
      minTickGap: PropTypes.number,
      axisLine: PropTypes.bool,
    }),
    cartesianGrid: PropTypes.shape({
      stroke: PropTypes.string,
      horizontal: PropTypes.bool,
    }),
    tooltipContent: PropTypes.string,
    lines: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        dataKey: PropTypes.string.isRequired,
        stroke: PropTypes.string.isRequired,
      }),
    ).isRequired,
    footer: PropTypes.node.isRequired,
    loading: PropTypes.bool.isRequired,
    noResults: PropTypes.bool.isRequired,
    noResultsText: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: 'chart',
    width: '104%',
    height: 200,
    data: [],
    yAxis: { minTickGap: 40, axisLine: false },
    tooltipContent: null,
    cartesianGrid: { stroke: '#eee', horizontal: false },
  }

  state = {
    selectValue: this.props.selectOptions[0].value,
  };

  handleSelectChange = (selectValue) => {
    const item = this.props.selectOptions.find(option => option.value === selectValue);
    const to = item ? item.endDate : null;

    this.setState({
      selectValue,
    }, () => this.props.onSelectChange({
      from: this.state.selectValue,
      ...(to && { to }),
    }));
  };

  render() {
    const {
      headerTitle,
      className,
      width,
      height,
      data,
      yAxis: { minTickGap, axisLine },
      cartesianGrid: { stroke, horizontal },
      tooltipContent,
      lines,
      footer,
      loading,
      noResults,
      noResultsText,
      selectOptions,
    } = this.props;

    const { selectValue } = this.state;

    return (
      <Fragment>
        <div className="row mb-3">
          <div className="col font-size-20">
            {headerTitle}
          </div>
          <Select
            value={selectValue}
            customClassName="col-4 chart-select"
            onChange={this.handleSelectChange}
          >
            {selectOptions.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
        <Choose>
          <When condition={loading}>
            <div className="chart-short-loader">
              <ShortLoader height={25} />
            </div>
          </When>
          <Otherwise>
            <Choose>
              <When condition={!noResults}>
                <ResponsiveContainer className={className} width={width} height={height}>
                  <LineChart data={data}>
                    <YAxis minTickGap={minTickGap} axisLine={axisLine} />
                    <CartesianGrid stroke={stroke} horizontal={horizontal} />
                    <Tooltip {...(tooltipContent && { content: CustomTooltip(tooltipContent) })} />
                    {lines.map(({
                      type: lineType,
                      dataKey,
                      stroke: lineStroke,
                    }) => (
                      <Line
                        key={dataKey}
                        dataKey={dataKey}
                        type={lineType}
                        stroke={lineStroke}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </When>
              <Otherwise>
                <div className="no-results">{noResultsText}</div>
              </Otherwise>
            </Choose>
          </Otherwise>
        </Choose>
        {footer}
      </Fragment>
    );
  }
}

export default Chart;
