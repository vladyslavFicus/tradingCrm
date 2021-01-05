import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { omit } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import { departmentsLabels } from 'constants/operators';
import { attributeLabels } from './constants';
import AuthoritiesOptionsQuery from './graphql/AuthorityOptionsQuery';
import './ClientNotesGridFilter.scss';

class ClientNotesGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    authoritiesOptionsQuery: PropTypes.query({
      authoritiesOptions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
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

  render() {
    const {
      handleRefetch,
      location: { state },
      authoritiesOptionsQuery: {
        data,
        loading,
      },
    } = this.props;

    const allDepartmentRoles = data?.authoritiesOptions || {};
    const departmentRoles = omit(allDepartmentRoles, ['PLAYER', 'AFFILIATE']);

    return (
      <Formik
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
        validate={
          createValidator({
            department: ['string', `in:${Object.keys(departmentRoles).join()}`],
            changedAtFrom: 'dateWithTime',
            changedAtTo: 'dateWithTime',
          }, translateLabels(attributeLabels), false)
        }
        enableReinitialize
      >
        {({
          isSubmitting,
          resetForm,
          values,
          dirty,
        }) => (
          <Form className="ClientNotesGridFilter">
            <Field
              name="department"
              label={I18n.t(attributeLabels.department)}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              component={FormikSelectField}
              className="ClientNotesGridFilter__field"
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
              className="ClientNotesGridFilter__field ClientNotesGridFilter__field--date-range"
              label={I18n.t('PLAYER_PROFILE.NOTES.FILTER.LABELS.CREATION_DATE_RANGE')}
              periodKeys={{
                start: 'changedAtFrom',
                end: 'changedAtTo',
              }}
              withFocus
            />
            <div className="ClientNotesGridFilter__buttons-group">
              <RefreshButton
                className="ClientNotesGridFilter__button"
                onClick={handleRefetch}
              />
              <Button
                className="ClientNotesGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="ClientNotesGridFilter__button"
                type="submit"
                disabled={isSubmitting || !dirty}
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
    authoritiesOptionsQuery: AuthoritiesOptionsQuery,
  }),
)(ClientNotesGridFilter);
