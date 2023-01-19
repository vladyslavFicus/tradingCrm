import { ChartData__Summary__Enum as SummaryEnum } from '__generated__/types';
import { SummaryColumn } from './types';

export const SUMMURY_COLUMNS: SummaryColumn[] = [{
  label: 'COMMON.CHART_FOOTER.TOTAL',
  key: SummaryEnum.TOTAL,
}, {
  label: 'COMMON.CHART_FOOTER.THIS_MONTH',
  key: SummaryEnum.MONTH,
}, {
  label: 'COMMON.CHART_FOOTER.TODAY',
  key: SummaryEnum.TODAY,
}];
