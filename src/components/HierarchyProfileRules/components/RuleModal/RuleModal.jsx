import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import I18n from 'i18n-js';
import PropTypes from '../../../../constants/propTypes';
import { createValidator, translateLabels } from '../../../../utils/validator';
import countryList from '../../../../utils/countryList';
import languages from '../../../../constants/languageNames';
import {
  ruleTypes,
  priorities,
  clientDistribution,
  depositCount,
  deskTypes,
} from '../../../../constants/rules';
import { InputField, MultiInputField, NasSelectField, RangeGroup } from '../../../ReduxForm';
import attributeLabels from './constants';

const FORM_NAME = 'ruleModalForm';

class RuleModal extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.any,
    deskType: PropTypes.string.isRequired,
    partners: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: null,
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      invalid,
      pristine,
      submitting,
      onSubmit,
      error,
      deskType,
      partners,
    } = this.props;

    const partnersList = get(partners, 'partners.data.content', []);

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.HEADER')}
        </ModalHeader>
        <ModalBody
          tag="form"
          id="offices-modal-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <If condition={error}>
            <div className="mb-2 text-center color-danger sales-rules-modal-error">
              {error}
            </div>
          </If>
          <Field
            name="name"
            type="text"
            label={I18n.t(attributeLabels.name)}
            disabled={submitting}
            component={InputField}
          />
          <div className="row">
            <Field
              name="priority"
              label={I18n.t(attributeLabels.priority)}
              component={NasSelectField}
              disabled={submitting}
              className="col-6"
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            >
              {priorities.map(item => (
                <option key={item} value={item}>
                  {item.toString()}
                </option>
              ))}
            </Field>
            <Choose>
              <When condition={deskType === deskTypes.RETENTION}>
                <Field
                  name="depositCount"
                  label={I18n.t(attributeLabels.depositCount)}
                  component={NasSelectField}
                  disabled={submitting}
                  className="col-6"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                >
                  {depositCount.map(item => (
                    <option key={item} value={item}>
                      {item.toString()}
                    </option>
                  ))}
                </Field>
                <RangeGroup
                  className="col-6"
                  label={I18n.t(attributeLabels.amount)}
                >
                  <Field
                    name="depositAmountFrom"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    component={InputField}
                  />
                  <Field
                    name="depositAmountTo"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    component={InputField}
                  />
                </RangeGroup>
                <Field
                  name="ruleType"
                  label={I18n.t(attributeLabels.distribution)}
                  component={NasSelectField}
                  disabled={submitting}
                  className="col-6"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                >
                  {clientDistribution.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {I18n.t(label)}
                    </option>
                  ))}
                </Field>
              </When>
              <Otherwise>
                <Field
                  name="type"
                  label={I18n.t(attributeLabels.type)}
                  component={NasSelectField}
                  disabled={submitting}
                  className="col-6"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                >
                  {ruleTypes.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {I18n.t(label)}
                    </option>
                  ))}
                </Field>
              </Otherwise>
            </Choose>
          </div>
          <Field
            name="countries"
            label={I18n.t(attributeLabels.country)}
            component={NasSelectField}
            disabled={submitting}
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
            component={NasSelectField}
            disabled={submitting}
            multiple
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
          >
            {languages.map(({ languageName, languageCode }) => (
              <option key={languageCode} value={languageCode}>
                {I18n.t(languageName)}
              </option>
            ))}
          </Field>
          <If condition={deskType === deskTypes.SALES}>
            <Field
              name="affiliateUUIDs"
              label={I18n.t(attributeLabels.partner)}
              component={NasSelectField}
              disabled={submitting || partnersList.length === 0}
              multiple
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
            >
              {partnersList.map(partner => (
                <option key={partner.uuid} value={partner.uuid}>
                  {partner.fullName}
                </option>
              ))}
            </Field>
            <Field
              name="sources"
              type="text"
              label={I18n.t(attributeLabels.source)}
              placeholder={I18n.t(attributeLabels.source)}
              component={MultiInputField}
            />
          </If>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            disabled={invalid || pristine || submitting}
            className="btn btn-primary"
            form="offices-modal-form"
          >
            {I18n.t('HIERARCHY.PROFILE_RULE_TAB.MODAL.CREATE_BUTTON')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: createValidator({
    name: ['required', 'string'],
    priority: ['required', `in:,${priorities.join()}`],
    countries: [`in:,${Object.keys(countryList).join()}`],
    languages: [`in:,${languages.map(({ languageCode }) => languageCode).join()}`],
    type: ['required', `in:,${ruleTypes.map(({ value }) => value).join()}`],
  }, translateLabels(attributeLabels), false),
})(RuleModal);
