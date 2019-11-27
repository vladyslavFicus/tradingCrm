import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import Select from 'components/Select';
import { InputField, NasSelectField } from 'components/ReduxForm';
import { createValidator, translateLabels } from 'utils/validator';
import attributeLabels from './constants';

const FORM_NAME = 'deskModalForm';

class DeskForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.any,
    offices: PropTypes.arrayOf(PropTypes.branchHierarchyType).isRequired,
    desks: PropTypes.arrayOf(PropTypes.branchHierarchyType).isRequired,
  };

  static defaultProps = {
    error: null,
  };

  state = {
    selectedOffice: '',
    desks: [],
  };

  handleOfficeChange = (selectedOffice) => {
    const { desks: allDesks } = this.props;
    const desks = allDesks
      .filter(({ parentBranch }) => parentBranch && parentBranch.uuid === selectedOffice);

    this.setState({
      selectedOffice,
      desks,
    });
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
      offices,
    } = this.props;

    const { selectedOffice, desks } = this.state;

    const deskPlaceholder = desks.length === 0
      ? I18n.t('TEAMS.MODAL.NO_OFFICE_DESK')
      : I18n.t('COMMON.SELECT_OPTION.DEFAULT');

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('TEAMS.MODAL.HEADER')}
        </ModalHeader>
        <ModalBody
          tag="form"
          id="teams-modal-form"
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
          <span className="font-weight-600">{I18n.t(attributeLabels.office)}</span>
          <Select
            value={selectedOffice}
            customClassName="form-group"
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            disabled={submitting}
            onChange={this.handleOfficeChange}
          >
            {offices.map(({ name, uuid }) => (
              <option key={uuid} value={uuid}>
                {name}
              </option>
            ))}
          </Select>
          <Field
            name="deskId"
            label={I18n.t(attributeLabels.desk)}
            component={NasSelectField}
            disabled={!selectedOffice || submitting || desks.length === 0}
            placeholder={selectedOffice
              ? deskPlaceholder
              : I18n.t('TEAMS.MODAL.SELECT_OFFICE_FIRST')
            }
          >
            {desks.map(({ name, uuid }) => (
              <option key={uuid} value={uuid}>
                {name}
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
            form="teams-modal-form"
          >
            {I18n.t('TEAMS.MODAL.CREATE_BUTTON')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

const DeskModal = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: createValidator({
    name: ['required', 'string'],
    officeId: ['required', 'string'],
    deskId: ['required', 'string'],
  }, translateLabels(attributeLabels), false),
})(DeskForm);

export default DeskModal;
