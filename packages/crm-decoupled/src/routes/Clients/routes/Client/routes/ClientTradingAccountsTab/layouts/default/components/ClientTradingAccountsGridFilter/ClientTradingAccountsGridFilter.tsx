import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Constants } from '@crm/common';
import { Button, RefreshButton, FormikSingleSelectField } from 'components';
import useFilter from 'hooks/useFilter';
import useClientTradingAccountsGridFilter
  from 'routes/Clients/routes/Client/routes/ClientTradingAccountsTab/hooks/useClientTradingAccountsGridFilter';
import {
  FormValues,
} from 'routes/Clients/routes/Client/routes/ClientTradingAccountsTab/types/clientTradingAccountsGridFilter';
import './ClientTradingAccountsGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const ClientTradingAccountsGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const {
    platformTypes,
  } = useClientTradingAccountsGridFilter();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      className="ClientTradingAccountsGridFilter"
      initialValues={filters}
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
            withAnyOption
            withFocus
            name="accountType"
            className="ClientTradingAccountsGridFilter__field"
            data-testid="ClientTradingAccountsGridFilter-accountTypeSelect"
            label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE')}
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
            component={FormikSingleSelectField}
            options={Constants.accountTypes.map(({ label, value }) => ({
              label: I18n.t(label),
              value,
            }))}
          />

          <If condition={!!platformTypes.length}>
            <Field
              withAnyOption
              searchable
              withFocus
              name="platformType"
              className="ClientTradingAccountsGridFilter__field"
              data-testid="ClientTradingAccountsGridFilter-platformTypeSelect"
              label={I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.PLATFORM_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSingleSelectField}
              options={platformTypes.map(({ label, value }) => ({
                label: I18n.t(label),
                value,
              }))}
            />
          </If>

          <div className="ClientTradingAccountsGridFilter__buttons">
            <RefreshButton
              className="ClientTradingAccountsGridFilter__button"
              data-testid="ClientTradingAccountsGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="ClientTradingAccountsGridFilter__button"
              data-testid="ClientTradingAccountsGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="ClientTradingAccountsGridFilter__button"
              data-testid="ClientTradingAccountsGridFilter-applyButton"
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
