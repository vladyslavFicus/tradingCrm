import React from 'react';
import { ResponsiveContainer, AreaChart as AreaRechart, Area, YAxis, CartesianGrid, Tooltip, XAxis } from 'recharts';
import { Chart } from 'routes/Dashboard/types';
import { getYAxisWidth, valueAxisFormatter, dateAxisFormatter } from 'routes/Dashboard/utils';

const AreaChart = (props: Chart) => {
  const { data, chartColor, renderTooltip } = props;

  return (
    <ResponsiveContainer className="ChartDiagram">
      <AreaRechart data={data}>
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

        <Area
          type="monotone"
          dataKey="entryValue"
          stroke={chartColor}
          fillOpacity={1}
          fill="url(#fillColor)"
        />

        <defs>
          <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColor} stopOpacity={0.9} />
            <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>
      </AreaRechart>
    </ResponsiveContainer>
  );
};

export default React.memo(AreaChart);
