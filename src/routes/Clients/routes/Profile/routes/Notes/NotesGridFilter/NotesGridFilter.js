import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { get, omit } from 'lodash';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import { departmentsLabels } from 'constants/operators';
import { attributeLabels } from '../constants';
import AuthoritiesOptionsQuery from './graphql/AuthorityOptionsQuery';

class NotesGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    authoritiesOptions: PropTypes.shape({
      data: PropTypes.shape({
        authoritiesOptions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    handleRefetch: PropTypes.func.isRequired,
  };

  handleSubmit = (values, { setSubmitting }) => {
    this.props.history.replace({
      query: {
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  };

  handleReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  render() {
    const {
      handleRefetch,
      location: { query },
      authoritiesOptions: {
        data,
        loading,
      },
    } = this.props;

    const allDepartmentRoles = get(data, 'authoritiesOptions') || {};
    const departmentRoles = omit(allDepartmentRoles, ['PLAYER', 'AFFILIATE']);

    return (
      <Formik
        initialValues={query?.filters || {}}
        onSubmit={this.handleSubmit}
        validate={
          createValidator({
            department: ['string', `in:${Object.keys(departmentRoles).join()}`],
            changedAtFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
            changedAtTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
          }, translateLabels(attributeLabels), false)
        }
        enableReinitialize
      >
        {({ isValid, dirty }) => (
          <Form className="filter-row">
            <Field
              name="department"
              label={I18n.t(attributeLabels.department)}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              component={FormikSelectField}
              className="filter-row__medium"
              disabled={loading}
              withAnyOption
              searchable
              withFocus
            >
              {Object.keys(departmentRoles).map(department => (
                <option key={department} value={department}>
                  {I18n.t(renderLabel(department, departmentsLabels))}
                </option>
              ))}
            </Field>
            <FormikDateRangeGroup
              className="filter-row__date-range"
              label={I18n.t('PLAYER_PROFILE.NOTES.FILTER.LABELS.CREATION_DATE_RANGE')}
              periodKeys={{
                start: 'changedAtFrom',
                end: 'changedAtTo',
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
                type="submit"
                disabled={!isValid || !dirty}
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
    authoritiesOptions: AuthoritiesOptionsQuery,
  }),
)(NotesGridFilter);
