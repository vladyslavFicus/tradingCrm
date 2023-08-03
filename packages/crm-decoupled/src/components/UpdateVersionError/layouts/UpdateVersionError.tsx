import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components/Buttons';
import useUpdateVersionError from '../hooks/useUpdateVersionError';
import './UpdateVersionError.scss';

type Props = {
  newVersion?: string,
};

const UpdateVersionError = (props: Props) => {
  const { newVersion } = props;

  const { handleClearCacheData } = useUpdateVersionError({ newVersion });

  return (
    <div className="UpdateVersionError">
      <div className="UpdateVersionError__dialog">
        <div className="UpdateVersionError__header">
          {I18n.t('COMMON.UPDATE_VERSION_MODAL.TITLE')}
        </div>

        <div className="UpdateVersionError__content">
          {I18n.t('COMMON.UPDATE_VERSION_MODAL.TEXT')}
        </div>

        <div className="UpdateVersionError__footer">
          <Button
            type="submit"
            danger
            onClick={handleClearCacheData}
          >
            {I18n.t('COMMON.BUTTONS.UPDATE_NOW')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UpdateVersionError);
