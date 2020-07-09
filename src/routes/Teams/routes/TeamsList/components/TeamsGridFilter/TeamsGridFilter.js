import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Form, Field, withFormik } from 'formik';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator } from 'utils/validator';
import './TeamsGridFilter.scss';

class TeamsGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    desksAndOffices: PropTypes.userBranchHierarchyResponse.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
      keyword: PropTypes.string,
      officeUuid: PropTypes.string,
      deskUuid: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      keyword: PropTypes.string,
      officeUuid: PropTypes.string,
      deskUuid: PropTypes.string,
    }).isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  handleReset = () => {
    const { history, initialValues, resetForm } = this.props;

    history.replace({ query: { filters: {} } });
    resetForm(initialValues);
  };

  handleOfficeChange = (value) => {
    const { setFieldValue } = this.props;

    setFieldValue('deskUuid', '');
    setFieldValue('officeUuid', value);
  };

  render() {
    const {
      values: { officeUuid },
      desksAndOffices,
      isSubmitting,
    } = this.props;

    const isLoading = desksAndOffices.loading;
    const offices = get(desksAndOffices, 'data.userBranches.OFFICE') || [];
    const desks = get(desksAndOffices, 'data.userBranches.DESK') || [];
    const desksByOffice = desks.filter(desk => desk.parentBranch.uuid === officeUuid);
    const desksOptions = officeUuid ? desksByOffice : desks;

    return (
      <Form className="TeamsGridFilter__form">
        <div className="TeamsGridFilter__fields">
          <Field
            name="keyword"
            className="TeamsGridFilter__field TeamsGridFilter__search"
            label={I18n.t('TEAMS.GRID_FILTERS.SEARCH_BY')}
            placeholder={I18n.t('TEAMS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
          />
          <Field
            name="officeUuid"
            className="TeamsGridFilter__field TeamsGridFilter__select"
            label={I18n.t('TEAMS.GRID_FILTERS.OFFICE')}
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
            component={FormikSelectField}
            customOnChange={this.handleOfficeChange}
            disabled={isLoading}
            searchable
            withAnyOption
          >
            {offices.map(({ name, uuid }) => (
              <option key={uuid} value={uuid}>{name}</option>
            ))}
          </Field>
          <Field
            name="deskUuid"
            className="TeamsGridFilter__field TeamsGridFilter__select"
            label={I18n.t('TEAMS.GRID_FILTERS.DESK')}
            placeholder={I18n.t(
              (officeUuid && !desksByOffice.length)
                ? 'TEAMS.GRID_FILTERS.DESK_ERROR_PLACEHOLDER'
                : 'COMMON.SELECT_OPTION.ANY',
            )}
            component={FormikSelectField}
            disabled={isLoading || (!!officeUuid && !desksByOffice.length)}
            searchable
            withAnyOption
          >
            {desksOptions.map(({ name, uuid }) => (
              <option key={uuid} value={uuid}>{name}</option>
            ))}
          </Field>
        </div>

        <div className="TeamsGridFilter__buttons">
          <Button
            className="TeamsGridFilter__button"
            onClick={this.handleReset}
            disabled={isSubmitting}
            common
          >
            {I18n.t('COMMON.RESET')}
          </Button>

          <Button
            className="TeamsGridFilter__button"
            disabled={isSubmitting}
            type="submit"
            primary
          >
            {I18n.t('COMMON.APPLY')}
          </Button>
        </div>
      </Form>
    );
  }
}

export default compose(
  withRouter,
  withFormik({
    mapPropsToValues: () => ({
      keyword: '',
      officeUuid: '',
      deskUuid: '',
    }),
    validate: values => createValidator({
      keyword: 'string',
      officeUuid: 'string',
      deskUuid: 'string',
    })(values),
    handleSubmit: (values, { props, setSubmitting }) => {
      props.history.replace({
        query: {
          filters: decodeNullValues(values),
        },
      });
      setSubmitting(false);
    },
  }),
)(TeamsGridFilter);
