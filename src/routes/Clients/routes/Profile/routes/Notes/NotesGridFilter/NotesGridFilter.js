import React, { PureComponent } from 'react';
import { get, omit } from 'lodash';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { Button } from 'components/UI';
import { departmentsLabels } from 'constants/operators';
import { attributeLabels } from '../constants';
import AuthoritiesOptionsQuery from './graphql/AuthorityOptionsQuery';

class NotesGridFilter extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    authoritiesOptions: PropTypes.shape({
      data: PropTypes.shape({
        authoritiesOptions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  render() {
    const {
      authoritiesOptions: {
        data,
        loading,
      },
      onSubmit,
    } = this.props;

    const allDepartmentRoles = get(data, 'authoritiesOptions') || {};
    const departmentRoles = omit(allDepartmentRoles, ['PLAYER', 'AFFILIATE']);

    return (
      <Formik
        initialValues={{
          department: '',
          changedAtFrom: '',
          changedAtTo: '',
        }}
        onSubmit={onSubmit}
        onReset={onSubmit}
        validate={
          createValidator({
            department: ['string', `in:${Object.keys(departmentRoles).join()}`],
            changedAtFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
            changedAtTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
          }, translateLabels(attributeLabels), false)
        }
      >
        {({ resetForm, isValid, dirty }) => (
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
            />
            <div className="filter-row__button-block">
              <Button
                className="margin-right-15"
                common
                onClick={resetForm}
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

export default withRequests({
  authoritiesOptions: AuthoritiesOptionsQuery,
})(NotesGridFilter);
