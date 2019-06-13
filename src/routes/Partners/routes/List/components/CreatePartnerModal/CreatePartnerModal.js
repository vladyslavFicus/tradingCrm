import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { getActiveBrandConfig } from 'config';
import Select from 'components/Select';
import CheckBox from 'components/ReduxForm/CheckBox';
import reduxFieldsConstructor from 'components/ReduxForm/ReduxFieldsConstructor';
import { generate } from 'utils/password';
import { branchField, formFields } from './constants';

class CreatePartnerModal extends Component {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    change: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
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
    change: null,
  };

  state = {
    selectedBranchType: '',
    branches: null,
  };

  handleGeneratePassword = () => {
    this.props.change('password', generate());
  };

  handleSelectChange = async (selectedBranchType) => {
    const { branchHierarchy, change } = this.props;
    const branches = branchHierarchy[selectedBranchType].map(({ uuid, name }) => ({ value: uuid, label: name }));

    change('branch', null);

    this.setState({
      selectedBranchType,
      branches,
    });
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      valid,
      onCloseModal,
      isOpen,
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
        <ModalHeader toggle={onCloseModal}>{I18n.t('PARTNERS.NEW_PARTNER')}</ModalHeader>
        <ModalBody id="create-operator-modal-form" tag="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {reduxFieldsConstructor(
              formFields(this.handleGeneratePassword),
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
          <If condition={getActiveBrandConfig().regulation.isActive}>
            <div className="row">
              <div className="form-group col-md-6">
                <Field
                  className="d-inline-block"
                  name="isIB"
                  component={CheckBox}
                  type="checkbox"
                  label="Is IB?"
                />
              </div>
            </div>
          </If>
        </ModalBody>
        <ModalFooter>
          <div className="row">
            <div className="col-5 text-muted font-size-12 text-left">
              <b>{I18n.t('OPERATORS.MODALS.NEW_OPERATOR.NOTE')}</b>
              {':'}
              {I18n.t('OPERATORS.MODALS.NEW_OPERATOR.NOTE_MESSAGE')}
            </div>
            <div className="col-7">
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

export default CreatePartnerModal;
