import { Config, useModal } from '@crm/common';
import { SendSmsModalProps } from 'modals/SendSmsModal';
import SendSmsModal from 'modals/SendSmsModal/SendSmsModal';

const useSms = () => {
  const { isActive } = Config.getBrand().sms.fullSms;

  // ===== Modals ===== //
  const sendSmsModal = useModal<SendSmsModalProps>(SendSmsModal);

  return {
    isActive,
    sendSmsModal,
  };
};

export default useSms;
