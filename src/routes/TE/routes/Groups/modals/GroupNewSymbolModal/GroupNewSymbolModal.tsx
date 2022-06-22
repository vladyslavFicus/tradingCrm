import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { differenceWith } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { Button } from 'components/UI';
import { LevelType, Notify } from 'types/notify';
import {
  TradingEngineGroup__GroupSymbol as GroupSymbol,
  TradingEngineGroup__GroupSecurity as GroupSecurity,
} from '__generated__/types';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
import { FormikCheckbox, FormikInputField, FormikSelectField } from 'components/Formik';
import { useSymbolsQuery } from './graphql/__generated__/SymbolsQuery';

import './GroupNewSymbolModal.scss';

const baseSymbols = ['EURUSD', 'EURGBP', 'GBPUSD'];

interface Props {
  notify: Notify,
  isOpen: boolean,
  onCloseModal: () => void,
  onSuccess: (symbol: GroupSymbol) => void,
  groupSymbol?: GroupSymbol,
  groupSymbols: GroupSymbol[],
  groupSecurities: GroupSecurity[],
}

const validate = createValidator(
  {
    symbol: ['required'],
    percentage: ['required', 'numeric', 'min:0.001', 'max:10000000'],
    swapLong: ['required', 'numeric', 'min:-10000000000', 'max:10000000000'],
    swapShort: ['required', 'numeric', 'min:-10000000000', 'max:10000000000'],
  },
  {
    symbol: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.SYMBOL'),
    percentage: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.MARGIN_PERCENTAGE'),
    swapLong: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.LONG_POSITION_SWAP'),
    swapShort: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.SHORT_POSITION_SWAP'),
  },
  false,
);

const GroupNewSymbolModal = ({
  isOpen,
  notify,
  onCloseModal,
  onSuccess,
  groupSymbol,
  groupSymbols,
  groupSecurities,
}: Props) => {
  const symbolsQuery = useSymbolsQuery({
    variables: {
      args: {
        securityNames: groupSecurities.map(({ security }) => security.name),
        page: {
          from: 0,
          size: 1000000,
        },
      },
    },
  });

  const { data, loading } = symbolsQuery;
  const symbolsData = data?.tradingEngine.symbols?.content || [];
  const symbols = differenceWith(symbolsData, groupSymbols, (_symbol, _margins) => _symbol.symbol === _margins.symbol);

  const handleSubmit = (symbol: GroupSymbol) => {
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.TITLE'),
      message: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.NOTIFICATION.SUCCESS'),
    });
    onSuccess(symbol);
    onCloseModal();
  };


  const handleSymbolChange = (
    value: string,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  ) => {
    const {
      symbol,
      securityId,
      percentage,
      swapConfigs,
    } = symbols.find(_symbol => _symbol.symbol === value) || {};

    setFieldValue('symbol', symbol);
    setFieldValue('securityId', securityId);
    setFieldValue('percentage', percentage || 0);
    setFieldValue('swapLong', swapConfigs?.long || 0);
    setFieldValue('swapShort', swapConfigs?.short || 0);
  };

  return (
    <Modal
      className="GroupNewSymbolModal"
      toggle={onCloseModal}
      isOpen={isOpen}
    >
      <Formik
        initialValues={
          groupSymbol || {
            symbol: '',
            securityId: -1,
            percentage: 0,
            swapLong: 0,
            swapShort: 0,
            enabled: true,
          }}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, setFieldValue, values }: FormikProps<GroupSymbol>) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              <Choose>
                <When condition={loading}>
                  {I18n.t('COMMON.LOADING')}
                </When>
                <Otherwise>
                  {groupSymbol
                    ? I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.EDIT_TITLE')
                    : I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.TITLE')
                  }
                </Otherwise>
              </Choose>
            </ModalHeader>

            <Choose>
              <When condition={loading}>
                <ShortLoader className="GroupNewSymbolModal__loader" />
              </When>
              <When condition={groupSecurities.length === 0}>
                <ModalBody>
                  <div className="GroupNewSymbolModal__description">
                    {I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.CHOOSE_AT_LEAST_1_SECURITY')}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={onCloseModal}
                    commonOutline
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>
                </ModalFooter>
              </When>
              <Otherwise>
                <ModalBody>
                  <div className="GroupNewSymbolModal__description">
                    {I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.DESCRIPTION')}
                  </div>
                  <Field
                    name="enabled"
                    component={FormikCheckbox}
                    label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.ENABLE')}
                    className="GroupNewSymbolModal__field  GroupNewSymbolModal__field--center"
                    disabled={baseSymbols.includes(values.symbol)}
                  />
                  <div className="GroupNewSymbolModal__fields">
                    <Field
                      name="symbol"
                      label={I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.SYMBOL')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      className="GroupNewSymbolModal__field--large"
                      component={FormikSelectField}
                      customOnChange={(value: string) => handleSymbolChange(value, setFieldValue)}
                      searchable
                      disabled={Boolean(groupSymbol)}
                    >
                      {symbols.map(({ symbol }) => (
                        <option key={symbol} value={symbol}>
                          {symbol}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div className="GroupNewSymbolModal__fields">
                    <Field
                      name="swapLong"
                      label={I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.LONG_POSITION_SWAP')}
                      className="GroupNewSymbolModal__field"
                      component={FormikInputField}
                      type="number"
                    />
                    <Field
                      name="swapShort"
                      label={I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.SHORT_POSITION_SWAP')}
                      className="GroupNewSymbolModal__field"
                      component={FormikInputField}
                      type="number"
                    />
                    <Field
                      name="percentage"
                      label={I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.MARGIN_PERCENTAGE')}
                      className="GroupNewSymbolModal__field"
                      component={FormikInputField}
                      type="number"
                    />
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    onClick={onCloseModal}
                    commonOutline
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!dirty || isSubmitting}
                    primary
                  >
                    {I18n.t('COMMON.SAVE')}
                  </Button>
                </ModalFooter>
              </Otherwise>
            </Choose>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

GroupNewSymbolModal.defaultProps = {
  groupSymbol: null,
};

export default compose(
  React.memo,
  withNotifications,
)(GroupNewSymbolModal);
