import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { typesLabels } from 'constants/audit';
import { Button } from 'components/UI';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import FeedTypesQuery from './graphql/FeedTypesQuery';
import './OperatorFeedFilterForm.scss';

class OperatorFeedFilterForm extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    feedTypesData: PropTypes.shape({
      data: PropTypes.shape({
        feedTypes: PropTypes.shape({
          data: PropTypes.objectOf(PropTypes.string),
        }),
      }),
    }).isRequired,
  };

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.history.replace({ query: { filters: decodeNullValues(values) } });
    setSubmitting(false);
  };

  onHandleReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  render() {
    const { feedTypesData } = this.props;

    const feedTypes = get(feedTypesData, 'data.feedTypes.data') || {};
    const availableFeedTypes = Object.keys(feedTypes).filter(key => (!!feedTypes[key] && key !== '__typename'));

    return (
      <Formik
        className="OperatorFeedFilterForm"
        initialValues={{}}
        onSubmit={this.onHandleSubmit}
        onReset={this.onHandleReset}
      >
        {({
          isSubmitting,
          resetForm,
        }) => (
          <Form className="OperatorFeedFilterForm__form">
            <div className="OperatorFeedFilterForm__fields">
              <Field
                name="searchBy"
                className="OperatorFeedFilterForm__field OperatorFeedFilterForm__search"
                label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.SEARCH_BY_LABEL')}
                placeholder={I18n.t('PARTNERS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
                component={FormikInputField}
              />

              <Field
                name="auditLogType"
                className="OperatorFeedFilterForm__field OperatorFeedFilterForm__types"
                label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_TYPES')}
                placeholder={I18n.t('COMMON.ANY')}
                component={FormikSelectField}
                withAnyOption
              >
                {availableFeedTypes.map(type => (
                  <option key={type} value={type}>
                    {typesLabels[type] ? I18n.t(typesLabels[type]) : type}
                  </option>
                ))}
              </Field>

              <FormikDateRangePicker
                className="OperatorFeedFilterForm__field OperatorFeedFilterForm__dates"
                label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
                periodKeys={{
                  start: 'creationDateFrom',
                  end: 'creationDateTo',
                }}
              />
            </div>

            <div className="OperatorFeedFilterForm__buttons">
              <Button
                className="OperatorFeedFilterForm__button"
                onClick={resetForm}
                disabled={isSubmitting}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="OperatorFeedFilterForm__button"
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
    feedTypesData: FeedTypesQuery,
  }),
)(OperatorFeedFilterForm);
