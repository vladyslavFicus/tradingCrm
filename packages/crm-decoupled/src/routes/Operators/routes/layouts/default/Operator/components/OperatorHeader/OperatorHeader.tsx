import React from 'react';
import I18n from 'i18n-js';
import { Operator } from '__generated__/types';
import { Button } from 'components/Buttons';
import Uuid from 'components/Uuid';
import useOperatorHeader from 'routes/Operators/routes/hooks/useOperatorHeader';
import './OperatorHeader.scss';

type Props = {
  operator: Operator,
};

const OperatorHeader = (props: Props) => {
  const {
    operator: {
      operatorStatus,
      fullName,
      country,
      uuid,
    },
  } = props;

  const {
    allowResetPassword,
    allowChangePassword,
    isLock,
    handleUnlockOperatorLogin,
    handleOpenResetPasswordModal,
    handleOpenChangePasswordModal,
  } = useOperatorHeader(props);

  return (
    <div className="OperatorHeader">
      <div className="OperatorHeader__topic">
        <div className="OperatorHeader__title">{fullName}</div>

        <div className="OperatorHeader__uuid">
          <If condition={!!uuid}>
            <Uuid uuid={uuid} />
          </If>

          <If condition={!!country}>
            <span>- {country}</span>
          </If>
        </div>
      </div>

      <div className="OperatorHeader__actions">
        <If condition={isLock}>
          <Button
            className="OperatorHeader__action"
            data-testid="OperatorHeader-unlockButton"
            onClick={handleUnlockOperatorLogin}
            primary
            small
          >
            {I18n.t('OPERATOR_PROFILE.PROFILE.HEADER.UNLOCK')}
          </Button>
        </If>

        <If condition={allowResetPassword && operatorStatus === 'ACTIVE'}>
          <Button
            className="OperatorHeader__action"
            data-testid="OperatorHeader-resetPasswordButton"
            onClick={handleOpenResetPasswordModal}
            primary
            small
          >
            {I18n.t('OPERATOR_PROFILE.RESET_PASSWORD')}
          </Button>
        </If>

        <If condition={allowChangePassword}>
          <Button
            className="OperatorHeader__action"
            data-testid="OperatorHeader-changePasswordButton"
            onClick={handleOpenChangePasswordModal}
            primary
            small
          >
            {I18n.t('OPERATOR_PROFILE.CHANGE_PASSWORD')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default React.memo(OperatorHeader);
