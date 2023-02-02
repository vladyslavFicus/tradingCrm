import React, { useState } from 'react';
import I18n from 'i18n-js';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { Modal, ModalBody } from 'reactstrap';
import { TooltipProps } from 'recharts';
import enumToArray from 'utils/enumToArray';
import Select from 'components/Select';
import { ChartTypes } from 'types/config';
import ShortLoader from 'components/ShortLoader';
import CustomTooltip from './components/CustomTooltip';
import LineChart from './components/LineChart';
import AreaChart from './components/AreaChart';
import BarHChart from './components/BarHChart';
import BarVChart from './components/BarVChart';
import { SUMMURY_COLUMNS } from './constants';
import { ChartData, DateRange, SummaryData, SelectOption } from './types';
import { valueFormatter, getChartSelectOptions, getSummaryValue } from './utils';
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
  chartType?: ChartTypes,
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
    chartType = ChartTypes.LINE,
    currncySymbol,
  } = props;

  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<SelectOption>(SelectOption.LAST_7_DAYS);

  const selectOptions = getChartSelectOptions();

  const toggleExpand = () => {
    setExpanded(expand => !expand);
  };

  const handleSelectChange = (value: SelectOption) => {
    setSelectOption(value);

    onSelectChange(selectOptions[value].range);
  };

  const renderTooltip = (tooltipProps: TooltipProps) => (
    <CustomTooltip
      tooltipProps={tooltipProps}
      tooltipTitle={tooltipTitle}
      currncySymbol={currncySymbol}
    />
  );

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
            // @ts-ignore
            value={selectOption}
            customClassName="ChartWidget__select"
            onChange={handleSelectChange}
          >
            {enumToArray(SelectOption).map(key => (
              <option key={key} value={key}>{selectOptions[key].label}</option>
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
                  <When condition={chartType === ChartTypes.AREA}>
                    <AreaChart data={data} chartColor={chartColor} renderTooltip={renderTooltip} />
                  </When>

                  <When condition={chartType === ChartTypes.BARH}>
                    <BarHChart data={data} chartColor={chartColor} renderTooltip={renderTooltip} />
                  </When>

                  <When condition={chartType === ChartTypes.BARV}>
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