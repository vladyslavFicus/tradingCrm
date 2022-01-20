import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { differenceWith } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { Button } from 'components/UI';
import { Query, Pageable } from 'types/query';
import { LevelType, Notify } from 'types/notify';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import SymbolsQuery from './graphql/SymbolsQuery';
import { SymbolEntity, Margin } from '../../types';
import './GroupNewSymbolModal.scss';

interface SymbolsData {
  tradingEngineAdminSymbols: Pageable<SymbolEntity>
}

interface SymbolsVariables {
  args: {
    page: {
      from: number,
      size: number,
    }
  }
}

interface SymbolsQueryResult extends Query<SymbolsData, SymbolsVariables> { }

interface Props {
  notify: Notify,
  isOpen: boolean,
  onCloseModal: () => void,
  onSuccess: (symbol: Margin) => void,
  symbolsQuery: SymbolsQueryResult,
  groupMargin?: Margin,
  groupMargins: Margin[],
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
  symbolsQuery,
  groupMargin,
  groupMargins,
}: Props) => {
  const { data, loading } = symbolsQuery;
  const symbolsData = data?.tradingEngineAdminSymbols?.content || [];
  const symbols = differenceWith(symbolsData, groupMargins, (_symbol, _margins) => _symbol.symbol === _margins.symbol);

  const handleSubmit = (symbol: Margin) => {
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
    const { symbol, percentage, swapConfigs } = symbols.find((_symbol: SymbolEntity) => _symbol.symbol === value) || {};

    setFieldValue('symbol', symbol);
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
          groupMargin || {
            symbol: '',
            percentage: 0,
            swapLong: 0,
            swapShort: 0,
          }}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, setFieldValue }: FormikProps<Margin>) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              <Choose>
                <When condition={loading}>
                  {I18n.t('COMMON.LOADING')}
                </When>
                <Otherwise>
                  {groupMargin
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
              <Otherwise>
                <ModalBody>
                  <div className="GroupNewSymbolModal__description">
                    {I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.DESCRIPTION')}
                  </div>

                  <div className="GroupNewSymbolModal__fields">
                    <Field
                      name="symbol"
                      label={I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.SYMBOL')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      className="GroupNewSymbolModal__field--large"
                      component={FormikSelectField}
                      customOnChange={(value: string) => handleSymbolChange(value, setFieldValue)}
                      searchable
                      disabled={Boolean(groupMargin)}
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
  groupMargin: null,
};

export default compose(
  React.memo,
  withNotifications,
  withRequests({
    symbolsQuery: SymbolsQuery,
  }),
)(GroupNewSymbolModal);