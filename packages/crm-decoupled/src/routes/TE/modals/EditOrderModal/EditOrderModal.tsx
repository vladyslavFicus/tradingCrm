import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { permissions } from 'config';
import { usePermission } from 'providers/PermissionsProvider';
import { OrderStatus } from 'types/trading-engine';
import SymbolChart from 'components/SymbolChart';
import ShortLoader from 'components/ShortLoader';
import EditOrderForm from './forms/EditOrderForm';
import ActivatePendingOrderForm from './forms/ActivatePendingOrderForm';
import CloseOpenOrderForm from './forms/CloseOpenOrderForm';
import { useOrderQuery, OrderQuery } from './graphql/__generated__/OrderQuery';
import './EditOrderModal.scss';

type Order = OrderQuery['tradingEngine']['order'];

export type Props = {
  id: number,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const EditOrderModal = (props: Props) => {
  const {
    id,
    onCloseModal,
    onSuccess,
  } = props;

  const permission = usePermission();

  const orderQuery = useOrderQuery({ variables: { orderId: id } });

  const order = orderQuery.data?.tradingEngine.order || {} as Order;

  const {
    type,
    symbol,
    status,
    volumeLots,
    accountUuid,
  } = order;

  const isCloseAllowed = permission.allows(permissions.WE_TRADING.ORDER_CLOSE);
  const isActivateAllowed = permission.allows(permissions.WE_TRADING.ORDER_ACTIVATE);

  // ==== Handlers ==== //
  const _onSuccess = async (shouldCloseModal = false) => {
    await orderQuery.refetch();

    onSuccess();

    if (shouldCloseModal) {
      onCloseModal();
    }
  };

  return (
    <Modal className="EditOrderModal" toggle={onCloseModal} isOpen>
      <ModalHeader toggle={onCloseModal}>
        <Choose>
          <When condition={orderQuery.loading}>
            {I18n.t('COMMON.LOADING')}
          </When>
          <Otherwise>
            {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TITLE', {
              id,
              type: I18n.t(`TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.${type}`),
              volumeLots,
              symbol,
            })}
          </Otherwise>
        </Choose>
      </ModalHeader>

      <Choose>
        <When condition={orderQuery.loading}>
          <ShortLoader className="EditOrderModal--loading" />
        </When>

        <Otherwise>
          <ModalBody>
            <div className="EditOrderModal__inner-wrapper">
              <SymbolChart
                className="EditOrderModal__chart"
                accountUuid={accountUuid}
                symbol={symbol}
                bidLineColor={order.status === OrderStatus.CANCELED ? '#808080' : undefined}
                askLineColor={order.status === OrderStatus.CANCELED ? '#808080' : undefined}
              />

              <div className="EditOrderModal__form">
                <EditOrderForm order={order} onSuccess={_onSuccess} />

                <Choose>
                  <When condition={status === OrderStatus.PENDING && isActivateAllowed}>
                    <ActivatePendingOrderForm order={order} onSuccess={_onSuccess} />
                  </When>
                  <When condition={status === OrderStatus.OPEN && isCloseAllowed}>
                    <CloseOpenOrderForm order={order} onSuccess={_onSuccess} />
                  </When>
                </Choose>
              </div>
            </div>
          </ModalBody>
        </Otherwise>
      </Choose>
    </Modal>
  );
};

export default React.memo(EditOrderModal);
