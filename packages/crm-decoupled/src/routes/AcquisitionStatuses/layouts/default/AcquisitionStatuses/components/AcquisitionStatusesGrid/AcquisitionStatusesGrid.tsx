import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import { Constants } from '@crm/common';
import { TrashButton } from 'components';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import { Table, Column } from 'components/Table';
import useAcquisitionStatuses, {
  AcquisitionStatus,
} from 'routes/AcquisitionStatuses/hooks/useAcquisitionStatuses';
import './AcquisitionStatusesGrid.scss';

const AcquisitionStatusesGrid = () => {
  const {
    allowsDeleteAcquisitionStatus,
    loading,
    acquisitionStatuses,
    handleDeleteStatusClick,
  } = useAcquisitionStatuses();

  // ===== Renders ===== //
  const renderStatusName = useCallback(({ type, status }: AcquisitionStatus) => (
    <div className="AcquisitionStatusesGrid__text-primary">
      <If condition={type === AcquisitionStatusTypes.SALES}>
        {I18n.t(Constants.salesStatuses[status], { defaultValue: status })}
      </If>

      <If condition={type === AcquisitionStatusTypes.RETENTION}>
        {I18n.t(Constants.retentionStatuses[status], { defaultValue: status })}
      </If>
    </div>
  ), []);

  const renderAcquisitionType = useCallback(({ type }: AcquisitionStatus) => (
    <div className="AcquisitionStatusesGrid__text-primary">
      {I18n.t(`SETTINGS.ACQUISITION_STATUSES.TYPES.${type}`)}
    </div>
  ), []);

  const renderAcquisitionAction = useCallback((acquisitionStatus: AcquisitionStatus) => (
    // All "NEW" statuses is non-deletable
    <If condition={acquisitionStatus.status !== 'NEW'}>
      <TrashButton
        data-testid="AcquisitionStatuses-trashButton"
        onClick={() => handleDeleteStatusClick(acquisitionStatus)}
      />
    </If>
  ), []);

  return (
    <div className="AcquisitionStatusesGrid">
      <Table
        stickyFromTop={125}
        items={acquisitionStatuses}
        loading={loading}
        customClassNameRow="AcquisitionStatusesGrid__table-row"
      >
        <Column
          header={I18n.t('SETTINGS.ACQUISITION_STATUSES.GRID.STATUS_NAME')}
          render={renderStatusName}
        />

        <Column
          header={I18n.t('SETTINGS.ACQUISITION_STATUSES.GRID.ACQUISITION')}
          render={renderAcquisitionType}
        />

        <If condition={allowsDeleteAcquisitionStatus}>
          <Column
            width={120}
            header={I18n.t('SETTINGS.ACQUISITION_STATUSES.GRID.ACTIONS')}
            render={renderAcquisitionAction}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(AcquisitionStatusesGrid);
