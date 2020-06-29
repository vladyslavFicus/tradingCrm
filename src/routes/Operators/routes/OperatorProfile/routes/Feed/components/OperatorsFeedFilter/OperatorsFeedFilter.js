import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { Formik, Form, Field } from 'formik';
import { get } from 'lodash';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { Button } from 'components/UI';
import PropTypes from 'constants/propTypes';
import { typesLabels } from 'constants/audit';
import FeedTypesQuery from './graphql/FeedTypesQuery';
import { filterFormAttributeLabels as attributeLabels } from '../../constants';
import './OperatorsFeedFilter.scss';

const validate = createValidator({
  searchBy: 'string',
  auditLogType: 'string',
  creationDateFrom: 'string',
  creationDateTo: 'string',
}, translateLabels(attributeLabels), false);

class OperatorsFeedFilter extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    feedTypes: PropTypes.query({
      data: PropTypes.obj,
    }).isRequired,
  };

  render() {
    const { feedTypes: { data } } = this.props;
    const feedTypesList = get(data, 'feedTypes.data') || {};
    const availableTypes = Object.keys(feedTypesList).filter(key => (!!feedTypesList[key] && key !== '__typename'));

    return (
      <Formik
        className="OperatorsFeedFilter"
        initialValues={{
          searchBy: '',
          auditLogType: '',
          creationDateFrom: '',
          creationDateTo: '',
        }}
        onSubmit={this.props.onSubmit}
        onReset={this.props.onSubmit}
        validate={validate}
      >
        {({ resetForm, isSubmitting, dirty }) => (
          <Form className="OperatorsFeedFilter__form">
            <Field
              name="searchBy"
              className="OperatorsFeedFilter__input OperatorsFeedFilter__search"
              label={I18n.t(attributeLabels.searchBy)}
              placeholder={I18n.t('PARTNERS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
              component={FormikInputField}
            />

            <Field
              name="auditLogType"
              className="OperatorsFeedFilter__input OperatorsFeedFilter__select"
              label={I18n.t(attributeLabels.actionType)}
              component={FormikSelectField}
              withAnyOption
            >
              {availableTypes.map(type => (
                <option key={type} value={type}>
                  {typesLabels[type] ? I18n.t(typesLabels[type]) : type}
                </option>
              ))}
            </Field>

            <FormikDateRangePicker
              className="OperatorsFeedFilter__input OperatorsFeedFilter__dates"
              label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
              periodKeys={{
                start: 'creationDateFrom',
                end: 'creationDateTo',
              }}
            />

            <div className="OperatorsFeedFilter__buttons">
              <Button
                className="OperatorsFeedFilter__button"
                onClick={resetForm}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="OperatorsFeedFilter__button"
                type="submit"
                primary
                disabled={isSubmitting || !dirty}
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
  withRequests({
    feedTypes: FeedTypesQuery,
  }),
)(OperatorsFeedFilter);
