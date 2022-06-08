import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { omit } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import {
  departmentsLabels,
  rolesLabels,
  statusesLabels,
} from 'constants/operators';
import countryList from 'utils/countryList';
import renderLabel from 'utils/renderLabel';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { Button, RefreshButton } from 'components/UI';
import AuthoritiesOptionsQuery from './graphql/AuthoritiesOptionsQuery';
import './OperatorsGridFilter.scss';

const attributeLabels = {
  department: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.DEPARTMENT',
  roles: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.ROLE',
};

// unAvailableDepartments - is departments that can't be set to Operator
const unAvailableDepartments = ['AFFILIATE', 'AFFILIATE_MANAGER', 'CDE', 'BI', 'RBAC'];

class OperatorsGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    handleRefetch: PropTypes.func.isRequired,
    authoritiesQuery: PropTypes.query({
      authoritiesOptions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    }).isRequired,
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

  handleSubmit = (values, { setSubmitting }) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  };

  // With customOnChange because Formik can't delete nested object from values
  handleDepartmentFieldChange = (value, setFieldValue) => {
    if (value) {
      setFieldValue('authorities.department', value);
    } else {
      setFieldValue('authorities', undefined);
    }
  }

  render() {
    const {
      location: { state },
      handleRefetch,
      authoritiesQuery,
    } = this.props;

    const authorities = authoritiesQuery?.data?.authoritiesOptions || {};
    const allDepartmentRoles = authoritiesQuery?.data?.authoritiesOptions || {};
    const availableDepartments = omit(allDepartmentRoles, unAvailableDepartments);

    return (
      <Formik
        className="OperatorsGridFilter"
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
          resetForm,
          values,
          setFieldValue,
          dirty,
        }) => {
          const availableRoles = values?.authorities?.department ? authorities[values?.authorities?.department] : [];

          return (
            <Form className="OperatorsGridFilter__form">
              <div className="OperatorsGridFilter__fields">
                <Field
                  name="searchBy"
                  className="OperatorsGridFilter__field OperatorsGridFilter__search"
                  label={I18n.t('OPERATORS.GRID_FILTERS.SEARCH_BY')}
                  placeholder={I18n.t('OPERATORS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
                  addition={<i className="icon icon-search" />}
                  component={FormikInputField}
                  withFocus
                />

                <Field
                  name="country"
                  className="OperatorsGridFilter__field OperatorsGridFilter__select"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('OPERATORS.GRID_FILTERS.COUNTRY')}
                  component={FormikSelectField}
                  withAnyOption
                  searchable
                  withFocus
                >
                  {[
                    <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                    ...Object.keys(countryList)
                      .map(country => (
                        <option key={country} value={country}>{countryList[country]}</option>
                      )),
                  ]}
                </Field>

                <Field
                  name="status"
                  className="OperatorsGridFilter__field OperatorsGridFilter__select"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('PARTNERS.GRID_FILTERS.STATUS')}
                  component={FormikSelectField}
                  withAnyOption
                  searchable
                  withFocus
                >
                  {Object.keys(statusesLabels).map(status => (
                    <option key={status} value={status}>{I18n.t(statusesLabels[status])}</option>
                  ))}
                </Field>

                <Field
                  className="OperatorsGridFilter__field OperatorsGridFilter__date-range"
                  label={I18n.t('OPERATORS.GRID_FILTERS.REGISTRATION_DATE_RANGE')}
                  component={FormikDateRangePicker}
                  fieldsNames={{
                    from: 'registrationDateFrom',
                    to: 'registrationDateTo',
                  }}
                  withFocus
                />
                <Field
                  name="authorities.department"
                  className="OperatorsGridFilter__field OperatorsGridFilter__select"
                  label={I18n.t(attributeLabels.department)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  disabled={isSubmitting}
                  withAnyOption
                  customOnChange={value => this.handleDepartmentFieldChange(value, setFieldValue)}
                  searchable
                  withFocus
                >
                  {Object.keys(availableDepartments).map(department => (
                    <option key={department} value={department}>
                      {I18n.t(renderLabel(department, departmentsLabels))}
                    </option>
                  ))}
                </Field>
                <Field
                  name="authorities.roles"
                  label={I18n.t(attributeLabels.roles)}
                  className="OperatorsGridFilter__field OperatorsGridFilter__select"
                  component={FormikSelectField}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  disabled={isSubmitting || !availableRoles.length}
                  searchable
                  withFocus
                  multiple
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>
                      {I18n.t(renderLabel(role, rolesLabels))}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="OperatorsGridFilter__buttons">
                <RefreshButton
                  className="OperatorsGridFilter__button"
                  onClick={handleRefetch}
                />

                <Button
                  className="OperatorsGridFilter__button"
                  onClick={() => this.handleReset(resetForm)}
                  disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                  primary
                >
                  {I18n.t('COMMON.RESET')}
                </Button>

                <Button
                  className="OperatorsGridFilter__button"
                  disabled={isSubmitting || !dirty}
                  type="submit"
                  primary
                >
                  {I18n.t('COMMON.APPLY')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    authoritiesQuery: AuthoritiesOptionsQuery,
  }),
)(OperatorsGridFilter);
