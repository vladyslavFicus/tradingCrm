import { useCallback, useState } from 'react';
import { DateRange, SelectOption } from 'routes/Dashboard/types';
import { chartSelectOptions } from 'routes/Dashboard/constants';

type UseChartWidget = {
  expanded: boolean,
  selectOption: SelectOption,
  toggleExpand: () => void,
  handleSelectChange: (value: SelectOption) => void,
};

const useChartWidget = (onSelectChange: (value: DateRange) => void): UseChartWidget => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<SelectOption>(SelectOption.LAST_7_DAYS);

  const toggleExpand = useCallback(() => {
    setExpanded(prevExpand => !prevExpand);
  }, []);

  // ===== Handlers ===== //
  const handleSelectChange = useCallback((value: SelectOption) => {
    setSelectOption(value);

    onSelectChange(chartSelectOptions[value].range);
  }, [onSelectChange]);

  return {
    expanded,
    selectOption,
    toggleExpand,
    handleSelectChange,
  };
};

export default useChartWidget;
