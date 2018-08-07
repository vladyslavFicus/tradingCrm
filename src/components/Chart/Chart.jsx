import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Select from '../Select';
import ShortLoader from '../ShortLoader';
import options from './options';
import './Chart.scss';

class Chart extends Component {
  static propTypes = {
    headerTitle: PropTypes.string.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    config: PropTypes.shape({
      className: PropTypes.string,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        entries: PropTypes.number.isRequired,
      })),
      yAxis: PropTypes.shape({
        minTickGap: PropTypes.number,
        axisLine: PropTypes.bool,
      }),
      cartesianGrid: PropTypes.shape({
        stroke: PropTypes.string,
        horizontal: PropTypes.bool,
      }),
      tooltip: PropTypes.shape({
        content: PropTypes.func,
      }),
      lines: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          dataKey: PropTypes.string.isRequired,
          stroke: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
    footer: PropTypes.node,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    footer: null,
  };

  state = {
    selectValue: options[0].value,
  };

  handleSelectChange = (selectValue) => {
    const to = options.find(item => item.value === selectValue).endDate;

    this.setState({
      selectValue,
    }, () => this.props.onSelectChange({
      from: this.state.selectValue,
      ...(to && { to }),
    }));
  }

  render() {
    const {
      headerTitle,
      config: {
        className,
        width,
        height,
        data,
        yAxis: { minTickGap, axisLine },
        cartesianGrid: { stroke, horizontal },
        tooltip: { content },
        lines,
      },
      footer,
      loading,
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
            {options.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
        <Choose>
          <When condition={!loading}>
            <ResponsiveContainer className={className} width={width} height={height}>
              <LineChart data={data}>
                <YAxis minTickGap={minTickGap} axisLine={axisLine} />
                <CartesianGrid stroke={stroke} horizontal={horizontal} />
                <Tooltip content={content} />
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
            <div className="chart-short-loader">
              <ShortLoader height={25} />
            </div>
          </Otherwise>
        </Choose>
        <If condition={!loading}>
          {footer}
        </If>
      </Fragment>
    );
  }
}

export default Chart;
