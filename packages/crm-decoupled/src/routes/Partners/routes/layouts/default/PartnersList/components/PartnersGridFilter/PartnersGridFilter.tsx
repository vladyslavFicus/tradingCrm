import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Button, RefreshButton } from 'components';
import { Utils } from '@crm/common';
import useFilter from 'hooks/useFilter';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { statusesLabels, statuses } from 'routes/Partners/constants';
import { FormValues } from 'routes/Partners/types';
import './PartnersGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const PartnersGridFilter = (props: Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      className="PartnersGridFilter"
      initialValues={filters}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, resetForm, values, dirty }) => (
        <Form className="PartnersGridFilter__form">
          <div className="PartnersGridFilter__fields">
            <Field
              name="searchBy"
              className="PartnersGridFilter__field PartnersGridFilter__search"
              data-testid="PartnersGridFilter-searchByInput"
              label={I18n.t('PARTNERS.GRID_FILTERS.SEARCH_BY')}
              placeholder={I18n.t('PARTNERS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="country"
              className="PartnersGridFilter__field PartnersGridFilter__select"
              data-testid="PartnersGridFilter-countrySelect"
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              label={I18n.t('PARTNERS.GRID_FILTERS.COUNTRY')}
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {[
                <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                ...Object.keys(Utils.countryList)
                  .map(country => (
                    <option key={country} value={country}>{Utils.countryList[country]}</option>
                  )),
              ]}
            </Field>

            <Field
              name="status"
              className="PartnersGridFilter__field PartnersGridFilter__select"
              data-testid="PartnersGridFilter-statusSelect"
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              label={I18n.t('PARTNERS.GRID_FILTERS.STATUS')}
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {Object.keys(statusesLabels).map(status => (
                <option key={status} value={status}>{I18n.t(statusesLabels[status as statuses])}</option>
              ))}
            </Field>

            <Field
              className="PartnersGridFilter__field PartnersGridFilter__date-range"
              data-testid="PartnersGridFilter-registrationDateRangePicker"
              label={I18n.t('PARTNERS.GRID_FILTERS.REGISTRATION_DATE_RANGE')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'registrationDateFrom',
                to: 'registrationDateTo',
              }}
              withFocus
            />
          </div>

          <div className="PartnersGridFilter__buttons">
            <RefreshButton
              className="PartnersGridFilter__button"
              data-testid="PartnersGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="PartnersGridFilter__button"
              data-testid="PartnersGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="PartnersGridFilter__button"
              data-testid="PartnersGridFilter-applyButton"
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
};

export default React.memo(PartnersGridFilter);
