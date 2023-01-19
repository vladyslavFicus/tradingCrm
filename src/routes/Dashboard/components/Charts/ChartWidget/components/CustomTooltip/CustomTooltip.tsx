import React from 'react';
import { TooltipProps } from 'recharts';
import moment from 'moment';
import I18n from 'i18n-js';
import { valueFormatter } from '../../utils';
import './CustomTooltip.scss';

type Props = {
  tooltipProps: TooltipProps,
  tooltipTitle: string,
  currncySymbol?: string,
};

const CustomTooltip = (props: Props) => {
  const { tooltipProps: { active, payload }, tooltipTitle, currncySymbol } = props;

  if (!active) {
    return null;
  }

  const { entryValue, entryDate } = payload?.[0].payload || {};
  const color = payload?.[0].color;

  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip__value" style={{ color }}>
        {tooltipTitle}
        <strong>{valueFormatter(entryValue, currncySymbol)}</strong>
      </div>

      <div className="custom-tooltip__date">
        {I18n.t('DASHBOARD.CHART.DATE')}: {moment(entryDate).format('DD-MM-YYYY')}
      </div>
    </div>
  );
};

export default CustomTooltip;
