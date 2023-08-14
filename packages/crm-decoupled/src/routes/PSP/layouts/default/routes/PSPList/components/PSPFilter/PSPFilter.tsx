import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Button, RefreshButton } from 'components';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import useFilter from 'hooks/useFilter';
import { favouriteStatuses } from 'routes/PSP/constants/PSP';
import './PSPFilter.scss';

type FormValues = {
  searchBy?: string,
  favourite?: boolean,
};

type Props = {
  onRefresh: () => void,
};

const PSPFilter = (props: Props) => {
  const { onRefresh } = props;

  // ===== Handlers ===== //
  const { filters, handleSubmit, handleReset } = useFilter<FormValues>();

  return (
    <Formik
      enableReinitialize
      initialValues={filters}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="PSPFilter">
          <div className="PSPFilter__fields">
            <Field
              name="searchBy"
              className="PSPFilter__field PSPFilter__field--large"
              data-testid="PSPFilter-searchByInput"
              label={I18n.t('SETTINGS.PSP.FORM.FIELDS.SEARCH_BY')}
              placeholder={I18n.t('SETTINGS.PSP.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              maxLength={200}
              withFocus
            />

            <Field
              name="favourite"
              data-testid="PSPFilter-favouriteSelect"
              label={I18n.t('SETTINGS.PSP.FORM.FIELDS.FAVOURITE_PSP')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="PSPFilter__field"
              component={FormikSelectField}
              withFocus
              withAnyOption
            >
              {favouriteStatuses.map(({ label, value }) => (
                <option
                  key={label}
                  /* @ts-ignore TS doesn't approve value as boolean type */
                  value={value}
                >
                  {I18n.t(`SETTINGS.PSP.TYPES.${label}`)}
                </option>
              ))}
            </Field>

            <div className="PSPFilter__buttons">
              <RefreshButton
                className="PSPFilter__button"
                data-testid="PSPFilter-refreshButton"
                onClick={onRefresh}
              />

              <Button
                className="PSPFilter__button"
                data-testid="PSPFilter-resetButton"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="PSPFilter__button"
                data-testid="PSPFilter-applyButton"
                type="submit"
                disabled={isSubmitting || !dirty}
                primary
              >
                {I18n.t('COMMON.APPLY')}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(PSPFilter);
