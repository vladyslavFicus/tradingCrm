/* eslint-disable */
import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests} from 'apollo';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import PropTypes from 'constants/propTypes';
import { typesLabels } from 'constants/audit';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { Button } from 'components/UI';
import { attributeLabels } from '../constants';
import FeedTypesQuery from './graphql/FeedTypesQuery';

class FeedFilterForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    availableTypes: PropTypes.arrayOf(PropTypes.string),
  };

  render() {
    const {
      onSubmit,
      availableTypes,
    } = this.props;

    const sortedActionTypes = availableTypes
      .map(type => ({
        key: type,
        value: I18n.t(renderLabel(type, typesLabels)),
      }))
      .sort(({ value: a }, { value: b }) => (a > b ? 1 : -1));

    return (
      <Formik
        initialValues={{
          searchBy: '',
          auditLogType: '',
          creationDateFrom: '',
          creationDateTo: '',
        }}
        onSubmit={onSubmit}
        onReset={onSubmit}
        validate={
          createValidator({
            searchBy: 'string',
            auditLogType: ['string', `in:${Object.keys(sortedActionTypes).join()}`],
            creationDateFrom: 'string',
            creationDateTo: 'string',
          }, translateLabels(attributeLabels), false)
        }
      >
        {({ values, isValid, resetForm }) => {
          console.log('values: ', values);
          return (
            <Form className="filter-row">
              <Field
                name="searchBy"
                label={I18n.t(attributeLabels.searchBy)}
                placeholder={I18n.t('PLAYER_PROFILE.FEED.FILTER_FORM.LABELS.SEARCH_BY_PLACEHOLDER')}
                component={FormikInputField}
                inputAddon={<i className="icon icon-search" />}
                className="filter-row__medium"
              />
              <Field
                name="auditLogType"
                label={I18n.t(attributeLabels.actionType)}
                component={FormikSelectField}
                className="filter-row__medium"
              >
                <option value="">{I18n.t('COMMON.ALL_ACTIONS')}</option>
                {sortedActionTypes.map(({ key, value }) => (
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
              />
              <div className="filter-row__button-block">
                <Button
                  className="margin-right-15"
                  onClick={resetForm}
                  common
                >
                  {I18n.t('COMMON.RESET')}
                </Button>
                <Button
                  disabled={!isValid}
                  primary
                  type="submit"
                >
                  {I18n.t('COMMON.APPLY')}
                </Button>
              </div>
            </Form>
          )
        }
        }
        } }
      </Formik>
    );
  }
}

export default withRequests({
  feedTypes: FeedTypesQuery,
})(FeedFilterForm);
