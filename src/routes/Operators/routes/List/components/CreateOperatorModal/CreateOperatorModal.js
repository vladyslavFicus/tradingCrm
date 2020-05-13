import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import Select from 'components/Select';
import { generate } from 'utils/password';
import reduxFieldsConstructor from 'components/ReduxForm/ReduxFieldsConstructor';
import { branchField, formFields, fieldNames } from './constants';

class CreateOperatorModal extends Component {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    change: PropTypes.func,
    departmentsRoles: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    formValues: PropTypes.shape({
      department: PropTypes.string,
      role: PropTypes.string,
    }),
    branchHierarchy: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      teams: PropTypes.array,
      desks: PropTypes.array,
      offices: PropTypes.array,
      brands: PropTypes.array,
      branchTypes: PropTypes.array,
    }).isRequired,
  };

  static defaultProps = {
    pristine: false,
    submitting: false,
    valid: false,
    formValues: {},
    change: null,
  };

  state = {
    selectedBranchType: '',
    branches: null,
  };

  handleGeneratePassword = () => {
    this.props.change('password', generate());
  };

  handleSelectFieldChange = fieldName => (value) => {
    const { change, departmentsRoles } = this.props;

    if (fieldName === fieldNames.department) {
      const roles = departmentsRoles[value];

      if (roles.length > 0) {
        change(fieldNames.role, roles[0]);
      }
    }

    change(fieldName, value);
  }

  handleSelectChange = async (selectedBranchType) => {
    const { branchHierarchy, change } = this.props;
    const branches = branchHierarchy[selectedBranchType].map(({ uuid, name }) => ({ value: uuid, label: name }));

    change('branch', null);

    this.setState({
      selectedBranchType,
      branches,
    });
  }

  render() {
    const {
      handleSubmit,
      onSubmit,
      departmentsRoles,
      pristine,
      submitting,
      valid,
      onCloseModal,
      isOpen,
      formValues,
      branchHierarchy: {
        loading,
        branchTypes,
      },
    } = this.props;

    const {
      selectedBranchType,
      branches,
    } = this.state;

    return (
      <Modal className="create-operator-modal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('OPERATORS.MODALS.NEW_OPERATOR.TITLE')}</ModalHeader>
        <ModalBody id="create-operator-modal-form" tag="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {reduxFieldsConstructor(
              formFields({
                departmentsLabels,
                departmentsRoles,
                rolesLabels,
                formValues,
              }, this.handleGeneratePassword),
              this.handleSelectFieldChange,
            )}
            <div className="form-group col-md-6">
              <label>{I18n.t('COMMON.BRANCH_TYPE')}</label>
              <Select
                value={selectedBranchType}
                placeholder={loading ? I18n.t('COMMON.SELECT_OPTION.LOADING') : I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                disabled={loading}
                onChange={this.handleSelectChange}
              >
                {branchTypes.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Select>
            </div>
            {reduxFieldsConstructor([
              branchField(
                selectedBranchType,
                branches,
              )])}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="row">
            <div className="col-5 text-muted font-size-12 text-left">
              <b>{I18n.t('OPERATORS.MODALS.NEW_OPERATOR.NOTE')}</b>:
              {I18n.t('OPERATORS.MODALS.NEW_OPERATOR.NOTE_MESSAGE')}
            </div>
            <div className="col-7 text-right">
              <button
                type="button"
                className="btn btn-default-outline"
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </button>
              <button
                type="submit"
                disabled={pristine || submitting || !valid}
                className="btn btn-primary ml-2"
                id="create-new-operator-submit-button"
                form="create-operator-modal-form"
              >
                {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CreateOperatorModal;
