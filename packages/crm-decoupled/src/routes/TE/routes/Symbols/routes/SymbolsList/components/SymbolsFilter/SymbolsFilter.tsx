import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Utils, Types } from '@crm/common';
import { Formik, Form, Field } from 'formik';
import { Button, RefreshButton, FormikMultipleSelectField } from 'components';
import { useSecuritiesQuery } from './graphql/__generated__/SecuritiesQuery';
import { useSymbolsQuery, SymbolsQueryVariables } from './graphql/__generated__/SymbolsQuery';
import './SymbolsFilter.scss';

type Props = {
  onRefresh: () => void,
}

const SymbolsFilter = (props: Props) => {
  const navigate = useNavigate();
  const state = useLocation().state as Types.State<SymbolsQueryVariables['args']>;

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
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: Utils.decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: Function) => {
    navigate('.', {
      replace: true,
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
              searchable
              withFocus
              name="symbolNames"
              data-testid="SymbolsFilter-symbolNamesSelect"
              label={I18n.t('TRADING_ENGINE.SYMBOLS.FILTER_FORM.SYMBOL_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="SymbolsFilter__field"
              component={FormikMultipleSelectField}
              disabled={symbolsQuery.loading}
              options={symbols.map(({ symbol }) => ({
                label: symbol,
                value: symbol,
              }))}
            />

            <Field
              searchable
              withFocus
              name="securityNames"
              data-testid="SymbolsFilter-securityNamesSelect"
              label={I18n.t('TRADING_ENGINE.SYMBOL.SECURITY_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="SymbolsFilter__field"
              component={FormikMultipleSelectField}
              options={securities.map(({ name }) => ({
                label: name,
                value: name,
              }))}
            />
          </div>
          <div className="SymbolsFilter__buttons">
            <RefreshButton
              className="SymbolsFilter__button"
              data-testid="SymbolsFilter-refreshButton"
              onClick={props.onRefresh}
            />
            <Button
              className="SymbolsFilter__button"
              data-testid="SymbolsFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="SymbolsFilter__button"
              data-testid="SymbolsFilter-applyButton"
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
