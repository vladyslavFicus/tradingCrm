import I18n from 'i18n-js';
import React from 'react';
import compose from 'compose-function';
import { BaseMutationOptions, MutationResult } from '@apollo/client';
import { withNotifications } from 'hoc';
import { withRequests } from 'apollo';
import { LevelType, Notify } from 'types';
import Select from 'components/Select';
import CreateGridConfigMutation from '../graphql/CreateGridConfigMutation';
import UpdateGridConfigMutation from '../graphql/UpdateGridConfigMutation';
import { GridConfigType } from '../types';
import './GridConfig.scss';

type AvailableColumns = {
  name: string,
  header: string,
}

interface Props {
  columnsSet: [string],
  onUpdate: (values: [string]) => void,
  notify: Notify,
  createGridConfig: (options: BaseMutationOptions) => MutationResult<GridConfigType>,
  updateGridConfig: (options: BaseMutationOptions) => MutationResult<Boolean>,
  availableColumnsSet: [AvailableColumns]
  gridConfig: {
    type: string,
    uuid?: string,
  }
}

const GridConfig = (props: Props) => {
  const {
    gridConfig,
    onUpdate,
    columnsSet = [],
    availableColumnsSet,
    notify,
    updateGridConfig,
    createGridConfig,
  } = props;

  const saveOrCreateGridConfig = async (values: [string?] = []) => {
    try {
      if (gridConfig?.uuid) {
        await updateGridConfig({ variables: { ...gridConfig, columns: values } });
      } else {
        await createGridConfig({ variables: { ...gridConfig, columns: values } });
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
        // @ts-ignore
        multiple
        value={columnsSet}
        onChange={saveOrCreateGridConfig}
        onRealtimeChange={onUpdate}
        customSelectBlockClassName="GridConfig__select-block"
        customSelectBlockContainerClassName="GridConfig__select-block-container"
        customArrowComponent={<i className="fa fa-settings" />}
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

export default compose(
  React.memo,
  withNotifications,
  withRequests({
    createGridConfig: CreateGridConfigMutation,
    updateGridConfig: UpdateGridConfigMutation,
  }),
)(GridConfig);