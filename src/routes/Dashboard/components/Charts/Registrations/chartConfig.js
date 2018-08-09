import CustomTooltip from '../../../../../components/Chart/CustomTooltip';

export default data => ({
  type: 'lineChart',
  className: 'chart',
  width: '104%',
  height: 200,
  data,
  yAxis: { minTickGap: 40, axisLine: false },
  cartesianGrid: { stroke: '#eee', horizontal: false },
  tooltip: { content: CustomTooltip },
  lines: [{
    type: 'monotone',
    dataKey: 'entries',
    stroke: '#c51d98',
  }],
});
