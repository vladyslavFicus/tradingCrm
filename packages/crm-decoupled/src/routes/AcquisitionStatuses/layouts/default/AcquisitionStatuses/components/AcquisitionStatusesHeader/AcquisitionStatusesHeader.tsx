import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components/Buttons';
import useAcquisitionStatuses from 'routes/AcquisitionStatuses/hooks/useAcquisitionStatuses';
import './AcquisitionStatusesHeader.scss';

const AcquisitionStatusesHeader = () => {
  const {
    allowsCreateAcquisitionStatus,
    loading,
    acquisitionStatuses,
    handleCreateClick,
  } = useAcquisitionStatuses();

  return (
    <div className="AcquisitionStatusesHeader">
      <div>
        <strong>{!loading && acquisitionStatuses.length}</strong>
        &nbsp;{I18n.t('SETTINGS.ACQUISITION_STATUSES.HEADLINE')}
      </div>

      <If condition={allowsCreateAcquisitionStatus}>
        <Button
          data-testid="AcquisitionStatuses-addStatusButton"
          onClick={handleCreateClick}
          tertiary
          small
        >
          {I18n.t('SETTINGS.ACQUISITION_STATUSES.ADD_STATUS')}
        </Button>
      </If>
    </div>
  );
};

export default React.memo(AcquisitionStatusesHeader);
