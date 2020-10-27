import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { accountTypes } from 'constants/accountTypes';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';
import { FormikSelectField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import './ClientTradingAccountsGridFilter.scss';

class ClientTradingAccountsGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    accountType: PropTypes.string.isRequired,
  };

  handleSubmit = (values, { setSubmitting }) => {
    this.props.history.replace({
      state: {
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  };

  handleReset = () => {
    this.props.history.replace({
      state: {
        filters: {},
      },
    });
  };

  render() {
    const { accountType, location: { state } } = this.props;
    const platformTypes = getAvailablePlatformTypes();

    return (
      <Formik
        className="ClientTradingAccountsGridFilter"
        initialValues={state?.filters || { accountType }}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
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
              <Button
                className="ClientTradingAccountsGridFilter__button"
                onClick={this.handleReset}
                disabled={isSubmitting}
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
