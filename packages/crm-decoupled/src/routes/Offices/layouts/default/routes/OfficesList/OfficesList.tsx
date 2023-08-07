import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import useOfficesList from 'routes/Offices/hooks/useOfficesList';
import OfficesGridFilter from './components/OfficesGridFilter';
import OfficesGrid from './components/OfficesGrid';
import './OfficesList.scss';

const OfficesList = () => {
  const {
    allowCreateBranch,
    officesList,
    totalCount,
    loading,
    refetch,
    handleOpenAddOfficeModal,
  } = useOfficesList();

  return (
    <div className="OfficesList">
      <div className="OfficesList__header">
        <div className="OfficesList__title">
          <strong>{totalCount} </strong>

          {I18n.t('OFFICES.OFFICES')}
        </div>

        <If condition={allowCreateBranch}>
          <div className="OfficesList__actions">
            <Button
              tertiary
              onClick={handleOpenAddOfficeModal}
              data-testid="OfficesList-addOfficeButton"
            >
              {I18n.t('OFFICES.ADD_OFFICE')}
            </Button>
          </div>
        </If>
      </div>

      <OfficesGridFilter onRefetch={refetch} />

      <OfficesGrid loading={loading} officesList={officesList} onRefetch={refetch} />
    </div>
  );
};

export default React.memo(OfficesList);
