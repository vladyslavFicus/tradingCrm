import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { Button, RefreshButton } from 'components/UI';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import PropTypes from 'constants/propTypes';
import { typesLabels } from 'constants/audit';
import { attributeLabels } from './constants';
import FeedTypesQuery from './graphql/FeedTypesQuery';

class FeedFilterForm extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    feedTypes: PropTypes.query({
      feedTypes: PropTypes.objectOf(PropTypes.string),
    }).isRequired,
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

  handleReset = () => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });
  };

  render() {
    const {
      feedTypes,
      handleRefetch,
      location: { state },
    } = this.props;

    const feedTypesList = get(feedTypes, 'data.feedTypes') || [];
    const availableTypes = Object.keys(feedTypesList)
      .filter(key => feedTypesList[key] && key !== '__typename')
      .map(type => ({
        key: type,
        value: I18n.t(renderLabel(type, typesLabels)),
      }))
      .sort(({ value: a }, { value: b }) => (a > b ? 1 : -1));

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
        validate={
          createValidator({
            searchBy: 'string',
            auditLogType: ['string', `in:${Object.keys(feedTypesList).join()}`],
            creationDateFrom: 'string',
            creationDateTo: 'string',
          }, translateLabels(attributeLabels), false)
        }
      >
        {({ isValid, dirty }) => (
          <Form className="filter-row">
            <Field
              name="searchBy"
              className="filter-row__medium"
              label={I18n.t(attributeLabels.searchBy)}
              placeholder={I18n.t('PLAYER_PROFILE.FEED.FILTER_FORM.LABELS.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />
            <Field
              name="auditLogType"
              label={I18n.t(attributeLabels.actionType)}
              component={FormikSelectField}
              className="filter-row__medium"
              withAnyOption
              withFocus
            >
              {availableTypes.map(({ key, value }) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Field>
            <FormikDateRangeGroup
              className="filter-row__date-range"
              label={I18n.t('PLAYER_PROFILE.FEED.FILTER_FORM.LABELS.ACTION_DATE_RANGE')}
              periodKeys={{
                start: 'creationDateFrom',
                end: 'creationDateTo',
              }}
              withFocus
            />
            <div className="filter-row__button-block">
              <RefreshButton
                className="margin-right-15"
                onClick={handleRefetch}
              />
              <Button
                className="margin-right-15"
                onClick={this.handleReset}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                disabled={!isValid || !dirty}
                primary
                type="submit"
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
    feedTypes: FeedTypesQuery,
  }),
)(FeedFilterForm);
