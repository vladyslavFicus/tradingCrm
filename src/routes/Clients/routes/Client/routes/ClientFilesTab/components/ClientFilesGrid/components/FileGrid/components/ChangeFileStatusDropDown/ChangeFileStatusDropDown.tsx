import React, { useState } from 'react';
import I18n from 'i18n-js';
import Select from 'components/Select';
import { statusesFile } from '../../constants';
import './ChangeFileStatusDropDown.scss';

type Props = {
  uuid: string,
  status: string,
  disabled: boolean,
  onChangeStatus: (uuid: string, status: string) => void,
};

const ChangeFileStatusDropDown = (props: Props) => {
  const { onChangeStatus, uuid, status, disabled } = props;

  const [currentValue, setCurrentValue] = useState(status);

  // ===== Handlers ===== //
  const handleChange = (value: string) => {
    onChangeStatus(uuid, value);
    setCurrentValue(value);
  };

  return (
    <Select
      // @ts-ignore Select component write by js
      customClassName="ChangeFileStatusDropDown"
      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
      value={currentValue}
      onChange={handleChange}
      disabled={disabled}
      hasTargetPortal
    >
      {statusesFile.map(({ value, label }) => (
        <option key={`${uuid}-${value}`} value={value}>{I18n.t(label)}</option>
      ))}
    </Select>
  );
};

export default React.memo(ChangeFileStatusDropDown);
