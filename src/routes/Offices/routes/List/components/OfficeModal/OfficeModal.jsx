import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import { createValidator, translateLabels } from '../../../../../../utils/validator';
import countryList from '../../../../../../utils/countryList';
import { InputField, NasSelectField } from '../../../../../../components/ReduxForm';
import attributeLabels from './constants';

const FORM_NAME = 'officeModalForm';

const OfficeForm = ({
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
      {I18n.t('OFFICES.MODAL.HEADER')}
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
      <Field
        name="country"
        label={I18n.t(attributeLabels.country)}
        component={NasSelectField}
        disabled={submitting}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
      >
        {Object.entries(countryList).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
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
        {I18n.t('OFFICES.MODAL.CREATE_BUTTON')}
      </button>
    </ModalFooter>
  </Modal>
);

OfficeForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.any,
};

OfficeForm.defaultProps = {
  error: null,
};

const OfficeModal = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: createValidator({
    name: ['required', 'string'],
    country: ['required', 'string'],
  }, translateLabels(attributeLabels), false),
})(OfficeForm);

export default OfficeModal;
