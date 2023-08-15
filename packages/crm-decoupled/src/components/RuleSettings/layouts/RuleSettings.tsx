import React from 'react';
import I18n from 'i18n-js';
import { Field } from 'formik';
import { Config, Utils, Constants } from '@crm/common';
import {
  FormikMultipleSelectField,
  FormikSingleSelectField,
  FormikInputField,
  FormikMultiInputField,
} from 'components';
import { Operator, Partner, RuleOperatorSpread__Input as RuleOperatorSpread } from '__generated__/types';
import RuleOperatorSpreads from 'components/RuleOperatorSpreads';
import useRuleSettings, { FormikBag } from 'components/RuleSettings/hooks/useRuleSettings';
import './RuleSettings.scss';

type Props = {
  operators: Array<Operator>,
  partners: Array<Partner>,
  operatorSpreads: Array<RuleOperatorSpread>,
  formikBag: FormikBag,
};

const RuleSettings = (props: Props) => {
  const {
    operators,
    partners,
    operatorSpreads,
    formikBag: {
      isSubmitting,
      setFieldValue,
      errors,
    },
  } = props;

  const { removeOperatorSpread } = useRuleSettings({
    operatorSpreads,
    formikBag: {
      isSubmitting,
      setFieldValue,
      errors,
    },
  });

  return (
    <div className="RuleSettings">
      <If condition={!!errors.submit}>
        <div className="RuleSettings__message-error">
          {errors.submit}
        </div>
      </If>

      <Field
        name="name"
        data-testid="RuleSettings-nameInput"
        label={I18n.t(Constants.ruleAttributeLabels.name)}
        placeholder={I18n.t(Constants.ruleAttributeLabels.name)}
        disabled={isSubmitting}
        component={FormikInputField}
      />

      <div className="RuleSettings__spread">
        <Field
          name="priority"
          data-testid="RuleSettings-prioritySelect"
          label={I18n.t(Constants.ruleAttributeLabels.priority)}
          component={FormikSingleSelectField}
          disabled={isSubmitting}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          options={Constants.priorities.map(item => ({
            label: item,
            value: item,
          }))}
        />

        <Field
          name="type"
          data-testid="RuleSettings-typeSelect"
          label={I18n.t(Constants.ruleAttributeLabels.type)}
          component={FormikSingleSelectField}
          disabled={isSubmitting}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          options={Constants.ruleTypes.map(({ label, value }) => ({
            label: I18n.t(label),
            value,
          }))}
        />
      </div>

      <Field
        searchable
        name="countries"
        data-testid="RuleSettings-countriesSelect"
        label={I18n.t(Constants.ruleAttributeLabels.country)}
        component={FormikMultipleSelectField}
        disabled={isSubmitting}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        options={Object.entries(Utils.countryList).map(([key, value]) => ({
          label: value,
          value: key,
        }))}
      />

      <Field
        name="languages"
        data-testid="RuleSettings-languagesSelect"
        label={I18n.t(Constants.ruleAttributeLabels.language)}
        component={FormikMultipleSelectField}
        disabled={isSubmitting}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        options={Config.getAvailableLanguages().map(locale => ({
          label: I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() }),
          value: locale,
        }))}
      />

      <Field
        searchable
        name="affiliateUUIDs"
        data-testid="RuleSettings-affiliateUUIDsSelect"
        label={I18n.t(Constants.ruleAttributeLabels.partner)}
        component={FormikMultipleSelectField}
        disabled={isSubmitting || partners.length === 0}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        options={partners.slice().map(({ fullName, uuid }) => ({
          label: fullName,
          value: uuid,
        }))}
      />

      <Field
        name="sources"
        data-testid="RuleSettings-sourcesMultiInput"
        label={I18n.t(Constants.ruleAttributeLabels.source)}
        placeholder={I18n.t(Constants.ruleAttributeLabels.source)}
        component={FormikMultiInputField}
      />

      <If condition={!!operatorSpreads}>
        <RuleOperatorSpreads
          operators={operators}
          operatorSpreads={operatorSpreads}
          removeOperatorSpread={removeOperatorSpread}
          namePrefix="operatorSpreads"
          disabled={isSubmitting}
          validationError={errors.operatorSpreads as string}
        />
      </If>
    </div>
  );
};

export default React.memo(RuleSettings);
