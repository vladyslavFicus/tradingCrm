import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/Buttons';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';
import { accountTypes, accountStatuses } from '../../constants';
import './TradingAccountsListFilters.scss';

class TradingAccountsListFilters extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    loading: PropTypes.bool,
    handleRefetch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loading: false,
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
      loading,
      handleRefetch,
      location: { state },
    } = this.props;

    const platformTypes = getAvailablePlatformTypes();

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          values,
          dirty,
        }) => (
          <Form className="TradingAccountsListFilters__form">
            <div className="TradingAccountsListFilters__fields">
              <Field
                name="searchKeyword"
                label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.SEARCH_BY')}
                placeholder={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
                className="TradingAccountsListFilters__field"
                component={FormikInputField}
                addition={<i className="icon icon-search" />}
                withFocus
              />
              <Field
                name="accountType"
                label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.ACCOUNT_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="TradingAccountsListFilters__field"
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                {Object.keys(accountTypes).map(key => (
                  <option key={key} value={key}>
                    {I18n.t(accountTypes[key])}
                  </option>
                ))}
              </Field>
              <If condition={platformTypes.length > 1}>
                <Field
                  name="platformType"
                  label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.PLATFORM_TYPE')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  className="TradingAccountsListFilters__field"
                  component={FormikSelectField}
                  withAnyOption
                  withFocus
                >
                  {platformTypes.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Field>
              </If>
              <Field
                name="archived"
                label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.STATUS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="TradingAccountsListFilters__field"
                component={FormikSelectField}
                withAnyOption
                withFocus
                boolean
              >
                {accountStatuses.map(({ value, label }) => (
                  <option key={`archived-${value}`} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="TradingAccountsListFilters__buttons">
              <RefreshButton
                className="TradingAccountsListFilters__button"
                onClick={handleRefetch}
              />

              <Button
                className="TradingAccountsListFilters__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="TradingAccountsListFilters__button"
                type="submit"
                disabled={loading || isSubmitting || !dirty}
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

export default withRouter(TradingAccountsListFilters);
