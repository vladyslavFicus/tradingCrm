import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import countryList from '../../../../../../../../utils/countryList';
import { InputField, NasSelectField } from '../../../../../../../../components/ReduxForm';
import languages from '../../../../../../../../constants/languageNames';
import { ruleTypes, priorities } from '../../../../../../../../constants/rules';
import attributeLabels from './constants';

const FORM_NAME = 'ruleModalForm';

const ModalForm = ({
  handleSubmit,
  onCloseModal,
  isOpen,
  invalid,
  pristine,
  submitting,
  onSubmit,
  error,
}) => (
  <Modal
    toggle={onCloseModal}
    isOpen={isOpen}
  >
    <ModalHeader toggle={onCloseModal}>
      {I18n.t('OFFICES.TABS.RULES.MODAL.HEADER')}
    </ModalHeader>
    <ModalBody
      tag="form"
      id="offices-modal-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <If condition={error}>
        <div className="mb-2 text-center color-danger">
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
        {I18n.t('OFFICES.TABS.RULES.MODAL.CREATE_BUTTON')}
      </button>
    </ModalFooter>
  </Modal>
);

ModalForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.any,
};

ModalForm.defaultProps = {
  error: null,
};

const RuleModal = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: createValidator({
    name: ['required', 'string'],
    priority: ['required', `in:,${priorities.join()}`],
    countries: ['required', `in:,${Object.keys(countryList).join()}`],
    languages: ['required', `in:,${languages.map(({ languageCode }) => languageCode).join()}`],
    type: ['required', `in:,${ruleTypes.map(({ value }) => value).join()}`],
  }, translateLabels(attributeLabels), false),
})(ModalForm);

export default RuleModal;
