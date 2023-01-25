import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field, FormikValues, FormikHelpers } from 'formik';
import { State } from 'types';
import { getAvailableLanguages } from 'config';
import { filterLabels } from 'constants/user';
import { statuses as operatorsStasuses } from 'constants/operators';
import { createValidator, translateLabels } from 'utils/validator';
import { Partner, Operator } from '__generated__/types';
import countryList from 'utils/countryList';
import { Button, RefreshButton } from 'components/UI';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { RulesQueryVariables } from 'components/HierarchyProfileRules/graphql/__generated__/RulesQuery';
import './RulesGridFilter.scss';

type Props = {
  partners?: Array<Partner>,
  operators?: Array<Operator>,
  type?: string,
  handleRefetch?: () => void,
};

const validate = createValidator({
  searchBy: 'string',
  country: ['string', `in:${['UNDEFINED', ...Object.keys(countryList)].join()}`],
  language: 'string',
  operators: 'string',
  partners: 'string',
}, translateLabels(filterLabels), false);

const RulesGridFilter = (props: Props) => {
  const {
    type,
    partners,
    operators,
    handleRefetch,
  } = props;

  const history = useHistory();
  const { state } = useLocation<State<RulesQueryVariables>>();

  const handleReset = (resetForm: Function) => {
    history?.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  const handleSubmit = (values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
    history?.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  };

  return (
    <Formik
      className="RulesGridFilter"
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
      validate={validate}
      enableReinitialize
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="RulesGridFilter__form">
          <div className="RulesGridFilter__fields">
            <Field
              name="createdByOrUuid"
              className="RulesGridFilter__field RulesGridFilter__search"
              placeholder={I18n.t('RULES.FILTERS.RULE')}
              label={I18n.t(filterLabels.searchValue)}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="country"
              className="RulesGridFilter__field RulesGridFilter__select"
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              label={I18n.t(filterLabels.country)}
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
              name="language"
              className="RulesGridFilter__field RulesGridFilter__select"
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              label={I18n.t(filterLabels.language)}
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {getAvailableLanguages().map((locale: string) => (
                <option key={locale} value={locale}>
                  {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                </option>
              ))}
            </Field>

            <If condition={!!partners && type !== 'PARTNER'}>
              <Field
                name="affiliateId"
                className="RulesGridFilter__field RulesGridFilter__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('RULES.FILTERS.PARTNER')}
                component={FormikSelectField}
                disabled={partners?.length === 0}
                withAnyOption
                searchable
                withFocus
              >
                {partners?.map(({ uuid, fullName }) => (
                  <option key={uuid} value={uuid}>
                    {fullName ? I18n.t(fullName) : ''}
                  </option>
                ))}
              </Field>
            </If>

            <If condition={!!operators && type !== 'OPERATOR'}>
              <Field
                name="operatorUuids"
                className="RulesGridFilter__field RulesGridFilter__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('RULES.FILTERS.OPERATORS')}
                component={FormikSelectField}
                disabled={operators?.length === 0}
                searchable
                withFocus
                multiple
              >
                {operators?.map(({ uuid, fullName, operatorStatus }) => (
                  <option
                    key={uuid}
                    value={uuid}
                    className={classNames('RulesGridFilter__select-option', {
                      'RulesGridFilter__select-option--inactive': operatorStatus !== operatorsStasuses.ACTIVE,
                    })}
                  >
                    {fullName ? I18n.t(fullName) : ''}
                  </option>
                ))}
              </Field>
            </If>
          </div>

          <div className="RulesGridFilter__buttons">
            <If condition={!!handleRefetch}>
              <RefreshButton
                className="RulesGridFilter__button"
                onClick={handleRefetch}
              />
            </If>

            <Button
              primary
              className="RulesGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              primary
              type="submit"
              className="RulesGridFilter__button"
              disabled={isSubmitting || !dirty}
            >
              {I18n.t('COMMON.APPLY')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(RulesGridFilter);
