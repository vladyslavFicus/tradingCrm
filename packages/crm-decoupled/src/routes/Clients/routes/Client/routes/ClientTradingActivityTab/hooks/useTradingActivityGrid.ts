import { Config } from '@crm/common';
import { useModal } from 'providers/ModalProvider';
import { TradingActivity } from '__generated__/types';
import UpdateTradingActivityModal, { UpdateTradingActivityModalProps } from 'modals/UpdateTradingActivityModal';

type Props = {
  onRefetch: () => void,
};

type UseTradingActivityGrid = {
  columnsOrder: Array<string>,
  handleShowUpdateTradingActivityModal: (tradingActivity: TradingActivity) => void,
};

const useTradingActivityGrid = (props: Props): UseTradingActivityGrid => {
  const { onRefetch } = props;

  const columnsOrder = Config.getBackofficeBrand()?.tables?.clientTradingActivity?.columnsOrder || [];

  // ===== Modals ===== //
  const updateTradingActivityModal = useModal<UpdateTradingActivityModalProps>(UpdateTradingActivityModal);

  // ===== Handlers ===== //
  const handleShowUpdateTradingActivityModal = (tradingActivity: TradingActivity) => {
    const { tradeId, originalAgent, platformType } = tradingActivity;

    updateTradingActivityModal.show({
      tradeId,
      originalAgent: originalAgent || undefined,
      platformType: platformType || undefined,
      onSuccess: onRefetch,
    });
  };

  return {
    columnsOrder,
    handleShowUpdateTradingActivityModal,
  };
};

export default useTradingActivityGrid;
