import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import { deskTypes, defaultDeskFlags } from '../../constants';
import './DesksGridFilter.scss';

class DesksGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    officesData: PropTypes.userBranchHierarchyResponse.isRequired,
  };

  onHandleReset = () => {
    this.props.history.replace({ query: { filters: {} } });
  };

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.history.replace({
      query: {
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  };

  render() {
    const { officesData } = this.props;

    const offices = get(officesData, 'data.hierarchy.userBranchHierarchy.data.OFFICE') || [];

    return (
      <Formik
        className="DesksGridFilter"
        initialValues={{}}
        validate={createValidator({
          keyword: 'string',
          officeUuid: 'string',
          deskType: 'string',
          defaultDeskFlag: 'string',
        })}
        onReset={this.onHandleReset}
        onSubmit={this.onHandleSubmit}
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
              />

              <Field
                name="officeUuid"
                className="DesksGridFilter__field DesksGridFilter__select"
                label={I18n.t('DESKS.GRID_FILTERS.OFFICE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                searchable
                withAnyOption
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
              >
                {deskTypes.map((deskType, key) => (
                  <option key={key} value={deskType.value}>
                    {I18n.t(deskType.label)}
                  </option>
                ))}
              </Field>

              <Field
                name="defaultDeskFlag"
                className="DesksGridFilter__field DesksGridFilter__select"
                label={I18n.t('DESKS.GRID_FILTERS.DEFAULT_DESK')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                withAnyOption
              >
                {defaultDeskFlags.map((defaultDeskFlag, key) => (
                  <option key={key} value={defaultDeskFlag.value}>
                    {I18n.t(defaultDeskFlag.label)}
                  </option>
                ))}
              </Field>
            </div>

            <div className="DesksGridFilter__buttons">
              <Button
                className="DesksGridFilter__button"
                onClick={resetForm}
                disabled={isSubmitting}
                common
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
