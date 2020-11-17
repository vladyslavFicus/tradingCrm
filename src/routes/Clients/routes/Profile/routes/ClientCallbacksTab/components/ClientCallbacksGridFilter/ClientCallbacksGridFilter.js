import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { callbacksStatuses } from 'constants/callbacks';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues, hasSelectedValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import './ClientCallbacksGridFilter.scss';

class ClientCallbacksGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    handleRefetch: PropTypes.func.isRequired,
  };

  handleSubmit = (values, { setSubmitting }) => {
    this.props.history.replace({ query: { filters: decodeNullValues(values) } });
    setSubmitting(false);
  };

  handleReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  render() {
    const {
      handleRefetch,
      location: { query },
    } = this.props;

    return (
      <Formik
        className="ClientCallbacksGridFilter"
        initialValues={query?.filters || {}}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
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

            <FormikDateRangeGroup
              className="ClientCallbacksGridFilter__field ClientCallbacksGridFilter__date-range"
              label={I18n.t('CALLBACKS.FILTER.DATE_RANGE')}
              periodKeys={{
                start: 'callbackTimeFrom',
                end: 'callbackTimeTo',
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
                onClick={this.handleReset}
                disabled={isSubmitting || !hasSelectedValues(values)}
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
