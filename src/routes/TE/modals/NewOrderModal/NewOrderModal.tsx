import React, { useEffect, useState } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import Hotkeys from 'react-hot-keys';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Storage } from 'types/storage';
import { withStorage } from 'providers/StorageProvider';
import { accountTypesLabels } from 'constants/accountTypes';
import { Button, StaticTabs, StaticTabsItem } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import Badge from 'components/Badge';
import Input from 'components/Input';
import { useAccountQueryLazyQuery, AccountQuery } from './graphql/__generated__/AccountQuery';
import GeneralNewOrderForm from './forms/GeneralNewOrderForm';
import SmartPnLForm from './forms/SmartPnLForm';
import './NewOrderModal.scss';

export type Account = AccountQuery['tradingEngine']['account'];

interface Props {
  onSuccess: () => void,
  onCloseModal: () => void,
  storage: Storage,
  login?: string,
}

const NewOrderModal = (props: Props) => {
  const {
    onCloseModal,
    onSuccess,
    storage,
    login: propsLogin = '',
  } = props;

  const [login, setLogin] = useState<string>(propsLogin);
  const [symbol, setSymbol] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const [getAccount, accountQuery] = useAccountQueryLazyQuery({ fetchPolicy: 'network-only' });

  const account = accountQuery.data?.tradingEngine.account;

  const handleGetAccount = async () => {
    // Skip requesting account if login is empty or some query already in fly
    if (!login || accountQuery.loading) {
      return;
    }

    const { data } = await getAccount({ variables: { identifier: login } });

    if (data?.tradingEngine.account) {
      setFormError('');

      const { enable } = data?.tradingEngine.account;

      if (!enable) {
        setFormError(I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT_ARCHIVED'));
      }
    } else {
      setFormError(I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ERROR'));
    }
  };

  const handleOnSuccess = (orderId: number) => {
    // Save last created order to storage to open it later by request
    storage.set('TE.lastCreatedOrderId', orderId);

    onSuccess();
    onCloseModal();
  };

  useEffect(() => {
    // Load account and his allowed symbols
    if (login) {
      handleGetAccount();
    }
  }, []);

  return (
    <Modal className="NewOrderModal" toggle={onCloseModal} isOpen keyboard={false}>
      {/*
           Disable keyboard controlling on modal to prevent close modal by ESC button because it's working with a bug
           and after close by ESC button hotkeys not working when not clicking ESC button second time.
           So we should implement close event by ESC button manually.
        */}
      <Hotkeys keyName="esc" filter={() => true} onKeyUp={onCloseModal} />

      <ModalHeader toggle={onCloseModal}>
        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TITLE')}
      </ModalHeader>
      <ModalBody>
        <div className="NewOrderModal__inner-wrapper">
          <SymbolChart
            symbol={symbol}
            accountUuid={account?.uuid || ''}
            // Show loader while account loading or symbol wasn't chosen
            loading={accountQuery.loading || (account && !symbol)}
          />
          <div>
            <If condition={!!formError}>
              <div className="NewOrderModal__error">
                {formError}
              </div>
            </If>
            <div className="NewOrderModal__field-container">
              <Input
                autoFocus
                name="login"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.LOGIN')}
                value={login}
                className="NewOrderModal__field"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                onEnterPress={handleGetAccount}
                disabled={!!props.login}
              />
              <If condition={!props.login}>
                <Button
                  className="NewOrderModal__button NewOrderModal__button--small"
                  type="button"
                  primaryOutline
                  submitting={accountQuery.loading}
                  disabled={!login || accountQuery.loading}
                  onClick={handleGetAccount}
                >
                  {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPLOAD')}
                </Button>
              </If>
            </div>
            <If condition={!!account && account.enable}>
              <div className="NewOrderModal__field-container">
                <div className="NewOrderModal__account">
                  <div>
                    <Badge
                      text={I18n.t(accountTypesLabels[account?.accountType as string].label)}
                      info={account?.accountType === 'DEMO'}
                      success={account?.accountType === 'LIVE'}
                    >
                      <span className="NewOrderModal__account-label">
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.NAME')}:
                      </span>
                      &nbsp;{account?.name}
                    </Badge>
                    <div>
                      <span className="NewOrderModal__account-label">
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.GROUP')}:
                      </span>
                      &nbsp;{account?.group}
                    </div>
                  </div>
                  <div>
                    <div>
                      <span className="NewOrderModal__account-label">
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.BALANCE')}:
                      </span>
                      &nbsp;{I18n.toCurrency(account?.balance || 0, { unit: '' })}
                    </div>
                    <div>
                      <span className="NewOrderModal__account-label">
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.CREDIT')}:
                      </span>
                      &nbsp;{I18n.toCurrency(account?.credit || 0, { unit: '' })}
                    </div>
                  </div>
                </div>
              </div>
            </If>

            <StaticTabs
              navClassName="NewOrderModal__tabs-nav"
              navItemClassName="NewOrderModal__tabs-nav-item"
              contentClassName="NewOrderModal__tabs-content"
              onTabChanged={() => setSymbol('')} // Clear symbol selection when changed tab
            >
              <StaticTabsItem label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TABS.SMART_PNL')}>
                <SmartPnLForm
                  account={account}
                  symbol={symbol}
                  onSymbolChanged={setSymbol}
                  onSuccess={handleOnSuccess}
                />
              </StaticTabsItem>

              <StaticTabsItem label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TABS.NEW_ORDER')}>
                <GeneralNewOrderForm
                  account={account}
                  symbol={symbol}
                  onSymbolChanged={setSymbol}
                  onSuccess={handleOnSuccess}
                />
              </StaticTabsItem>
            </StaticTabs>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

NewOrderModal.defaultProps = {
  login: '',
};

export default compose(
  React.memo,
  withStorage,
)(NewOrderModal);
