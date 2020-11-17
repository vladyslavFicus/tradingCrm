import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { accountTypes } from 'constants/accountTypes';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';
import { FormikSelectField } from 'components/Formik';
import { decodeNullValues, hasSelectedValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import './ClientTradingAccountsGridFilter.scss';

class ClientTradingAccountsGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    handleRefetch: PropTypes.func.isRequired,
  };

  handleSubmit = (values) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  handleReset = (resetForm) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  render() {
    const {
      handleRefetch,
      location: { state },
    } = this.props;
    const platformTypes = getAvailablePlatformTypes();

    return (
      <Formik
        className="ClientTradingAccountsGridFilter"
        initialValues={state?.filters || { accountType: 'LIVE' }}
        onSubmit={this.handleSubmit}
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
              className="ClientTradingAccountsGridFilter__field ClientTradingAccountsGridFilter__select"
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
                className="ClientTradingAccountsGridFilter__field ClientTradingAccountsGridFilter__select"
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
                onClick={handleRefetch}
              />

              <Button
                className="ClientTradingAccountsGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || !hasSelectedValues(values)}
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
  }
}

export default withRouter(ClientTradingAccountsGridFilter);
