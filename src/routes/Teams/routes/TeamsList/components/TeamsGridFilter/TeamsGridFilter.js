import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form, Field } from 'formik';
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
  };

  handleReset = (resetForm) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm({});
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

  render() {
    const {
      desksAndOffices,
      location: { state },
    } = this.props;

    const isLoading = desksAndOffices.loading;
    const offices = get(desksAndOffices, 'data.userBranches.OFFICE') || [];
    const desks = get(desksAndOffices, 'data.userBranches.DESK') || [];

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
        validate={createValidator({
          keyword: 'string',
          officeUuid: 'string',
          deskUuid: 'string',
        })}
      >
        {({ values, dirty, isSubmitting, resetForm }) => {
          const desksByOffice = desks.filter(desk => desk.parentBranch.uuid === values.officeUuid);
          const desksOptions = values.officeUuid ? desksByOffice : desks;

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
                  withFocus
                />

                <Field
                  name="officeUuid"
                  className="TeamsGridFilter__field TeamsGridFilter__select"
                  label={I18n.t('TEAMS.GRID_FILTERS.OFFICE')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  disabled={isLoading}
                  withAnyOption
                  searchable
                  withFocus
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
                    !desksByOffice.length
                      ? 'TEAMS.GRID_FILTERS.DESK_ERROR_PLACEHOLDER'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )}
                  component={FormikSelectField}
                  disabled={isLoading || !desksByOffice.length}
                  withAnyOption
                  searchable
                  withFocus
                >
                  {desksOptions.map(({ name, uuid }) => (
                    <option key={uuid} value={uuid}>{name}</option>
                  ))}
                </Field>
              </div>

              <div className="TeamsGridFilter__buttons">
                <Button
                  className="TeamsGridFilter__button"
                  onClick={() => this.handleReset(resetForm)}
                  disabled={isSubmitting}
                  primary
                >
                  {I18n.t('COMMON.RESET')}
                </Button>

                <Button
                  className="TeamsGridFilter__button"
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

export default withRouter(TeamsGridFilter);
