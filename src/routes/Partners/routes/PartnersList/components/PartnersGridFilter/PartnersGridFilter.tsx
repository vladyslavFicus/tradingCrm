import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import countryList from 'utils/countryList';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/Buttons';
import { statusesLabels, statuses } from '../../../../constants';
import { PartnersQueryVariables } from '../../graphql/__generated__/PartnersQuery';
import './PartnersGridFilter.scss';

type FormValues = {
  searchBy?: string,
  country?: string,
  status?: string,
  registrationDateFrom?: string,
  registrationDateTo?: string,
};

type Props = {
  onRefetch: () => void,
};

const PartnersGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<PartnersQueryVariables>>();

  const history = useHistory();

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: ResetForm<FormValues>) => {
    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  return (
    <Formik
      className="PartnersGridFilter"
      initialValues={state?.filters as FormValues || {}}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, resetForm, values, dirty }) => (
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
              {[
                <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                ...Object.keys(countryList)
                  .map(country => (
                    <option key={country} value={country}>{countryList[country]}</option>
                  )),
              ]}
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
              {Object.keys(statusesLabels).map(status => (
                <option key={status} value={status}>{I18n.t(statusesLabels[status as statuses])}</option>
              ))}
            </Field>

            <Field
              className="PartnersGridFilter__field PartnersGridFilter__date-range"
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
              onClick={onRefetch}
            />

            <Button
              className="PartnersGridFilter__button"
              onClick={() => handleReset(resetForm)}
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
};

export default React.memo(PartnersGridFilter);
