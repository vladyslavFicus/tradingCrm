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
import { FormikInputField, FormikSelectField } from 'components/Formik';
import SymbolsQuery from './graphql/SymbolsQuery';
import { Symbol } from '../../types';
import './GroupNewSymbolModal.scss';

interface SymbolsData {
  tradingEngineAdminSymbols: QueryPageable<Symbol>
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
  modifiedSymbol: Symbol,
}

const GroupNewSymbolModal = ({
  isOpen,
  notify,
  onCloseModal,
  onSuccess,
  symbolsQuery,
  modifiedSymbol,
}: Props) => {
  // TODO: fix mock data
  const symbols = symbolsQuery.data?.tradingEngineAdminSymbols?.content || [{
    symbolId: new Date(),
    symbol: 'BTSUSDT',
    percentage: 10,
    swapConfigs: {
      long: 3,
      short: 5,
    },
  }];

  // TODO: fix type any
  const handleSymbolChange = (value: string, setValues: any) => {
    const formikValues = symbols.find(({ symbol }: Symbol) => symbol === value) || {};
    setValues(formikValues);
  };

  const handleSubmit = (symbol: Symbol) => {
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.TITLE'),
      message: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.NOTIFICATION.SUCCESS'),
    });
    onSuccess(symbol);
    onCloseModal();
  };

  return (
    <Modal
      className="GroupNewSymbolModal"
      toggle={onCloseModal}
      isOpen={isOpen}
      keyboard={false}
    >
      <Formik
        initialValues={
          modifiedSymbol || {
            symbolId: '',
            symbol: '',
            percentage: 0,
            swapConfigs: {
              long: 0,
              short: 0,
            },
          }}
        validate={createValidator(
          {
            symbol: ['required'],
            percentage: ['required', 'numeric', 'min:1', 'max:10000000000'],
            'swapConfigs.long': ['required', 'numeric', 'min:-10000000000', 'max:10000000000'],
            'swapConfigs.short': ['required', 'numeric', 'min:-10000000000', 'max:10000000000'],
          },
          {
            symbol: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.SYMBOL'),
            percentage: I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.MARGIN_PERCENTAGE'),
            'swapConfigs.long': I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.LONG_POSITION_SWAP'),
            'swapConfigs.short': I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.SHORT_POSITION_SWAP'),
          },
          false,
        )}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, setValues }: FormikProps<Symbol>) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.TITLE')}
            </ModalHeader>

            <div className="GroupNewSymbolModal__description">
              {I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.DESCRIPTION')}
            </div>

            <ModalBody>
              <div className="GroupNewSymbolModal__fields">
                <Field
                  name="symbol"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.SYMBOL')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  className="GroupNewSymbolModal__field--large"
                  component={FormikSelectField}
                  customOnChange={(value: string) => handleSymbolChange(value, setValues)}
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
                  name="swapConfigs.long"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_NEW_SYMBOL_MODAL.LONG_POSITION_SWAP')}
                  className="GroupNewSymbolModal__field"
                  component={FormikInputField}
                  type="number"
                />
                <Field
                  name="swapConfigs.short"
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
