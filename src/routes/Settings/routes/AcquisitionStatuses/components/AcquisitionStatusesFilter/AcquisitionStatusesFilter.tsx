import React from 'react';
import I18n from 'i18n-js';
import { useLocation, useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import './AcquisitionStatusesFilter.scss';

type FormValues = {
  statusName?: string,
  type?: AcquisitionStatusTypes,
}

type Props = {
  onRefresh: Function,
}

const AcquisitionStatusesFilter = (props: Props) => {
  const { onRefresh } = props;

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

  const handleReset = (resetForm: Function) => {
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
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="AcquisitionStatusesFilter">
          <div className="AcquisitionStatusesFilter__fields">
            <Field
              name="statusName"
              className="AcquisitionStatusesFilter__field"
              label={I18n.t('SETTINGS.ACQUISITION_STATUSES.FORM.FIELDS.SEARCH_BY')}
              placeholder={I18n.t('SETTINGS.ACQUISITION_STATUSES.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              maxLength={200}
              withFocus
            />
            <Field
              name="type"
              label={I18n.t('SETTINGS.ACQUISITION_STATUSES.FORM.FIELDS.ACQUISITION_STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="AcquisitionStatusesFilter__field"
              component={FormikSelectField}
              withFocus
              withAnyOption
            >
              <option key={AcquisitionStatusTypes.SALES} value={AcquisitionStatusTypes.SALES}>
                {I18n.t('SETTINGS.ACQUISITION_STATUSES.TYPES.SALES')}
              </option>
              <option key={AcquisitionStatusTypes.RETENTION} value={AcquisitionStatusTypes.RETENTION}>
                {I18n.t('SETTINGS.ACQUISITION_STATUSES.TYPES.RETENTION')}
              </option>
            </Field>
          </div>
          <div className="AcquisitionStatusesFilter__buttons">
            <RefreshButton
              className="AcquisitionStatusesFilter__button"
              onClick={onRefresh}
            />
            <Button
              className="AcquisitionStatusesFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="AcquisitionStatusesFilter__button"
              type="submit"
              disabled={isSubmitting || !dirty}
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

export default React.memo(AcquisitionStatusesFilter);