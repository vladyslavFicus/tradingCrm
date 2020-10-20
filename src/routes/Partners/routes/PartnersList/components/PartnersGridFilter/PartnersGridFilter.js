import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import countryList from 'utils/countryList';
import { statusLabels } from '../../../../constants';
import './PartnersGridFilter.scss';

class PartnersGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
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
    const { location: { state } } = this.props;

    return (
      <Formik
        enableReinitialize
        className="PartnersGridFilter"
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          dirty,
        }) => (
          <Form className="PartnersGridFilter__form">
            <div className="PartnersGridFilter__inputs">
              <Field
                name="searchBy"
                className="PartnersGridFilter__input PartnersGridFilter__search"
                label={I18n.t('PARTNERS.GRID_FILTERS.SEARCH_BY')}
                placeholder={I18n.t('PARTNERS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
              />
              <Field
                name="country"
                className="PartnersGridFilter__input PartnersGridFilter__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('PARTNERS.GRID_FILTERS.COUNTRY')}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {Object.keys(countryList).map(key => (
                  <option key={key} value={key}>{countryList[key]}</option>
                ))}
              </Field>
              <Field
                name="status"
                className="PartnersGridFilter__input PartnersGridFilter__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('PARTNERS.GRID_FILTERS.STATUS')}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {Object.keys(statusLabels).map(status => (
                  <option key={status} value={status}>{I18n.t(statusLabels[status])}</option>
                ))}
              </Field>
              <FormikDateRangePicker
                className="PartnersGridFilter__input PartnersGridFilter__dates"
                label={I18n.t('PARTNERS.GRID_FILTERS.REGISTRATION_DATE_RANGE')}
                periodKeys={{
                  start: 'registrationDateFrom',
                  end: 'registrationDateTo',
                }}
              />
            </div>

            <div className="PartnersGridFilter__buttons">
              <Button
                className="PartnersGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="PartnersGridFilter__button"
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

export default withRouter(PartnersGridFilter);
