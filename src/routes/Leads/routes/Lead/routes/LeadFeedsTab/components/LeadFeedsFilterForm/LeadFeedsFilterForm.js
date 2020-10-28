import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { typesLabels } from 'constants/audit';
import formatLabel from 'utils/formatLabel';
import { Button } from 'components/UI';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import FeedsTypesQuery from './graphql/FeedTypesQuery';
import './LeadFeedsFilterForm.scss';

class LeadFeedsFilterForm extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    feedTypesQuery: PropTypes.query({
      feedTypes: PropTypes.objectOf(PropTypes.string),
    }).isRequired,
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
      location: { query },
      feedTypesQuery,
    } = this.props;

    const feedTypes = get(feedTypesQuery, 'data.feedTypes') || {};
    const availableFeedTypes = Object.keys(feedTypes).filter(key => (!!feedTypes[key] && key !== '__typename'));

    return (
      <Formik
        className="LeadFeedsFilterForm"
        initialValues={query?.filters || {}}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
          dirty,
        }) => (
          <Form className="LeadFeedsFilterForm__form">
            <Field
              name="searchBy"
              className="LeadFeedsFilterForm__field LeadFeedsFilterForm__search"
              label={I18n.t('LEAD_PROFILE.FEED.FILTER_FORM.SEARCH_BY')}
              placeholder={I18n.t('LEAD_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="auditLogType"
              className="LeadFeedsFilterForm__field LeadFeedsFilterForm__select"
              label={I18n.t('LEAD_PROFILE.FEED.FILTER_FORM.ACTION_TYPE')}
              placeholder={I18n.t('COMMON.ANY')}
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {availableFeedTypes.map(type => (
                <option key={type} value={type}>
                  {typesLabels[type] ? I18n.t(typesLabels[type]) : formatLabel(type)}
                </option>
              ))}
            </Field>

            <FormikDateRangeGroup
              className="LeadFeedsFilterForm__field LeadFeedsFilterForm__date-range"
              label={I18n.t('LEAD_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
              periodKeys={{
                start: 'creationDateFrom',
                end: 'creationDateTo',
              }}
              withFocus
              withTime
            />

            <div className="LeadFeedsFilterForm__buttons">
              <Button
                className="LeadFeedsFilterForm__button"
                onClick={this.handleReset}
                primary
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
    feedTypesQuery: FeedsTypesQuery,
  }),
)(LeadFeedsFilterForm);
