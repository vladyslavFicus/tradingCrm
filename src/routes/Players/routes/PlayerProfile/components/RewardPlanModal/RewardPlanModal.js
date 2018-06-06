import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { createValidator, translateLabels } from '../../../../../../utils/validator';
import PropTypes from '../../../../../../constants/propTypes';
import { InputField } from '../../../../../../components/ReduxForm';
import { attributeLabels } from './constants';

class RewardPlanModal extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    invalid: PropTypes.bool,
    modalStaticData: PropTypes.shape({
      title: PropTypes.string.isRequired,
      inputLabel: PropTypes.string.isRequired,
      actionText: PropTypes.string.isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    submitting: false,
    pristine: false,
    invalid: true,
  };

  render() {
    const {
      onSubmit,
      isOpen,
      handleSubmit,
      onCloseModal,
      submitting,
      pristine,
      invalid,
      modalStaticData: {
        title,
        inputLabel,
        actionText,
      },
    } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={onCloseModal} className="modal-danger">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onCloseModal}>{I18n.t(title)}</ModalHeader>
          <ModalBody>
            <div className="text-center font-weight-700">
              <div className="margin-bottom-10">{I18n.t(actionText)}</div>
            </div>
            <Field
              name="amount"
              className="col-md-6"
              type="text"
              label={I18n.t(inputLabel)}
              component={InputField}
              position="vertical"
            />
            <Field
              name="isActive"
              hidden="hidden"
              type="text"
              component="input"
            />
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              onClick={onCloseModal}
              className="btn btn-default-outline mr-auto"
            >
              {I18n.t('COMMON.CANCEL')}
            </button>
            <button
              disabled={submitting || pristine || invalid}
              type="submit"
              className="btn btn-primary"
            >
              {I18n.t('COMMON.SUBMIT')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'updateRewardPlanAmountModal',
  enableReinitialize: true,
  validate: createValidator({
    amount: ['required', 'numeric'],
    isActive: ['required', 'boolean'],
  }, translateLabels(attributeLabels), false),
})(RewardPlanModal);
