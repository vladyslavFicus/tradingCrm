import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { typesLabels } from 'constants/audit';
import { Button, RefreshButton } from 'components/UI';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import FeedsTypesQuery from './graphql/FeedTypesQuery';
import './OperatorFeedsFilterForm.scss';

class OperatorFeedsFilterForm extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    feedTypesQuery: PropTypes.query({
      feedTypes: PropTypes.objectOf(PropTypes.string),
    }).isRequired,
    handleRefetch: PropTypes.func.isRequired,
  };

  handleSubmit = (values, { setSubmitting }) => {
    this.props.history.replace({ state: { filters: decodeNullValues(values) } });
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
  };

  render() {
    const {
      handleRefetch,
      feedTypesQuery,
      location: { state },
    } = this.props;

    const feedTypes = feedTypesQuery.data?.feedTypes || {};
    const availableFeedTypes = Object.keys(feedTypes).filter(key => (!!feedTypes[key] && key !== '__typename'));

    return (
      <Formik
        className="OperatorFeedsFilterForm"
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
          values,
          dirty,
        }) => (
          <Form className="OperatorFeedsFilterForm__form">
            <Field
              name="searchBy"
              className="OperatorFeedsFilterForm__field OperatorFeedsFilterForm__search"
              label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.SEARCH_BY')}
              placeholder={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="auditLogType"
              className="OperatorFeedsFilterForm__field OperatorFeedsFilterForm__select"
              label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_TYPE')}
              placeholder={I18n.t('COMMON.ANY')}
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {availableFeedTypes.map(type => (
                <option key={type} value={type}>
                  {typesLabels[type] ? I18n.t(typesLabels[type]) : type}
                </option>
              ))}
            </Field>

            <FormikDateRangeGroup
              className="OperatorFeedsFilterForm__field OperatorFeedsFilterForm__date-range"
              label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
              periodKeys={{
                start: 'creationDateFrom',
                end: 'creationDateTo',
              }}
              withFocus
            />

            <div className="OperatorFeedsFilterForm__buttons">
              <RefreshButton
                className="OperatorFeedsFilterForm__button"
                onClick={handleRefetch}
              />

              <Button
                className="OperatorFeedsFilterForm__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="OperatorFeedsFilterForm__button"
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

export default compose(
  withRouter,
  withRequests({
    feedTypesQuery: FeedsTypesQuery,
  }),
)(OperatorFeedsFilterForm);
