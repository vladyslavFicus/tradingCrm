import React from 'react';
import I18n from 'i18n-js';
import Select from 'components/Select';
import useChangeFileStatusDropDown
  from 'routes/Clients/routes/Client/routes/ClientFilesTab/hooks/useChangeFileStatusDropDown';
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

  const { currentValue, handleChange } = useChangeFileStatusDropDown({ onChangeStatus, uuid, status });

  return (
  // @ts-ignore Select component write by js
    <Select
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
