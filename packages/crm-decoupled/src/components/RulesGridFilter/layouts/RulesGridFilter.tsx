import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import { getAvailableLanguages } from 'config';
import { filterLabels } from 'constants/user';
import { statuses as operatorsStatuses } from 'constants/operators';
import { Operator, Partner } from '__generated__/types';
import countryList from 'utils/countryList';
import { Button, RefreshButton } from 'components/Buttons';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import useRulesGridFilter from '../hooks/useRulesGridFilter';
import './RulesGridFilter.scss';

type Props = {
  partners?: Array<Partner>,
  operators?: Array<Operator>,
  type?: string,
  handleRefetch?: () => void,
};

const RulesGridFilter = (props: Props) => {
  const {
    type,
    partners,
    operators,
    handleRefetch,
  } = props;

  const { initialValues, handleReset, handleSubmit, validate } = useRulesGridFilter();

  return (
    <Formik
      className="RulesGridFilter"
      initialValues={initialValues}
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
              data-testid="RulesGridFilter-createdByOrUuidInput"
              placeholder={I18n.t('RULES.FILTERS.RULE')}
              label={I18n.t(filterLabels.searchValue)}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              name="country"
              className="RulesGridFilter__field RulesGridFilter__select"
              data-testid="RulesGridFilter-countrySelect"
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
              data-testid="RulesGridFilter-languageSelect"
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
                data-testid="RulesGridFilter-affiliateIdSelect"
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
                data-testid="RulesGridFilter-operatorUuidsSelect"
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
                      'RulesGridFilter__select-option--inactive': operatorStatus !== operatorsStatuses.ACTIVE,
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
                data-testid="RulesGridFilter-refreshButton"
                onClick={handleRefetch}
              />
            </If>

            <Button
              primary
              className="RulesGridFilter__button"
              data-testid="RulesGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              primary
              type="submit"
              className="RulesGridFilter__button"
              data-testid="RulesGridFilter-applyButton"
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
