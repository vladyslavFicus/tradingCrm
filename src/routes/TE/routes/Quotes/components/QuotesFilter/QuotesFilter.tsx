import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import { FormikSelectField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/Buttons';
import { SymbolsQueryVariables } from '../../graphql/__generated__/SymbolsQuery';
import { favorites } from './constants';
import { useSymbolsQuery } from './graphql/__generated__/SymbolsQuery';
import { useSecuritiesQuery } from './graphql/__generated__/SecuritiesQuery';
import './QuotesFilter.scss';

type Props = {
  onRefresh: () => void,
};

const QuotesFilter = (props: Props) => {
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

  const securitiesQuery = useSecuritiesQuery();

  const symbols = symbolsQuery.data?.tradingEngine.symbols.content || [];
  const securities = securitiesQuery.data?.tradingEngine.securities || [];

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
      {({ isSubmitting, resetForm, values, dirty }) => (
        <Form className="QuotesFilter">
          <div className="SymbolsFilter__fields">
            <Field
              name="symbolNames"
              label={I18n.t('TRADING_ENGINE.QUOTES.FILTER_FORM.FIELDS.SYMBOL_LABEL')}
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

            <Field
              name="securityNames"
              label={I18n.t('TRADING_ENGINE.QUOTES.FILTER_FORM.FIELDS.SECURITY_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="QuotesFilter__field"
              component={FormikSelectField}
              searchable
              withFocus
              multiple
              disabled={securitiesQuery.loading}
            >
              {securities.map(({ name, id }) => (
                <option key={id} value={name}>
                  {name}
                </option>
              ))}
            </Field>

            <Field
              name="favorite"
              label={I18n.t('TRADING_ENGINE.QUOTES.FILTER_FORM.FIELDS.FAVOURITE_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="AccountsFilter__field"
              component={FormikSelectField}
              withAnyOption
              withFocus
              boolean
            >
              {favorites.map(({ value, label }) => (
                // @ts-ignore because in tsx file Field can't set BOOLEAN to option value
                <option key={`favorite-${value}`} value={value}>
                  {I18n.t(label)}
                </option>
              ))}
            </Field>
          </div>

          <div className="QuotesFilter__buttons">
            <RefreshButton
              className="QuotesFilter__button"
              onClick={props.onRefresh}
            />

            <Button
              className="QuotesFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="QuotesFilter__button"
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

export default React.memo(QuotesFilter);
