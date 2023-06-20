import React from 'react';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { useModal } from 'providers/ModalProvider';
import { Button } from 'components/Buttons';
import SendSmsModal, { SendSmsModalProps } from 'modals/SendSmsModal';
import './Sms.scss';

type Props = {
  uuid: string,
  field: string,
  type: 'PROFILE' | 'LEAD',
};

const Sms = (props: Props) => {
  const { uuid, field, type } = props;

  const { isActive } = getBrand().sms.fullSms;

  // ===== Modals ===== //
  const sendSmsModal = useModal<SendSmsModalProps>(SendSmsModal);

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
