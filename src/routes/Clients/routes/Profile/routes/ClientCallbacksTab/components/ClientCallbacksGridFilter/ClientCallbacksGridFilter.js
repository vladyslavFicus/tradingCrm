import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { callbacksStatuses } from 'constants/callbacks';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import './ClientCallbacksGridFilter.scss';

class ClientCallbacksGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
  };

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.history.replace({ query: { filters: decodeNullValues(values) } });
    setSubmitting(false);
  };

  onHandleReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  render() {
    return (
      <Formik
        className="ClientCallbacksGridFilter"
        initialValues={{}}
        onSubmit={this.onHandleSubmit}
        onReset={this.onHandleReset}
      >
        {({
          isSubmitting,
          resetForm,
        }) => (
          <Form className="ClientCallbacksGridFilter__form">
            <div className="ClientCallbacksGridFilter__fields">
              <Field
                name="searchKeyword"
                className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__search"
                label={I18n.t('CALLBACKS.FILTER.SEARCH_BY')}
                placeholder={I18n.t('CALLBACKS.FILTER.CALLBACK_OR_OPERATOR')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
              />

              <Field
                name="statuses"
                className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__status"
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

              <Field
                className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__dates"
                label={I18n.t('CALLBACKS.FILTER.DATE_RANGE')}
                startDatePlaceholderText={I18n.t('CALLBACKS.FILTER.DATE_RANGE_START')}
                endDatePlaceholderText={I18n.t('CALLBACKS.FILTER.DATE_RANGE_END')}
                component={FormikDateRangePicker}
                periodKeys={{
                  start: 'callbackTimeFrom',
                  end: 'callbackTimeTo',
                }}
                withTime
              />
            </div>

            <div className="ClientCallbacksGridFilter__buttons">
              <Button
                className="ClientCallbacksGridFilter__button"
                onClick={resetForm}
                disabled={isSubmitting}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="ClientCallbacksGridFilter__button"
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

export default withRouter(ClientCallbacksGridFilter);
