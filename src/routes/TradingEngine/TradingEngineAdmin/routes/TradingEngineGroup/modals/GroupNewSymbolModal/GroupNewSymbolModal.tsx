import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { Button } from 'components/UI';
import { Query, QueryPageable } from 'types/query';
import { LevelType, Notify } from 'types/notify';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import SymbolsQuery from './graphql/SymbolsQuery';
import { Margin, Symbol } from '../../types';
import './GroupNewSymbolModal.scss';

interface SymbolsData {
  tradingEngineAdminSymbols: QueryPageable<Margin>
}

interface SymbolsVariables {
  args: {
    page: {
      from: number,
      size: number
    }
  }
}

interface SymbolsQueryResult extends Query<SymbolsData, SymbolsVariables> { }

interface Props {
  notify: Notify,
  isOpen: boolean,
  onCloseModal: () => void,
  onSuccess: (security: any) => void,
  symbolsQuery: SymbolsQueryResult,
  editableGroupMargin: Margin,
}

const GroupNewSymbolModal = ({
  isOpen,
  notify,
  onCloseModal,
  onSuccess,
  symbolsQuery,
  editableGroupMargin,
}: Props) => {
  const { data, loading } = symbolsQuery || {};
  const symbols = data?.tradingEngineAdminSymbols?.content || [];

  const handleSubmit = (symbol: Symbol) => {
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.TITLE'),
      message: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.NOTIFICATION.SUCCESS'),
    });
    onSuccess(symbol);
    onCloseModal();
  };

  const handleSymbolChange = (value: string, setFieldValue: FormikProps<Margin>) => {
    const { symbol, percentage, swapConfigs } = symbols.find((_symbol: Symbol) => _symbol.symbol === value) || {};

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
          editableGroupMargin || {
            symbol: '',
            percentage: 0,
            swapLong: 0,
            swapShort: 0,
          }}
        validate={createValidator(
          {
            symbol: ['required'],
            percentage: ['required', 'numeric', 'min:1', 'max:10000000000'],
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
        )}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, setFieldValue }: FormikProps<Symbol>) => (
          <Form>

            <ModalHeader toggle={onCloseModal}>
              <Choose>
                <When condition={loading}>
                  {I18n.t('COMMON.LOADING')}
                </When>
                <Otherwise>
                  {I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.TITLE')}
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

export default compose(
  withRequests({
    symbolsQuery: SymbolsQuery,
  }),
  withNotifications,
)(React.memo(GroupNewSymbolModal));
