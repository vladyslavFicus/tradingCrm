import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { ResetForm } from 'types/formik';
import { FormikDateRangePicker, FormikInputField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/Buttons';
import { State } from 'types';
import './IpWhitelistGridFilter.scss';

type FormValues = {
  ip?: string,
  creationDateRange?: {
    from?: string,
    to?: string,
  },
};

type Props = {
  onRefetch: () => void,
};

const IpWhitelistGridFilter = (props: Props) => {
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
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="IpWhitelistGridFilter">
          <div className="IpWhitelistGridFilter__fields">
            <Field
              name="ip"
              className="IpWhitelistGridFilter__field IpWhitelistGridFilter__search"
              label={I18n.t('IP_WHITELIST.GRID.FILTER_FORM.SEARCH_BY_IP')}
              placeholder={I18n.t('IP_WHITELIST.GRID.FILTER_FORM.SEARCH_BY_IP_PLACEHOLDER')}
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
            />

            <Field
              name="creationDateRange"
              label={I18n.t('IP_WHITELIST.GRID.FILTER_FORM.CREATION_DATE_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="IpWhitelistGridFilter__field IpWhitelistGridFilter__date-range"
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'creationDateRange.from',
                to: 'creationDateRange.to',
              }}
            />
          </div>

          <div className="IpWhitelistGridFilter__buttons">
            <RefreshButton
              className="IpWhitelistGridFilter__button"
              onClick={onRefetch}
            />

            <Button
              className="IpWhitelistGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="IpWhitelistGridFilter__button"
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

export default React.memo(IpWhitelistGridFilter);