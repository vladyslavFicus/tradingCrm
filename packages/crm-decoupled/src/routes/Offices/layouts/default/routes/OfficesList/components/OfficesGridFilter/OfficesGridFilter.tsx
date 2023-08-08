import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Button, RefreshButton } from 'components';
import { Utils } from '@crm/common';
import useFilter from 'hooks/useFilter';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { FormValues } from 'routes/Offices/types/officesGridFilter';
import { filterLabels } from 'constants/user';
import './OfficesGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const OfficesGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      enableReinitialize
      initialValues={filters}
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
              {Object.keys(Utils.countryList).map(country => (
                <option key={country} value={country}>{Utils.countryList[country]}</option>
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
