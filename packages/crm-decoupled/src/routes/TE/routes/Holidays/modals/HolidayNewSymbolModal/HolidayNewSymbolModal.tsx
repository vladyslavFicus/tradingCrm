import React from 'react';
import I18n from 'i18n-js';
import { differenceWith, sortBy } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { Utils, notify, Types } from '@crm/common';
import { Button, ShortLoader } from 'components';
import { FormikSelectField } from 'components/Formik';
import { useSymbolsSourcesQuery } from './graphql/__generated__/SymbolsSourcesQuery';
import './HolidayNewSymbolModal.scss';

export type Props = {
  onCloseModal: () => void,
  onSuccess: (symbols: string[]) => void,
  symbols: string[],
}

type FormValues = {
  symbols: string[],
}

const validate = Utils.createValidator(
  {
    symbols: 'required',
  },
  {
    symbols: I18n.t('TRADING_ENGINE.MODALS.HOLIDAY_NEW_SYMBOL_MODAL.SYMBOL'),
  },
  false,
);

const HolidayNewSymbolModal = (props: Props) => {
  const {
    onCloseModal,
    onSuccess,
    symbols: selectedSymbols,
  } = props;

  const symbolsSourcesQuery = useSymbolsSourcesQuery();

  const { data, loading } = symbolsSourcesQuery;

  const symbolsSourcesData = data?.tradingEngine.symbolsSources || [];

  const symbolsSources = sortBy(differenceWith(
    symbolsSourcesData,
    selectedSymbols,
    (symbol, selectedSymbol) => symbol.sourceName === selectedSymbol,
  ), 'sourceName');

  const handleSubmit = (values: FormValues) => {
    notify({
      level: Types.LevelType.SUCCESS,
      title: I18n.t('TRADING_ENGINE.MODALS.HOLIDAY_NEW_SYMBOL_MODAL.TITLE'),
      message: I18n.t('TRADING_ENGINE.MODALS.HOLIDAY_NEW_SYMBOL_MODAL.NOTIFICATION.SUCCESS'),
    });
    onSuccess(values.symbols);
    onCloseModal();
  };
  return (
    <Modal
      className="HolidayNewSymbolModal"
      toggle={onCloseModal}
    >
      <Formik
        initialValues={{
          symbols: [],
        }}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting }: FormikProps<FormValues>) => (
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
                      name="symbols"
                      data-testid="HolidayNewSymbolModal-symbolsSelect"
                      label={I18n.t('TRADING_ENGINE.MODALS.HOLIDAY_NEW_SYMBOL_MODAL.SYMBOL')}
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                      className="HolidayNewSymbolModal__field--large"
                      component={FormikSelectField}
                      searchable
                      multiple
                    >
                      {symbolsSources.map(({ sourceName, children }) => (
                        <option key={sourceName} value={sourceName}>
                          {/* Here we should to construct string depends from children existing */}
                          {`${sourceName}${children.length > 0 ? ` → ${children.join(', ')}` : ''}`}
                        </option>
                      ))}
                    </Field>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    data-testid="HolidayNewSymbolModal-cancelButton"
                    onClick={onCloseModal}
                    tertiary
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!dirty || isSubmitting}
                    data-testid="HolidayNewSymbolModal-saveButton"
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

export default React.memo(HolidayNewSymbolModal);
