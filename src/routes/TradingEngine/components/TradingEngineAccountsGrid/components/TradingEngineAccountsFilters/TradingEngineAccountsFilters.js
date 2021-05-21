import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import { accountTypes, accountStatuses } from '../../constants';
import './TradingEngineAccountsFilters.scss';

class TradingEngineAccountsFilters extends PureComponent {
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
          <Form className="filter__form">
            <div className="filter__form-inputs">
              <Field
                name="searchKeyword"
                label={I18n.t('TRADING_ENGINE.FORM.FIELDS.SEARCH_BY')}
                placeholder={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
                className="form-group filter-row__big"
                component={FormikInputField}
                addition={<i className="icon icon-search" />}
                withFocus
              />
              <Field
                name="accountType"
                label={I18n.t('TRADING_ENGINE.FORM.FIELDS.ACCOUNT_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="form-group filter-row__medium"
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
              <Field
                name="archived"
                label={I18n.t('TRADING_ENGINE.FORM.FIELDS.STATUS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="form-group filter-row__medium"
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                {Object.keys(accountStatuses).map(key => (
                  <option key={key} value={key}>
                    {I18n.t(accountStatuses[key])}
                  </option>
                ))}
              </Field>
            </div>
            <div className="TradingEngineAccountsFilters__buttons">
              <RefreshButton
                className="TradingEngineAccountsFilters__button"
                onClick={handleRefetch}
              />

              <Button
                className="TradingEngineAccountsFilters__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="TradingEngineAccountsFilters__button"
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

export default withRouter(TradingEngineAccountsFilters);
