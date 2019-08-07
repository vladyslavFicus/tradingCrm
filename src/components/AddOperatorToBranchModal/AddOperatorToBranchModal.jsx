import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import reduxFieldsConstructor from '../ReduxForm/ReduxFieldsConstructor';
import { formFields } from './formFields';

class AddOperatorToBranchModal extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.any,
    operators: PropTypes.shape({
      operators: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    renderTopContent: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    branch: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      branchType: PropTypes.string.isRequired,
    }).isRequired,
    onSuccess: PropTypes.func,
  };

  static defaultProps = {
    error: null,
    renderTopContent: null,
    onSuccess: () => {},
  };

  handleSubmit = async ({ operatorId }) => {
    const {
      branch: { uuid: branchId, name: branchName, branchType },
      addOperatorToBranch,
      notify,
      operators: { operators: { data: { content } } },
      onCloseModal,
      onSuccess,
    } = this.props;

    const {
      data: {
        hierarchy: {
          addOperatorToBranch: {
            error,
          },
        },
      },
    } = await addOperatorToBranch({ variables: { branchId, operatorId } });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('MODALS.ADD_OPERATOR_TO_BRANCH.NOTIFICATION.FAILED.OPERATOR_ADDED'),
        message: error.error || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    } else {
      const { fullName } = content.find(({ uuid }) => uuid === operatorId) || { fullName: '' };

      notify({
        level: 'success',
        title: I18n.t('MODALS.ADD_OPERATOR_TO_BRANCH.NOTIFICATION.SUCCEED.OPERATOR_ADDED'),
        message: I18n.t(
          'MODALS.ADD_OPERATOR_TO_BRANCH.NOTIFICATION.SUCCEED.OPERATOR_ADDED_DESC',
          { operator: fullName, branchType: I18n.t(`COMMON.${branchType}`), branchName },
        ),
      });
      onCloseModal();
      onSuccess();
    }
  }

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      invalid,
      pristine,
      submitting,
      error,
      renderTopContent,
      operators: {
        loading,
        operators,
      },
    } = this.props;

    const hierarchyOperators = get(operators, 'data.content') || [];
    const requestError = get(operators, 'error');

    const disabled = requestError || loading;

    return (
      <Modal className="modal-primary" toggle={onCloseModal} isOpen={isOpen}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalHeader toggle={onCloseModal}>
            {I18n.t('MODALS.ADD_OPERATOR_TO_BRANCH.TITLE')}
          </ModalHeader>
          <ModalBody>
            <If condition={error || requestError}>
              <div className="mb-2 text-center color-danger">
                {error || requestError}
              </div>
            </If>
            <If condition={renderTopContent}>
              <Choose>
                <When condition={typeof renderTopContent === 'function'}>
                  {renderTopContent()}
                </When>
                <Otherwise>
                  {renderTopContent}
                </Otherwise>
              </Choose>
            </If>
            {reduxFieldsConstructor(formFields(disabled, hierarchyOperators))}
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
              className="btn btn-danger"
              disabled={pristine || invalid || submitting || disabled}
              type="submit"
            >
              {I18n.t('COMMON.BUTTONS.CONFIRM')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default AddOperatorToBranchModal;
