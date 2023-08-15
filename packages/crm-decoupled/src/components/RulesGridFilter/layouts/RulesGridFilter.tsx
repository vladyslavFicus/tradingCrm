import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import { Config, Utils, Constants } from '@crm/common';
import {
  Button,
  RefreshButton,
  FormikSingleSelectField,
  FormikMultipleSelectField,
  FormikInputField,
} from 'components';
import { Operator, Partner } from '__generated__/types';
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
              label={I18n.t(Constants.User.filterLabels.searchValue)}
              addition={<i className="icon icon-search" />}
              component={FormikInputField}
              withFocus
            />

            <Field
              withAnyOption
              searchable
              withFocus
              name="country"
              className="RulesGridFilter__field RulesGridFilter__select"
              data-testid="RulesGridFilter-countrySelect"
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              label={I18n.t(Constants.User.filterLabels.country)}
              component={FormikSingleSelectField}
              options={[
                { label: I18n.t('COMMON.OTHER'), value: 'UNDEFINED' },
                ...Object.keys(Utils.countryList).map(country => ({
                  label: Utils.countryList[country],
                  value: country,
                })),
              ]}
            />

            <Field
              withAnyOption
              searchable
              withFocus
              name="language"
              className="RulesGridFilter__field RulesGridFilter__select"
              data-testid="RulesGridFilter-languageSelect"
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              label={I18n.t(Constants.User.filterLabels.language)}
              component={FormikSingleSelectField}
              options={Config.getAvailableLanguages().map((locale: string) => ({
                label: I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() }),
                value: locale,
              }))}
            />

            <If condition={!!partners && type !== 'PARTNER'}>
              <Field
                withAnyOption
                searchable
                withFocus
                name="affiliateId"
                className="RulesGridFilter__field RulesGridFilter__select"
                data-testid="RulesGridFilter-affiliateIdSelect"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('RULES.FILTERS.PARTNER')}
                component={FormikSingleSelectField}
                disabled={partners?.length === 0}
                options={partners?.map(({ uuid, fullName }) => ({
                  label: fullName ? I18n.t(fullName) : '',
                  value: uuid,
                }))}
              />
            </If>

            <If condition={!!operators && type !== 'OPERATOR'}>
              <Field
                searchable
                withFocus
                name="operatorUuids"
                className="RulesGridFilter__field RulesGridFilter__select"
                data-testid="RulesGridFilter-operatorUuidsSelect"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('RULES.FILTERS.OPERATORS')}
                component={FormikMultipleSelectField}
                disabled={operators?.length === 0}
                options={operators?.map(({ uuid, fullName, operatorStatus }) => ({
                  label: fullName ? I18n.t(fullName) : '',
                  value: uuid,
                  className: classNames('RulesGridFilter__select-option', {
                    'RulesGridFilter__select-option--inactive': operatorStatus !== Constants.Operator.statuses.ACTIVE,
                  }),
                }))}
              />
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
