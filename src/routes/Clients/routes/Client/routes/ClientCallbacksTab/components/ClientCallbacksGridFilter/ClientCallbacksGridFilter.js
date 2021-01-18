import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { callbacksStatuses } from 'constants/callbacks';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import './ClientCallbacksGridFilter.scss';

class ClientCallbacksGridFilter extends PureComponent {
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

    return (
      <Formik
        className="ClientCallbacksGridFilter"
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
          resetForm,
          values,
          dirty,
        }) => (
          <Form className="ClientCallbacksGridFilter__form">
            <Field
              name="searchKeyword"
              className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__search"
              label={I18n.t('CALLBACKS.FILTER.SEARCH_BY')}
              placeholder={I18n.t('CALLBACKS.FILTER.CALLBACK_OR_OPERATOR')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="statuses"
              className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__select"
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
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
              className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__date-range"
              label={I18n.t('CALLBACKS.FILTER.DATE_RANGE')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'callbackTimeFrom',
                to: 'callbackTimeTo',
              }}
              withFocus
            />

            <div className="ClientCallbacksGridFilter__buttons">
              <RefreshButton
                className="ClientCallbacksGridFilter__button"
                onClick={handleRefetch}
              />

              <Button
                className="ClientCallbacksGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="ClientCallbacksGridFilter__button"
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

export default withRouter(ClientCallbacksGridFilter);