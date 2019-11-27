import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import I18n from 'i18n-js';
import PropTypes from '../../../../../../constants/propTypes';
import { createValidator, translateLabels } from '../../../../../../utils/validator';
import { InputField, NasSelectField } from '../../../../../../components/ReduxForm';
import languages from '../../../../../../constants/languageNames';
import { deskModalAttributeLabels, deskTypes } from '../constants';

const FORM_NAME = 'deskModalForm';

const DeskForm = ({
  handleSubmit,
  onCloseModal,
  isOpen,
  invalid,
  pristine,
  submitting,
  onSubmit,
  error,
  offices,
}) => (
  <Modal
    toggle={onCloseModal}
    isOpen={isOpen}
  >
    <ModalHeader toggle={onCloseModal}>
      {I18n.t('DESKS.MODAL.HEADER')}
    </ModalHeader>
    <ModalBody
      tag="form"
      id="desks-modal-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <If condition={error}>
        <div className="mb-2 text-center color-danger">
          {error}
        </div>
      </If>
      <div className="row">
        <Field
          name="name"
          type="text"
          className="col-8"
          label={I18n.t(deskModalAttributeLabels.name)}
          disabled={submitting}
          component={InputField}
        />
        <Field
          name="deskType"
          className="col-4"
          label={I18n.t(deskModalAttributeLabels.deskType)}
          component={NasSelectField}
          disabled={submitting}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        >
          {deskTypes.map(({ label, value }) => (
            <option key={value} value={value}>
              {I18n.t(label)}
            </option>
          ))}
        </Field>
      </div>
      <Field
        name="officeId"
        label={I18n.t(deskModalAttributeLabels.office)}
        component={NasSelectField}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        disabled={submitting || offices.length === 0}
      >
        {offices.map(({ name, uuid }) => (
          <option key={uuid} value={uuid}>
            {name}
          </option>
        ))}
      </Field>
      <Field
        name="language"
        label={I18n.t(deskModalAttributeLabels.language)}
        component={NasSelectField}
        disabled={submitting}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
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
        form="desks-modal-form"
      >
        {I18n.t('DESKS.MODAL.CREATE_BUTTON')}
      </button>
    </ModalFooter>
  </Modal>
);

DeskForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.any,
  offices: PropTypes.arrayOf(PropTypes.branchHierarchyType).isRequired,
};

DeskForm.defaultProps = {
  error: null,
};

const DeskModal = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: createValidator({
    name: ['required', 'string'],
    officeId: ['required', 'string'],
    language: ['required', 'string'],
    deskType: ['required', 'string'],
  }, translateLabels(deskModalAttributeLabels), false),
})(DeskForm);

export default DeskModal;
