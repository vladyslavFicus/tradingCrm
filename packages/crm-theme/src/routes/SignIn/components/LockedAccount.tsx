import React from 'react';
import I18n from 'i18n-js';
import { ReactComponent as AccountIcon } from '../images/block-user.svg';
import './LockedAccount.scss';

type Props = {
  formError: string | null,
  onChange: () => void,
};

const LockedAccount = (props: Props) => {
  const { formError, onChange } = props;

  return (
    <div className="LockedAccount">
      <div className="LockedAccount__header">
        <AccountIcon className="LockedAccount__icon" />

        <span>{I18n.t('SIGN_IN.OOPS')}</span>
      </div>

      <div className="LockedAccount__error">
        {formError}
      </div>

      <div className="LockedAccount__link" onClick={onChange}>
        <i className="icon-arrow-left" />

        <span className="LockedAccount__link-text">
          {I18n.t('SIGN_IN.ANOTHER_ACCOUNT')}
        </span>
      </div>
    </div>
  );
};

export default React.memo(LockedAccount);
