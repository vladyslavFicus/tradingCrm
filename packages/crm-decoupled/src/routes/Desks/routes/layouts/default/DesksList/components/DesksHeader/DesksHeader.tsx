import React from 'react';
import './DesksHeader.scss';
import I18n from 'i18n-js';
import { Button } from 'components/Buttons';
import useDesks from 'routes/Desks/routes/hooks/useDesks';

const DesksHeader = () => {
  const {
    allowCreateBranch,
    totalCount,
    handleOpenAddDeskModal,
  } = useDesks();

  return (
    <div className="DesksHeader">
      <div className="DesksHeader__title">
        <strong>{totalCount} </strong>

        {I18n.t('DESKS.DESKS')}
      </div>

      <If condition={allowCreateBranch}>
        <Button
          data-testid="DesksList-addDeskButton"
          onClick={handleOpenAddDeskModal}
          tertiary
        >
          {I18n.t('DESKS.ADD_DESK')}
        </Button>
      </If>
    </div>
  );
};

export default React.memo(DesksHeader);
