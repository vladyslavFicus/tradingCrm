// @ts-nocheck Component withRouter HOC types issue
import I18n from 'i18n-js';
import React, { useState } from 'react';
import { notify, LevelType } from '@crm/common';
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

  const [createUuid, setCreateUuid] = useState<string | null>(null);

  const [createGridConfigMutation] = useCreateGridConfigMutation();
  const [updateGridConfigMutation] = useUpdateGridConfigMutation();

  const saveOrCreateGridConfig = async (values: Array<string> = []) => {
    const uuid = gridConfig.uuid || createUuid;

    try {
      if (uuid) {
        await updateGridConfigMutation({ variables: { uuid, columns: values } });
      } else {
        const { data } = await createGridConfigMutation({ variables: { type: gridConfig.type, columns: values } });

        if (data?.gridConfig.create?.uuid) {
          setCreateUuid(data.gridConfig.create.uuid);
        }
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
