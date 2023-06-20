import React from 'react';
import I18n from 'i18n-js';
import { Field, FormikErrors, FormikValues } from 'formik';
import { getAvailableLanguages } from 'config';
import { Operator, Partner, RuleOperatorSpread__Input as RuleOperatorSpread } from '__generated__/types';
import { SetFieldValue } from 'types/formik';
import { ruleTypes, priorities } from 'constants/rules';
import { attributeLabels } from 'constants/ruleModal';
import countryList from 'utils/countryList';
import { FormikInputField, FormikSelectField, FormikMultiInputField } from 'components/Formik';
import RuleOperatorSpreads from 'components/RuleOperatorSpreads';
import './RuleSettings.scss';

type FormikBag = {
  isSubmitting: boolean,
  errors: FormikErrors<FormikValues>,
  setFieldValue: SetFieldValue<FormikValues>,
};

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
      errors,
      setFieldValue,
    },
  } = props;

  const removeOperatorSpread = (index: number) => {
    const newOperatorSpreads = [...operatorSpreads];

    newOperatorSpreads.splice(index, 1);
    setFieldValue('operatorSpreads', newOperatorSpreads);
  };

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
        label={I18n.t(attributeLabels.name)}
        placeholder={I18n.t(attributeLabels.name)}
        disabled={isSubmitting}
        component={FormikInputField}
      />

      <div className="RuleSettings__spread">
        <Field
          name="priority"
          data-testid="RuleSettings-prioritySelect"
          label={I18n.t(attributeLabels.priority)}
          component={FormikSelectField}
          disabled={isSubmitting}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        >
          {priorities.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Field>

        <Field
          name="type"
          data-testid="RuleSettings-typeSelect"
          label={I18n.t(attributeLabels.type)}
          component={FormikSelectField}
          disabled={isSubmitting}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        >
          {ruleTypes.map(({ label, value }) => (
            <option key={value} value={value}>
              {I18n.t(label)}
            </option>
          ))}
        </Field>
      </div>

      <Field
        name="countries"
        data-testid="RuleSettings-countriesSelect"
        label={I18n.t(attributeLabels.country)}
        component={FormikSelectField}
        disabled={isSubmitting}
        searchable
        multiple
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
      >
        {Object.entries(countryList).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </Field>

      <Field
        name="languages"
        data-testid="RuleSettings-languagesSelect"
        label={I18n.t(attributeLabels.language)}
        component={FormikSelectField}
        disabled={isSubmitting}
        multiple
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
      >
        {getAvailableLanguages().map(locale => (
          <option key={locale} value={locale}>
            {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
          </option>
        ))}
      </Field>

      <Field
        name="affiliateUUIDs"
        data-testid="RuleSettings-affiliateUUIDsSelect"
        label={I18n.t(attributeLabels.partner)}
        component={FormikSelectField}
        disabled={isSubmitting || partners.length === 0}
        multiple
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
        searchable
      >
        {partners.slice().map(partner => (
          <option key={partner.uuid} value={partner.uuid}>
            {partner.fullName}
          </option>
        ))}
      </Field>

      <Field
        name="sources"
        data-testid="RuleSettings-sourcesMultiInput"
        label={I18n.t(attributeLabels.source)}
        placeholder={I18n.t(attributeLabels.source)}
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
