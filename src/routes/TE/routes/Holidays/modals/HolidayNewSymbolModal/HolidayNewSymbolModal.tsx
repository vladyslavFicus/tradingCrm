import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { differenceWith } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { Button } from 'components/UI';
import { LevelType, Notify } from 'types/notify';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
import { FormikSelectField } from 'components/Formik';
import { useSymbolsQuery } from './graphql/__generated__/SymbolsQuery';
import './HolidayNewSymbolModal.scss';

interface Props {
  notify: Notify,
  isOpen: boolean,
  onCloseModal: () => void,
  onSuccess: (symbol: string) => void,
  symbols: string[],
}

interface FormValues {
  symbol: string,
}

const validate = createValidator(
  {
    symbol: 'required',
  },
  {
    symbol: I18n.t('TRADING_ENGINE.MODALS.HOLIDAY_NEW_SYMBOL_MODAL.SYMBOL'),
  },
  false,
);

const HolidayNewSymbolModal = (props: Props) => {
  const {
    isOpen,
    notify,
    onCloseModal,
    onSuccess,
    symbols: selectedSymbols,
  } = props;

  const symbolsQuery = useSymbolsQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 1000000,
        },
      },
    },
  });

  const { data, loading } = symbolsQuery;

  const symbolsData = data?.tradingEngine.symbols?.content || [];
  const symbols = differenceWith(
    symbolsData,
    selectedSymbols,
    (symbol, selectedSymbol) => symbol.symbol === selectedSymbol,
  );

  const handleSubmit = (values: FormValues) => {
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('TRADING_ENGINE.MODALS.HOLIDAY_NEW_SYMBOL_MODAL.TITLE'),
      message: I18n.t('TRADING_ENGINE.MODALS.HOLIDAY_NEW_SYMBOL_MODAL.NOTIFICATION.SUCCESS'),
    });

    onSuccess(values.symbol);
    onCloseModal();
  };

  const handleSymbolChange = (
    value: string,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  ) => {
    setFieldValue('symbol', value);
  };

  return (
    <Modal
      className="HolidayNewSymbolModal"
      toggle={onCloseModal}
      isOpen={isOpen}
    >
      <Formik
        initialValues={{
          symbol: '',
        }}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, setFieldValue }: FormikProps<FormValues>) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              <Choose>
                <When condition={loading}>
                  {I18n.t('COMMON.LOADING')}
                </When>
                <Otherwise>
                  {I18n.t('TRADING_ENGINE.MODALS.HOLIDAY_NEW_SYMBOL_MODAL.TITLE')}
                </Otherwise>
              </Choose>
            </ModalHeader>

            <Choose>
              <When condition={loading}>
                <ShortLoader className="HolidayNewSymbolModal__loader" />
              </When>
              <Otherwise>
                <ModalBody>
                  <div className="HolidayNewSymbolModal__description">
                    {I18n.t('TRADING_ENGINE.MODALS.HOLIDAY_NEW_SYMBOL_MODAL.DESCRIPTION')}
                  </div>

                  <div className="HolidayNewSymbolModal__fields">
                    <Field
                      name="symbol"
                      label={I18n.t('TRADING_ENGINE.MODALS.HOLIDAY_NEW_SYMBOL_MODAL.SYMBOL')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      className="HolidayNewSymbolModal__field--large"
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
  React.memo,
  withNotifications,
)(HolidayNewSymbolModal);
