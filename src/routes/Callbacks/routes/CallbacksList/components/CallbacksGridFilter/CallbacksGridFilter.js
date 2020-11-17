import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { callbacksStatuses } from 'constants/callbacks';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues, hasSelectedValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import './CallbacksGridFilter.scss';

class CallbacksGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    handleRefetch: PropTypes.func.isRequired,
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
    const {
      location: { state },
      handleRefetch,
    } = this.props;

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
          values,
          dirty,
        }) => (
          <Form className="CallbacksGridFilter__form">
            <Field
              name="searchKeyword"
              className="CallbacksGridFilter__field CallbacksGridFilter__search"
              label={I18n.t('CALLBACKS.FILTER.SEARCH_BY')}
              placeholder={I18n.t('CALLBACKS.FILTER.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="statuses"
              className="CallbacksGridFilter__field CallbacksGridFilter__select"
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              label={I18n.t('CALLBACKS.FILTER.STATUS')}
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {Object.keys(callbacksStatuses).map(status => (
                <option key={status} value={status}>{I18n.t(callbacksStatuses[status])}</option>
              ))}
            </Field>

            <Field
              className="CallbacksGridFilter__field CallbacksGridFilter__date-range"
              label={I18n.t('CALLBACKS.FILTER.DATE_RANGE')}
              component={FormikDateRangeGroup}
              periodKeys={{
                start: 'callbackTimeFrom',
                end: 'callbackTimeTo',
              }}
              withFocus
            />

            <div className="CallbacksGridFilter__buttons">
              <RefreshButton
                className="CallbacksGridFilter__button"
                onClick={handleRefetch}
              />

              <Button
                className="CallbacksGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || !hasSelectedValues(values)}
                primary
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
