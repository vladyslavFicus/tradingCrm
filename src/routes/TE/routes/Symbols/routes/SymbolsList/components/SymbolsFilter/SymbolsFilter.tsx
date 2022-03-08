import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import { FormikSelectField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import { useSymbolsQuery, SymbolsQueryVariables } from './graphql/__generated__/SymbolsQuery';
import './SymbolsFilter.scss';

interface Props {
  onRefresh: () => void,
}

const SymbolsFilter = (props: Props) => {
  const history = useHistory();
  const { state } = useLocation<State<SymbolsQueryVariables['args']>>();

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

  const symbols = symbolsQuery.data?.tradingEngine.symbols.content || [];

  // ======= Handlers ======= //
  const handleSubmit = (values: SymbolsQueryVariables['args']) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: Function) => {
    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  return (
    <Formik
      enableReinitialize
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="SymbolsFilter">
          <div className="SymbolsFilter__fields">
            <Field
              name="symbolNames"
              label={I18n.t('TRADING_ENGINE.SYMBOLS.FILTER_FORM.SYMBOL_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="SymbolsFilter__field"
              component={FormikSelectField}
              searchable
              withFocus
              multiple
              disabled={symbolsQuery.loading}
            >
              {symbols.map(({ symbol }) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </Field>
          </div>
          <div className="SymbolsFilter__buttons">
            <RefreshButton
              className="SymbolsFilter__button"
              onClick={props.onRefresh}
            />
            <Button
              className="SymbolsFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="SymbolsFilter__button"
              type="submit"
              disabled={!dirty || isSubmitting}
              primary
            >
              {I18n.t('COMMON.APPLY')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(SymbolsFilter);
