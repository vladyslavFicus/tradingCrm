import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { differenceWith, sortBy } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { Button } from 'components/UI';
import { LevelType, Notify } from 'types/notify';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
import { FormikSelectField } from 'components/Formik';
import { useSymbolsSourcesQuery } from './graphql/__generated__/SymbolsSourcesQuery';
import './HolidayNewSymbolModal.scss';

interface Props {
  notify: Notify,
  isOpen: boolean,
  onCloseModal: () => void,
  onSuccess: (symbols: string[]) => void,
  symbols: string[],
}

interface FormValues {
  symbols: string[],
}

const validate = createValidator(
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
    isOpen,
    notify,
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
      level: LevelType.SUCCESS,
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
      isOpen={isOpen}
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
