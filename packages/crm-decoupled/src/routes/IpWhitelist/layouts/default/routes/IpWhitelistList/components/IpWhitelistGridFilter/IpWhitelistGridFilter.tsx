import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Button, RefreshButton } from 'components';
import useFilter from 'hooks/useFilter';
import { FormikDateRangePicker, FormikInputField } from 'components/Formik';
import { FormValues } from 'routes/IpWhitelist/types/ipWhitelistGridFilter';
import './IpWhitelistGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const IpWhitelistGridFilter = (props: Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
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
              data-testid="IpWhitelistGridFilter-ipInput"
              label={I18n.t('IP_WHITELIST.GRID.FILTER_FORM.SEARCH_BY_IP')}
              placeholder={I18n.t('IP_WHITELIST.GRID.FILTER_FORM.SEARCH_BY_IP_PLACEHOLDER')}
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
            />

            <Field
              name="creationDateRange"
              data-testid="IpWhitelistGridFilter-creationDateRangePicker"
              label={I18n.t('IP_WHITELIST.GRID.FILTER_FORM.CREATION_DATE_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="IpWhitelistGridFilter__field IpWhitelistGridFilter__date-range"
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'creationDateRange.from',
                to: 'creationDateRange.to',
              }}
            />

            <div className="IpWhitelistGridFilter__buttons">
              <RefreshButton
                className="IpWhitelistGridFilter__button"
                data-testid="IpWhitelistGridFilter-refreshButton"
                onClick={onRefetch}
              />

              <Button
                className="IpWhitelistGridFilter__button"
                data-testid="IpWhitelistGridFilter-resetButton"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="IpWhitelistGridFilter__button"
                data-testid="IpWhitelistGridFilter-applyButton"
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

export default React.memo(IpWhitelistGridFilter);
