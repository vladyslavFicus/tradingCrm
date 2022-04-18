import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { typesLabels } from 'constants/audit';
import { Button, RefreshButton } from 'components/UI';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import FeedsTypesQuery from './graphql/FeedTypesQuery';
import './DistributionRuleFeedsFilterForm.scss';

class DistributionRuleFeedsFilterForm extends PureComponent {
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
        className="DistributionRuleFeedsFilterForm"
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
          <Form className="DistributionRuleFeedsFilterForm__form">
            <Field
              name="searchBy"
              className="DistributionRuleFeedsFilterForm__field DistributionRuleFeedsFilterForm__search"
              label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.SEARCH_BY')}
              placeholder={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="auditLogType"
              className="DistributionRuleFeedsFilterForm__field DistributionRuleFeedsFilterForm__select"
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

            <Field
              className="DistributionRuleFeedsFilterForm__field DistributionRuleFeedsFilterForm__date-range"
              label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'creationDateFrom',
                to: 'creationDateTo',
              }}
              withFocus
            />

            <div className="DistributionRuleFeedsFilterForm__buttons">
              <RefreshButton
                className="DistributionRuleFeedsFilterForm__button"
                onClick={handleRefetch}
              />

              <Button
                className="DistributionRuleFeedsFilterForm__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="DistributionRuleFeedsFilterForm__button"
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
)(DistributionRuleFeedsFilterForm);
