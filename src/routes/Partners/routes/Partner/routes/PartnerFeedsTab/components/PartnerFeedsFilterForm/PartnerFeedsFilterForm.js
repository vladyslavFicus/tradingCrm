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
import getFeedsTypesQuery from './graphql/getFeedTypesQuery';
import './PartnerFeedsFilterForm.scss';

const attributeLabels = {
  searchBy: 'PARTNER_PROFILE.FEED.FILTER_FORM.SEARCH_BY',
  actionType: 'PARTNER_PROFILE.FEED.FILTER_FORM.ACTION_TYPE',
};

class PartnerFeedsFilterForm extends PureComponent {
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
        className="PartnerFeedsFilterForm"
        initialValues={{}}
        onSubmit={this.onHandleSubmit}
        onReset={this.onHandleReset}
      >
        {({
          isSubmitting,
          resetForm,
          dirty,
        }) => (
          <Form className="PartnerFeedsFilterForm__form">
            <div className="PartnerFeedsFilterForm__fields">
              <Field
                name="searchBy"
                className="PartnerFeedsFilterForm__field PartnerFeedsFilterForm__search"
                label={I18n.t(attributeLabels.searchBy)}
                placeholder={I18n.t('PARTNER_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
              />

              <Field
                name="auditLogType"
                className="PartnerFeedsFilterForm__field PartnerFeedsFilterForm__types"
                label={I18n.t(attributeLabels.actionType)}
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
                className="PartnerFeedsFilterForm__field PartnerFeedsFilterForm__dates"
                label={I18n.t('PARTNER_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
                component={FormikDateRangePicker}
                periodKeys={{
                  start: 'creationDateFrom',
                  end: 'creationDateTo',
                }}
                withTime
              />
            </div>

            <div className="PartnerFeedsFilterForm__buttons">
              <Button
                className="PartnerFeedsFilterForm__button"
                onClick={resetForm}
                disabled={isSubmitting}
                common
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
    feedTypesData: getFeedsTypesQuery,
  }),
)(PartnerFeedsFilterForm);
