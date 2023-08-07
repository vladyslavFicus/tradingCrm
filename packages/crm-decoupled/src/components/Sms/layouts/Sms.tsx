import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import useSms from '../hooks/useSms';
import './Sms.scss';

type Props = {
  uuid: string,
  field: string,
  type: 'PROFILE' | 'LEAD',
};

const Sms = (props: Props) => {
  const { uuid, field, type } = props;

  const {
    isActive,
    sendSmsModal,
  } = useSms();

  return (
    <If condition={isActive}>
      <Button
        tertiary
        className="Sms__button"
        data-testid="Sms-smsButton"
        onClick={() => sendSmsModal.show({
          uuid,
          field,
          type,
        })}
      >
        {I18n.t('SMS.SMS')}
      </Button>
    </If>
  );
};

export default React.memo(Sms);
