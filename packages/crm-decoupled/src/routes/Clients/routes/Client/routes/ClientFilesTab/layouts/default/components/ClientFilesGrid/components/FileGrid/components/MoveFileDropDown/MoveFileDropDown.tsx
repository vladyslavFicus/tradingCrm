import React from 'react';
import I18n from 'i18n-js';
import Select from 'components/Select';
import { FileCategories } from 'types/fileCategories';
import useMoveFileDropDown from 'routes/Clients/routes/Client/routes/ClientFilesTab/hooks/useMoveFileDropDown';
import { VerificationType } from 'routes/Clients/routes/Client/routes/ClientFilesTab/types/clientFilesGrid';
import './MoveFileDropDown.scss';

type Props = {
  uuid: string,
  verificationType: string,
  documentType: string,
  categories: FileCategories,
  disabled: Boolean,
  onMoveChange: (value: VerificationType) => void,
};

const MoveFileDropDown = (props: Props) => {
  const { uuid, verificationType, documentType, categories, disabled, onMoveChange } = props;

  const { currentValue, handleChange } = useMoveFileDropDown({ verificationType, documentType, onMoveChange });

  return (
    <Select
      // @ts-ignore Select component write by js
      customClassName="MoveFileDropDown"
      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
      value={currentValue}
      onChange={handleChange}
      disabled={disabled}
      hasTargetPortal
    >
      {Object.entries(categories)
        .filter(([category]) => category !== 'OTHER')
        .map(([key, value]) => (value.map(item => (
          <option
            key={`${uuid}-${key}-${item}`}
            value={JSON.stringify({ verificationType: key, documentType: item })}
          >
            {`${I18n.t(`FILES.CATEGORIES.${key}`)} > ${I18n.t(`FILES.DOCUMENT_TYPES.${item}`)}`}
          </option>
        )))).flat()}
    </Select>
  );
};

export default React.memo(MoveFileDropDown);
