import I18n from 'i18n-js';
import React from 'react';
import { notify, LevelType } from 'providers/NotificationProvider';
import Select from 'components/Select';
import { AvailableColumns, Config } from '../types';
import { useCreateGridConfigMutation } from '../graphql/__generated__/CreateGridConfigMutation';
import { useUpdateGridConfigMutation } from '../graphql/__generated__/UpdateGridConfigMutation';
import './GridConfig.scss';

type Props = {
  gridConfig: Config,
  columnsSet: Array<string>,
  availableColumnsSet: AvailableColumns,
  onUpdate: (values: [string]) => void,
};

const GridConfig = (props: Props) => {
  const {
    gridConfig,
    onUpdate,
    columnsSet = [],
    availableColumnsSet,
  } = props;

  const [createGridConfigMutation] = useCreateGridConfigMutation();
  const [updateGridConfigMutation] = useUpdateGridConfigMutation();

  const saveOrCreateGridConfig = async (values: Array<string> = []) => {
    try {
      if (gridConfig?.uuid) {
        await updateGridConfigMutation({ variables: { uuid: gridConfig?.uuid, columns: values } });
      } else {
        await createGridConfigMutation({ variables: { type: gridConfig.type, columns: values } });
      }
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('GRID_CONFIG.NOTIFICATIONS.SETTINGS_UPDATED'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('GRID_CONFIG.NOTIFICATIONS.SETTINGS_NOT_UPDATED'),
      });
    }
  };

  return (
    <div className="GridConfig">
      <Select
        // @ts-ignore Component withRouter HOC types issue
        multiple
        value={columnsSet}
        onChange={saveOrCreateGridConfig}
        onRealtimeChange={onUpdate}
        customSelectBlockClassName="GridConfig__select-block"
        customSelectBlockContainerClassName="GridConfig__select-block-container"
        customArrowComponent={<i className="fa fa-cog" />}
      >
        {
          availableColumnsSet.map(({ name, header }) => (
            <option key={name} value={name}>{header}</option>
          ))
        }
      </Select>
    </div>
  );
};

export default React.memo(GridConfig);
