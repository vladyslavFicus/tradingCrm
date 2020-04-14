import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { callbacksStatuses } from 'constants/callbacks';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import './CallbacksGridFilter.scss';

class CallbacksGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
  };

  initialValues = {
    searchKeyword: '',
    statuses: '',
    callbackTimeFrom: '2020-04-12',
    callbackTimeTo: '2020-04-14',
  };

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.history.replace({ query: { filters: decodeNullValues(values) } });
    setSubmitting(false);
  };

  onHandleReset = (resetForm) => {
    this.props.history.replace({ query: { filters: {} } });
    resetForm(this.initialValues);
  };

  render() {
    return (
      <Formik
        className="CallbacksGridFilter"
        initialValues={this.initialValues}
        onSubmit={this.onHandleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
        }) => (
          <Form className="CallbacksGridFilter__form">
            <div className="CallbacksGridFilter__fields">
              <Field
                name="searchKeyword"
                className="CallbacksGridFilter__field CallbacksGridFilter__search"
                label={I18n.t('CALLBACKS.FILTER.SEARCH_BY')}
                placeholder={I18n.t('CALLBACKS.FILTER.SEARCH_BY_PLACEHOLDER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
              />

              <Field
                name="statuses"
                className="CallbacksGridFilter__field CallbacksGridFilter__status"
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                label={I18n.t('CALLBACKS.FILTER.STATUS')}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {Object.keys(callbacksStatuses).map(status => (
                  <option key={status} value={status}>{I18n.t(callbacksStatuses[status])}</option>
                ))}
              </Field>


              <FormikDateRangePicker
                className="CallbacksGridFilter__field CallbacksGridFilter__dates"
                label={I18n.t('CALLBACKS.FILTER.DATE_RANGE')}
                periodKeys={{
                  start: 'callbackTimeFrom',
                  end: 'callbackTimeTo',
                }}
              />
            </div>

            <div className="CallbacksGridFilter__buttons">
              <Button
                className="CallbacksGridFilter__button"
                onClick={() => this.onHandleReset(resetForm)}
                disabled={isSubmitting}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="CallbacksGridFilter__button"
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

export default withRouter(CallbacksGridFilter);
