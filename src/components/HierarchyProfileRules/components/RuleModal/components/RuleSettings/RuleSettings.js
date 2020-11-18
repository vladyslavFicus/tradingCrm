import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Field } from 'formik';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { ruleTypes, priorities } from 'constants/rules';
import countryList from 'utils/countryList';
import {
  FormikInputField,
  FormikSelectField,
  FormikMultiInputField,
} from 'components/Formik';
import RuleOperatorSpreads from '../RuleOperatorSpreads';
import { attributeLabels } from '../../constants';
import './RuleSettings.scss';

class RuleSettings extends PureComponent {
  static propTypes = {
    operators: PropTypes.arrayOf(PropTypes.operatorsListEntity).isRequired,
    partners: PropTypes.arrayOf(PropTypes.partnersListEntity).isRequired,
    withOperatorSpreads: PropTypes.bool,
    operatorSpreads: PropTypes.array,
    isSubmitting: PropTypes.bool.isRequired,
    errors: PropTypes.object.isRequired,
  };

  static defaultProps = {
    withOperatorSpreads: false,
    operatorSpreads: [],
  };

  render() {
    const {
      operators,
      partners,
      withOperatorSpreads,
      operatorSpreads,
      isSubmitting,
      errors,
    } = this.props;

    return (
      <div className="RuleSettings">
        <If condition={errors.submit}>
          <div className="mb-2 text-center color-danger RuleSettings__message-error">
            {errors.submit}
          </div>
        </If>
        <Field
          name="name"
          label={I18n.t(attributeLabels.name)}
          placeholder={I18n.t(attributeLabels.name)}
          disabled={isSubmitting}
          component={FormikInputField}
        />
        <div className="row">
          <Field
            name="priority"
            label={I18n.t(attributeLabels.priority)}
            component={FormikSelectField}
            disabled={isSubmitting}
            className="col-6"
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          >
            {priorities.map(item => (
              <option key={item} value={item}>
                {item.toString()}
              </option>
            ))}
          </Field>
          <Field
            name="type"
            label={I18n.t(attributeLabels.type)}
            component={FormikSelectField}
            disabled={isSubmitting}
            className="col-6"
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
          label={I18n.t(attributeLabels.partner)}
          component={FormikSelectField}
          disabled={isSubmitting || partners.length === 0}
          multiple
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
          searchable
        >
          {partners.sort((a, b) => a.fullName.localeCompare(b.fullName)).map(partner => (
            <option key={partner.uuid} value={partner.uuid}>
              {partner.fullName}
            </option>
          ))}
        </Field>
        <Field
          name="sources"
          label={I18n.t(attributeLabels.source)}
          placeholder={I18n.t(attributeLabels.source)}
          component={FormikMultiInputField}
        />
        <If condition={withOperatorSpreads}>
          <RuleOperatorSpreads
            operators={operators}
            operatorSpreads={operatorSpreads}
            isSubmitting={isSubmitting}
            percentageLimitError={errors.percentageLimitError}
          />
        </If>
      </div>
    );
  }
}

export default RuleSettings;
