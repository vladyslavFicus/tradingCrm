import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { createValidator } from 'utils/validator';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button, RefreshButton } from 'components/UI';
import { deskTypes } from '../../constants';
import './DesksGridFilter.scss';

class DesksGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    officesData: PropTypes.userBranchHierarchyResponse.isRequired,
    handleRefetch: PropTypes.func.isRequired,
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
      officesData,
      handleRefetch,
      location: { state },
    } = this.props;

    const offices = get(officesData, 'data.userBranches.OFFICE') || [];

    return (
      <Formik
        enableReinitialize
        className="DesksGridFilter"
        initialValues={state?.filters || {}}
        validate={createValidator({
          keyword: 'string',
          officeUuid: 'string',
          deskType: 'string',
        })}
        onSubmit={this.handleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          dirty,
        }) => (
          <Form className="DesksGridFilter__form">
            <div className="DesksGridFilter__fields">
              <Field
                name="keyword"
                className="DesksGridFilter__field DesksGridFilter__search"
                label={I18n.t('DESKS.GRID_FILTERS.SEARCH_BY')}
                placeholder={I18n.t('DESKS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                withFocus
              />

              <Field
                name="officeUuid"
                className="DesksGridFilter__field DesksGridFilter__select"
                label={I18n.t('DESKS.GRID_FILTERS.OFFICE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {offices.map(({ name, uuid }) => (
                  <option key={uuid} value={uuid}>{name}</option>
                ))}
              </Field>

              <Field
                name="deskType"
                className="DesksGridFilter__field DesksGridFilter__select"
                label={I18n.t('DESKS.GRID_FILTERS.DESK_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                {deskTypes.map((deskType, key) => (
                  <option key={key} value={deskType.value}>
                    {I18n.t(deskType.label)}
                  </option>
                ))}
              </Field>
            </div>

            <div className="DesksGridFilter__buttons">
              <RefreshButton
                className="DesksGridFilter__button"
                onClick={handleRefetch}
              />

              <Button
                className="DesksGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="DesksGridFilter__button"
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

export default withRouter(DesksGridFilter);
