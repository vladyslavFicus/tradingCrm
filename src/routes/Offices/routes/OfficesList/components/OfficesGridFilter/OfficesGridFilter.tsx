import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { filterLabels } from 'constants/user';
import countryList from 'utils/countryList';
import './OfficesGridFilter.scss';

type FormValues = {
  keyword?: string,
  officeUuid?: string,
  deskUuid?: string,
};

type Props = {
  onRefetch: () => void,
};

const OfficesGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FormValues>>();

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
      enableReinitialize
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, resetForm, values, dirty }) => (
        <Form className="OfficesGridFilter__form">
          <div className="OfficesGridFilter__fields">
            <Field
              name="keyword"
              className="OfficesGridFilter__field OfficesGridFilter__search"
              data-testid="OfficesGridFilter-keywordInput"
              label={I18n.t(filterLabels.searchValue)}
              placeholder={I18n.t('COMMON.NAME')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="country"
              className="OfficesGridFilter__field OfficesGridFilter__select"
              data-testid="OfficesGridFilter-countrySelect"
              label={I18n.t(filterLabels.country)}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {Object.keys(countryList).map(country => (
                <option key={country} value={country}>{countryList[country]}</option>
              ))}
            </Field>
          </div>

          <div className="OfficesGridFilter__buttons">
            <RefreshButton
              className="OfficesGridFilter__button"
              data-testid="OfficesGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="OfficesGridFilter__button"
              data-testid="OfficesGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="OfficesGridFilter__button"
              data-testid="OfficesGridFilter-applyButton"
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

export default React.memo(OfficesGridFilter);
