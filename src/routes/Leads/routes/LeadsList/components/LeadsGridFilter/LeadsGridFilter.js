/* eslint-disable */
import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { omit } from 'lodash';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { salesStatuses } from 'constants/salesStatuses';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import countries from 'utils/countryList';
import './LeadsGridFilter.scss';

class LeadsGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
  };

  get leadsSalesStatuses() {
    return omit(salesStatuses, [
      'DIALER_NA',
      'DIALER_NEW',
      'DIALER_ASSIGNED',
      'DIALER_FAILED',
      'DIALER_DROP',
    ]);
  };

  initialValues = {
    searchKeyword: '',
    countries: '',

    status: '',

  };

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.history.replace({ query: { filters: decodeNullValues(values) } });
    setSubmitting(false);
  };

  onHandleReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  render() {
    console.log('leadsSalesStatuses', this.leadsSalesStatuses);

    return (
      <Formik
        className="LeadsGridFilter"
        initialValues={{}}
        onSubmit={this.onHandleSubmit}
        onReset={this.onHandleReset}
      >
        {({
          isSubmitting,
          resetForm,
        }) => (
          <Form className="LeadsGridFilter__form">
            <div className="LeadsGridFilter__fields">
              <Field
                name="searchKeyword"
                className="LeadsGridFilter__field"
                label={I18n.t('LEADS.FILTER.SEARCH')}
                placeholder={I18n.t('COMMON.SEARCH_BY.LEAD')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
              />

              <Field
                name="countries"
                className="LeadsGridFilter__field"
                label={I18n.t('LEADS.FILTER.COUNTRY')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                multiple
                searchable
                withAnyOption
              >
                {Object.keys(countries).map(country => (
                  <option key={country} value={country}>{countries[country]}</option>
                ))}
              </Field>

              {/* placeholder: (!branchesLoading && teams.length === 0)
                ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                : 'COMMON.SELECT_OPTION.DEFAULT', */}
              {/* selectOptions: Object */}
              {/* .values(leadAccountStatuses) */}
              {/* .map(({ label, value }) => ({ label, value })), */}

              <Field
                name="status"
                className="LeadsGridFilter__field"
                label={I18n.t('LEADS.FILTER.ACCOUNT_STATUS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {Object.keys(this.leadsSalesStatuses).map(leadSalesStatus => (
                  <option key={leadSalesStatus} value={leadSalesStatus}>
                    {I18n.t(this.leadsSalesStatuses[leadSalesStatus])}
                  </option>
                ))}
              </Field>




              <Field
                className="LeadsGridFilter__field"
                label={I18n.t('LEADS.FILTER.REGISTRATION_DATE_RANGE')}
                component={FormikDateRangePicker}
                periodKeys={{
                  start: 'registrationDateStart',
                  end: 'registrationDateEnd',
                }}
                withTime
              />

              <Field
                name="size"
                type="number"
                className="LeadsGridFilter__field"
                label={I18n.t('COMMON.FILTERS.SEARCH_LIMIT')}
                placeholder={I18n.t('COMMON.UNLIMITED')}
                component={FormikInputField}
                min={0}
              />
            </div>

            <div className="LeadsGridFilter__buttons">
              <Button
                className="LeadsGridFilter__button"
                disabled={isSubmitting}
                onClick={resetForm}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="LeadsGridFilter__button"
                disabled={isSubmitting}
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

export default compose(
  withRouter,
  withRequests({

  }),
)(LeadsGridFilter);
