import { useModal } from 'providers/ModalProvider';
import { Payment } from '__generated__/types';
import { PaymentDetailsModalProps } from 'modals/PaymentDetailsModal';
import PaymentDetailsModal from 'modals/PaymentDetailsModal/PaymentDetailsModal';

type Props = {
  payment: Payment,
  onSuccess: () => void,
};

const useGridPaymentInfo = (props: Props) => {
  const {
    payment,
    onSuccess,
  } = props;

  const paymentDetailsModal = useModal<PaymentDetailsModalProps>(PaymentDetailsModal);

  const handleOpenDetailModal = () => {
    paymentDetailsModal.show({ payment, onSuccess });
  };

  return { handleOpenDetailModal };
};

export default useGridPaymentInfo;
