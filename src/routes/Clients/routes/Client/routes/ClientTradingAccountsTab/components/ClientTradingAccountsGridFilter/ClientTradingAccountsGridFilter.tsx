import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { accountTypes } from 'constants/accountTypes';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikSelectField } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { TradingAccountsQueryVariables } from '../../graphql/__generated__/TradingAccountsQuery';
import './ClientTradingAccountsGridFilter.scss';

type FormValues = {
  accountType: string,
  platformType?: string,
};

type Props = {
  onRefetch: () => void,
};

const ClientTradingAccountsGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<TradingAccountsQueryVariables>>();

  const history = useHistory();

  const platformTypes = getAvailablePlatformTypes();

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: ResetForm<FormValues>) => {
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
      className="ClientTradingAccountsGridFilter"
      initialValues={state?.filters as FormValues || { accountType: 'LIVE' }}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="ClientTradingAccountsGridFilter__form">
          <Field
            name="accountType"
            className="ClientTradingAccountsGridFilter__field"
            label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE')}
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
            component={FormikSelectField}
            withAnyOption
            withFocus
          >
            {accountTypes.map(({ label, value }) => (
              <option key={value} value={value}>{I18n.t(label)}</option>
            ))}
          </Field>

          <If condition={platformTypes.length > 0}>
            <Field
              name="platformType"
              className="ClientTradingAccountsGridFilter__field"
              label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PLATFORM_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {platformTypes.map(({ label, value }) => (
                <option key={value} value={value}>{I18n.t(label)}</option>
              ))}
            </Field>
          </If>

          <div className="ClientTradingAccountsGridFilter__buttons">
            <RefreshButton
              className="ClientTradingAccountsGridFilter__button"
              onClick={onRefetch}
            />

            <Button
              className="ClientTradingAccountsGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="ClientTradingAccountsGridFilter__button"
              disabled={isSubmitting || !dirty}
              type="submit"
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

export default React.memo(ClientTradingAccountsGridFilter);
