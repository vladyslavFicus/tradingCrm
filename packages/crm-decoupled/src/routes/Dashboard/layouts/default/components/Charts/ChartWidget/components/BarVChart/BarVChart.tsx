import React from 'react';
import { ResponsiveContainer, CartesianGrid, BarChart, Bar, YAxis, Tooltip, XAxis } from 'recharts';
import { Chart } from 'routes/Dashboard/types';
import { getYAxisWidth, valueAxisFormatter, dateAxisFormatter } from 'routes/Dashboard/utils';

const BarVChart = (props: Chart) => {
  const { data, chartColor, renderTooltip } = props;

  return (
    <ResponsiveContainer className="ChartDiagram">
      <BarChart
        data={data}
        maxBarSize={30}
      >
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
          cursor={{ fill: chartColor, fillOpacity: 0.05 }}
          content={renderTooltip}
        />

        <CartesianGrid
          strokeDasharray="3 6"
          stroke="var(--text-tertiary)"
          horizontal={false}
        />

        <Bar
          dataKey="entryValue"
          fill={chartColor}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BarVChart);
