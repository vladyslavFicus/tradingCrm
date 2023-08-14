// @ts-nocheck
import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { Modal, ModalBody } from 'reactstrap';
import { TooltipProps } from 'recharts';
import { Utils, Types } from '@crm/common';
import { ShortLoader, Select } from 'components';
import { ChartData, DateRange, SummaryData, SelectOption } from 'routes/Dashboard/types';
import { chartSelectOptions } from 'routes/Dashboard/constants';
import { valueFormatter, getSummaryValue } from 'routes/Dashboard/utils';
import UseChartWidget from 'routes/Dashboard/hooks/useChartWidget';
import CustomTooltip from './components/CustomTooltip';
import LineChart from './components/LineChart';
import AreaChart from './components/AreaChart';
import BarHChart from './components/BarHChart';
import BarVChart from './components/BarVChart';
import { SUMMURY_COLUMNS } from './constants';
import { ReactComponent as ExpandIcon } from './img/expand.svg';
import { ReactComponent as CloseIcon } from './img/close.svg';
import './ChartWidget.scss';

type Props = {
  title: string,
  tooltipTitle: string,
  data: ChartData,
  summary: SummaryData,
  loading: boolean,
  noData: boolean,
  onSelectChange: (value: DateRange) => void,
  chartColor: string,
  chartType?: Types.ChartTypes,
  currncySymbol?: string,
};

const ChartWidget = (props: Props) => {
  const {
    title,
    tooltipTitle,
    data,
    summary,
    loading,
    noData,
    onSelectChange,
    chartColor,
    chartType = Types.ChartTypes.LINE,
    currncySymbol,
  } = props;

  const {
    expanded,
    selectOption,
    toggleExpand,
    handleSelectChange,
  } = UseChartWidget(onSelectChange);

  // ===== Renders ===== //
  const renderTooltip = useCallback((tooltipProps: TooltipProps) => (
    <CustomTooltip
      tooltipProps={tooltipProps}
      tooltipTitle={tooltipTitle}
      currncySymbol={currncySymbol}
    />
  ), [currncySymbol, tooltipTitle]);

  const renderContent = (inModal: boolean = false) => (
    <div className={classNames('ChartWidget', { 'ChartWidget--expanded': inModal })}>
      <div className="ChartWidget__header">
        <div className="ChartWidget__title">{title}</div>

        <div className="ChartWidget__right-container">
          <Choose>
            <When condition={!inModal}>
              <ExpandIcon className="ChartWidget__icon" onClick={toggleExpand} />
            </When>

            <Otherwise>
              <CloseIcon className="ChartWidget__icon" onClick={toggleExpand} />
            </Otherwise>
          </Choose>

          <Select
            // Required because the Select component is not the TS component and doesn't support typing
            value={selectOption}
            customClassName="ChartWidget__select"
            onChange={handleSelectChange}
          >
            {Utils.enumToArray(SelectOption).map(key => (
              <option key={key} value={key}>{chartSelectOptions[key].label}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="ChartWidget__body">
        <Choose>
          <When condition={loading}>
            <div className="ChartWidget__loader">
              <ShortLoader />
            </div>
          </When>

          <Otherwise>
            <Choose>
              <When condition={noData}>
                <div className="ChartWidget__error">{I18n.t('DASHBOARD.CHART.NO_RESULTS_TEXT')}</div>
              </When>

              <Otherwise>
                <Choose>
                  <When condition={chartType === Types.ChartTypes.AREA}>
                    <AreaChart data={data} chartColor={chartColor} renderTooltip={renderTooltip} />
                  </When>

                  <When condition={chartType === Types.ChartTypes.BARH}>
                    <BarHChart data={data} chartColor={chartColor} renderTooltip={renderTooltip} />
                  </When>

                  <When condition={chartType === Types.ChartTypes.BARV}>
                    <BarVChart data={data} chartColor={chartColor} renderTooltip={renderTooltip} />
                  </When>

                  <Otherwise>
                    <LineChart data={data} chartColor={chartColor} renderTooltip={renderTooltip} />
                  </Otherwise>
                </Choose>
              </Otherwise>
            </Choose>
          </Otherwise>
        </Choose>
      </div>

      <div className="ChartWidget__footer">
        {SUMMURY_COLUMNS.map(({ key, label }) => (
          <div key={key} className="ChartWidget__footer-item">
            <div className="ChartWidget__footer-item-title">
              {I18n.t(label)}
            </div>

            <div className="ChartWidget__footer-item-value" style={{ color: chartColor }}>
              <Choose>
                <When condition={isEmpty(summary) || noData}>
                  <span>&mdash;</span>
                </When>

                <Otherwise>
                  {valueFormatter(getSummaryValue(summary, key), currncySymbol)}
                </Otherwise>
              </Choose>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModal = () => (
    <Modal className="ChartWidget__modal" toggle={toggleExpand} isOpen={expanded}>
      <ModalBody>
        {renderContent(true)}
      </ModalBody>
    </Modal>
  );

  return (
    <>
      {renderContent()}
      {renderModal()}
    </>
  );
};

export default React.memo(ChartWidget);
