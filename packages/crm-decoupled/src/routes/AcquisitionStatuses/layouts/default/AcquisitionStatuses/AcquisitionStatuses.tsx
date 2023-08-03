import React from 'react';
import AcquisitionStatusesHeader from './components/AcquisitionStatusesHeader';
import AcquisitionStatusesFilter from './components/AcquisitionStatusesFilter';
import AcquisitionStatusesGrid from './components/AcquisitionStatusesGrid';
import './AcquisitionStatuses.scss';

const AcquisitionStatuses = () => (
  <div className="AcquisitionStatuses">
    <AcquisitionStatusesHeader />

    <AcquisitionStatusesFilter />

    <AcquisitionStatusesGrid />
  </div>
);

export default React.memo(AcquisitionStatuses);
