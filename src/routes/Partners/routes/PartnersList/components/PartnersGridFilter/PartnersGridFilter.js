import React, { PureComponent } from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { getActiveBrandConfig } from 'config';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import countryList from 'utils/countryList';
import { createValidator } from 'utils/validator';
import { statusLabels, statuses, affiliateTypeLabels, affiliateTypes } from '../../../../constants';
import './PartnersGridFilter.scss';

class PartnersGridFilter extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
  };

  initialValues = {
    searchBy: '',
    country: '',
    status: '',
    affiliateType: '',
    registrationDateFrom: '',
    registrationDateTo: '',
  };

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.onSubmit(decodeNullValues(values));
    setSubmitting(false);
  };

  onHandleReset = (resetForm) => {
    resetForm(this.initialValues);
    this.props.onReset();
  };

  render() {
    return (
      <Formik
        className="PartnersGridFilter"
        initialValues={this.initialValues}
        validate={createValidator({
          searchBy: 'string',
          country: ['string', `in:${Object.keys(countryList).join()}`],
          status: ['string', `in:${Object.keys(statuses).join()}`],
          affiliateType: ['string', `in:${Object.keys(affiliateTypes).join()}`],
          registrationDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
          registrationDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
        })}
        onSubmit={this.onHandleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
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
              <If condition={getActiveBrandConfig().regulation.isActive}>
                <Field
                  name="affiliateType"
                  className="PartnersGridFilter__input PartnersGridFilter__select"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('PARTNERS.GRID_FILTERS.PARTNER_TYPE')}
                  component={FormikSelectField}
                  searchable
                  withAnyOption
                >
                  {Object.keys(affiliateTypeLabels).map(affiliateType => (
                    <option key={affiliateType} value={affiliateType}>
                      {I18n.t(affiliateTypeLabels[affiliateType])}
                    </option>
                  ))}
                </Field>
              </If>
              <Field
                className="PartnersGridFilter__input PartnersGridFilter__dates"
                label={I18n.t('PARTNERS.GRID_FILTERS.REGISTRATION_DATE_RANGE')}
                startDatePlaceholderText={I18n.t('PARTNERS.GRID_FILTERS.REGISTRATION_DATE_FROM')}
                endDatePlaceholderText={I18n.t('PARTNERS.GRID_FILTERS.REGISTRATION_DATE_TO')}
                component={FormikDateRangePicker}
                periodKeys={{
                  start: 'registrationDateFrom',
                  end: 'registrationDateTo',
                }}
              />
            </div>

            <div className="PartnersGridFilter__buttons">
              <Button
                className="PartnersGridFilter__button"
                onClick={() => this.onHandleReset(resetForm)}
                disabled={isSubmitting}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="PartnersGridFilter__button"
                disabled={isSubmitting}
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

export default PartnersGridFilter;
