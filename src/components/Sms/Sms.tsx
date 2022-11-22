import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { Modal } from 'types';
import withModals from 'hoc/withModals';
import { Button } from 'components/UI';
import SmsSendModal from './modals/SmsSendModal';
import './Sms.scss';

type SmsSendModalProps = {
  uuid: string,
  field: string,
  type: 'PROFILE' | 'LEAD',
}

type Props = {
  modals: {
    smsSendModal: Modal<SmsSendModalProps>,
  },
}

const Sms = (props: Props & SmsSendModalProps) => {
  const {
    uuid,
    field,
    type,
    modals: {
      smsSendModal,
    },
  } = props;
  const { isActive } = getBrand().sms.fullSms;

  return (
    <If condition={isActive}>
      <Button
        tertiary
        className="Sms__button"
        onClick={() => smsSendModal.show({
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

export default compose(
  React.memo,
  withModals({
    smsSendModal: SmsSendModal,
  }),
)(Sms);
