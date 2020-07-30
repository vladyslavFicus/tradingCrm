import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { typesLabels } from 'constants/audit';
import { Button } from 'components/UI';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import FeedsTypesQuery from './graphql/FeedTypesQuery';
import './LeadFeedsFilterForm.scss';

class LeadFeedsFilterForm extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    feedTypesData: PropTypes.query({
      feedTypes: PropTypes.objectOf(PropTypes.string),
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

    const feedTypes = get(feedTypesData, 'data.feedTypes') || {};
    const availableFeedTypes = Object.keys(feedTypes).filter(key => (!!feedTypes[key] && key !== '__typename'));

    return (
      <Formik
        className="LeadFeedsFilterForm"
        initialValues={{}}
        onSubmit={this.onHandleSubmit}
        onReset={this.onHandleReset}
      >
        {({
          isSubmitting,
          resetForm,
          dirty,
        }) => (
          <Form className="LeadFeedsFilterForm__form">
            <div className="LeadFeedsFilterForm__fields">
              <Field
                name="searchBy"
                className="LeadFeedsFilterForm__field LeadFeedsFilterForm__search"
                label={I18n.t('LEAD_PROFILE.FEED.FILTER_FORM.SEARCH_BY')}
                placeholder={I18n.t('LEAD_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
              />

              <Field
                name="auditLogType"
                className="LeadFeedsFilterForm__field LeadFeedsFilterForm__types"
                label={I18n.t('LEAD_PROFILE.FEED.FILTER_FORM.ACTION_TYPE')}
                placeholder={I18n.t('COMMON.ANY')}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {availableFeedTypes.map(type => (
                  <option key={type} value={type}>
                    {typesLabels[type] ? I18n.t(typesLabels[type]) : type}
                  </option>
                ))}
              </Field>

              <Field
                className="LeadFeedsFilterForm__field LeadFeedsFilterForm__dates"
                label={I18n.t('LEAD_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
                component={FormikDateRangePicker}
                periodKeys={{
                  start: 'creationDateFrom',
                  end: 'creationDateTo',
                }}
                withTime
              />
            </div>

            <div className="LeadFeedsFilterForm__buttons">
              <Button
                className="LeadFeedsFilterForm__button"
                onClick={resetForm}
                disabled={isSubmitting}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="LeadFeedsFilterForm__button"
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
    feedTypesData: FeedsTypesQuery,
  }),
)(LeadFeedsFilterForm);
