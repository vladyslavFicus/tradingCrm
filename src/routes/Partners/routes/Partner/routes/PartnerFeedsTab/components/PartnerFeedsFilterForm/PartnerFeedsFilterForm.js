import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { typesLabels } from 'constants/audit';
import { Button, RefreshButton } from 'components/Buttons';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import FeedsTypesQuery from './graphql/FeedTypesQuery';
import './PartnerFeedsFilterForm.scss';

class PartnerFeedsFilterForm extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    feedTypesData: PropTypes.shape({
      data: PropTypes.shape({
        feedTypes: PropTypes.objectOf(PropTypes.string),
      }),
    }).isRequired,
    handleRefetch: PropTypes.func.isRequired,
  };

  handleSubmit = (values, { setSubmitting }) => {
    this.props.history.replace({ query: { filters: decodeNullValues(values) } });
    setSubmitting(false);
  };

  handleReset = (resetForm) => {
    this.props.history.replace({ query: { filters: {} } });

    resetForm();
  };

  render() {
    const {
      handleRefetch,
      feedTypesData,
      location: { query },
    } = this.props;

    const feedTypes = get(feedTypesData, 'data.feedTypes') || {};
    const availableFeedTypes = Object.keys(feedTypes).filter(key => (!!feedTypes[key] && key !== '__typename'));

    return (
      <Formik
        className="PartnerFeedsFilterForm"
        initialValues={query?.filters || {}}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
          resetForm,
          values,
          dirty,
        }) => (
          <Form className="PartnerFeedsFilterForm__form">
            <Field
              name="searchBy"
              className="PartnerFeedsFilterForm__field PartnerFeedsFilterForm__search"
              label={I18n.t('PARTNER_PROFILE.FEED.FILTER_FORM.SEARCH_BY')}
              placeholder={I18n.t('PARTNER_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="auditLogType"
              className="PartnerFeedsFilterForm__field PartnerFeedsFilterForm__select"
              label={I18n.t('PARTNER_PROFILE.FEED.FILTER_FORM.ACTION_TYPE')}
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
              className="PartnerFeedsFilterForm__field PartnerFeedsFilterForm__date-range"
              label={I18n.t('PARTNER_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'creationDateFrom',
                to: 'creationDateTo',
              }}
              withFocus
            />

            <div className="PartnerFeedsFilterForm__buttons">
              <RefreshButton
                className="PartnerFeedsFilterForm__button"
                onClick={handleRefetch}
              />

              <Button
                className="PartnerFeedsFilterForm__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="PartnerFeedsFilterForm__button"
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
)(PartnerFeedsFilterForm);
