import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import countryList from 'utils/countryList';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import { statusLabels } from '../../../../constants';
import './PartnersGridFilter.scss';

class PartnersGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
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
      handleRefetch,
      location: { state },
    } = this.props;

    return (
      <Formik
        className="PartnersGridFilter"
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
          resetForm,
          values,
          dirty,
        }) => (
          <Form className="PartnersGridFilter__form">
            <div className="PartnersGridFilter__fields">
              <Field
                name="searchBy"
                className="PartnersGridFilter__field PartnersGridFilter__search"
                label={I18n.t('PARTNERS.GRID_FILTERS.SEARCH_BY')}
                placeholder={I18n.t('PARTNERS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                withFocus
              />

              <Field
                name="country"
                className="PartnersGridFilter__field PartnersGridFilter__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('PARTNERS.GRID_FILTERS.COUNTRY')}
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {Object.keys(countryList).map(key => (
                  <option key={key} value={key}>{countryList[key]}</option>
                ))}
              </Field>

              <Field
                name="status"
                className="PartnersGridFilter__field PartnersGridFilter__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('PARTNERS.GRID_FILTERS.STATUS')}
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {Object.keys(statusLabels).map(status => (
                  <option key={status} value={status}>{I18n.t(statusLabels[status])}</option>
                ))}
              </Field>

              <FormikDateRangeGroup
                className="PartnersGridFilter__field PartnersGridFilter__date-range"
                label={I18n.t('PARTNERS.GRID_FILTERS.REGISTRATION_DATE_RANGE')}
                periodKeys={{
                  start: 'registrationDateFrom',
                  end: 'registrationDateTo',
                }}
                withFocus
              />
            </div>

            <div className="PartnersGridFilter__buttons">
              <RefreshButton
                className="PartnersGridFilter__button"
                onClick={handleRefetch}
              />

              <Button
                className="PartnersGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
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
