import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { accountTypes, accountStatuses, affiliateTypes } from '../../constants';

class TradingAccountsListFilters extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: false,
  };

  applyFilters = ({ archived, ...filters }) => {
    this.props.history.replace({
      query: {
        filters: {
          ...filters,
          archived: archived ? !!+archived : undefined,
        },
      },
    });
  };

  render() {
    const {
      loading,
    } = this.props;

    return (
      <Formik
        initialValues={{}}
        onSubmit={this.applyFilters}
        onReset={this.applyFilters}
      >
        {({ resetForm, dirty }) => (
          <Form className="filter__form">
            <div className="filter__form-inputs">
              <Field
                name="searchKeyword"
                label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.SEARCH_BY')}
                placeholder={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
                className="form-group filter-row__big"
                component={FormikInputField}
              />
              <Field
                name="accountType"
                label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.ACCOUNT_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="form-group filter-row__medium"
                component={FormikSelectField}
                withAnyOption
              >
                {Object.keys(accountTypes).map(key => (
                  <option key={key} value={key}>
                    {I18n.t(accountTypes[key])}
                  </option>
                ))}
              </Field>
              <Field
                name="archived"
                label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.STATUS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="form-group filter-row__medium"
                component={FormikSelectField}
                withAnyOption
              >
                {Object.keys(accountStatuses).map(key => (
                  <option key={key} value={key}>
                    {I18n.t(accountStatuses[key])}
                  </option>
                ))}
              </Field>
              <Field
                name="affiliateType"
                label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.AFFILIATE_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="form-group filter-row__medium"
                component={FormikSelectField}
                withAnyOption
              >
                {Object.keys(affiliateTypes).map(key => (
                  <option key={key} value={key}>
                    {I18n.t(affiliateTypes[key])}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter__form-buttons">
              <div className="filter__form-buttons-group">
                <Button
                  className="btn"
                  onClick={resetForm}
                  disabled={loading || !dirty}
                  common
                >
                  {I18n.t('COMMON.RESET')}
                </Button>
                <Button
                  className="btn"
                  type="submit"
                  disabled={loading}
                  primary
                >
                  {I18n.t('COMMON.APPLY')}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default withRouter(TradingAccountsListFilters);
