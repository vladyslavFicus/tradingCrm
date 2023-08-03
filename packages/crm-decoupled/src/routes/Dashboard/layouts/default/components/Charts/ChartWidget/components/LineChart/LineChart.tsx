import React from 'react';
import { ResponsiveContainer, LineChart as LineRechart, Line, YAxis, CartesianGrid, Tooltip, XAxis } from 'recharts';
import { Chart } from 'routes/Dashboard/types';
import { getYAxisWidth, valueAxisFormatter, dateAxisFormatter } from 'routes/Dashboard/utils';

const LineChart = (props: Chart) => {
  const { data, chartColor, renderTooltip } = props;

  return (
    <ResponsiveContainer className="ChartDiagram">
      <LineRechart data={data}>
        <XAxis
          stroke="var(--text-tertiary)"
          dataKey="entryDate"
          tickFormatter={dateAxisFormatter}
        />

        <YAxis
          minTickGap={40}
          width={getYAxisWidth(data)}
          tickFormatter={valueAxisFormatter}
          stroke="var(--text-tertiary)"
          allowDecimals={false}
        />

        <Tooltip
          cursor={{ strokeDasharray: '3 6', strokeWidth: 1.5 }}
          content={renderTooltip}
        />

        <CartesianGrid
          strokeDasharray="3 6"
          stroke="var(--text-tertiary)"
          horizontal={false}
        />

        <Line
          type="monotone"
          key="entryValue"
          dataKey="entryValue"
          stroke={chartColor}
        />
      </LineRechart>
    </ResponsiveContainer>
  );
};

export default React.memo(LineChart);
