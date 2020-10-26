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

  handleSubmit = (values, { setSubmitting }) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
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
  }

  render() {
    const { location: { state } } = this.props;

    return (
      <Formik
        className="CallbacksGridFilter"
        enableReinitialize
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          dirty,
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
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
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
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="CallbacksGridFilter__button"
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

export default withRouter(CallbacksGridFilter);
