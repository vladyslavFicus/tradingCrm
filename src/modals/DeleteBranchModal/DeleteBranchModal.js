import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests, parseErrors } from 'apollo';
import PropTypes from 'constants/propTypes';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/UI';
import DeleteBranchMutation from './graphql/DeleteBranchMutation';
import './DeleteBranchModal.scss';

class DeleteBranchModal extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    deleteBranch: PropTypes.func.isRequired,
  };

  state = {
    isSubmitting: false,
    errors: null,
  };

  handleClose = () => {
    const { onCloseModal } = this.props;

    onCloseModal();
  }

  handleSubmit = async () => {
    const { uuid, name, onSuccess, deleteBranch } = this.props;
    const { isSubmitting } = this.state;

    if (!isSubmitting) {
      try {
        this.setState({ isSubmitting: true, errors: null });

        await deleteBranch({ variables: { uuid } });

        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('MODALS.DELETE_BRANCH_MODAL.SUCCESS', { name }),
        });

        this.handleClose();

        onSuccess();
      } catch (e) {
        const error = parseErrors(e);

        this.setState({ errors: error.errorParameters });
      }

      this.setState({ isSubmitting: false });
    }
  }

  render() {
    const {
      name,
      isOpen,
    } = this.props;

    const { isSubmitting, errors } = this.state;

    return (
      <Modal className="DeleteBranchModal" isOpen={isOpen} toggle={this.handleClose}>
        <ModalHeader toggle={this.handleClose}>{I18n.t('MODALS.DELETE_BRANCH_MODAL.TITLE')}</ModalHeader>
        <ModalBody>
          <div className="DeleteBranchModal__row DeleteBranchModal__action-text">
            {I18n.t('MODALS.DELETE_BRANCH_MODAL.DESCRIPTION', { name })}
          </div>
          <If condition={errors}>
            <div className="DeleteBranchModal__errors">
              <div>{I18n.t('MODALS.DELETE_BRANCH_MODAL.ERRORS.COMMON', { name })}</div>
              <ul className="DeleteBranchModal__errors-list">
                <If condition={errors.subbranches > 0}>
                  <li>
                    {I18n.t(`MODALS.DELETE_BRANCH_MODAL.ERRORS.${errors.subbranches > 1 ? 'SUBBRANCHES' : 'SUBBRANCH'}`,
                      { count: errors.subbranches })}
                  </li>
                </If>
                <If condition={errors.operators > 0}>
                  <li>
                    {I18n.t(`MODALS.DELETE_BRANCH_MODAL.ERRORS.${errors.operators > 1 ? 'OPERATORS' : 'OPERATOR'}`,
                      { count: errors.operators })}
                  </li>
                </If>
                <If condition={errors.rules > 0}>
                  <li>
                    {I18n.t(`MODALS.DELETE_BRANCH_MODAL.ERRORS.${errors.rules > 1 ? 'RULES' : 'RULE'}`,
                      { count: errors.rules })}
                  </li>
                </If>
              </ul>
            </div>
          </If>
        </ModalBody>

        <ModalFooter>
          <Button
            tertiary
            onClick={this.handleClose}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </Button>
          <Button
            type="submit"
            danger
            disabled={isSubmitting || errors}
            onClick={this.handleSubmit}
          >
            {I18n.t('COMMON.BUTTONS.DELETE')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default compose(
  withRequests({
    deleteBranch: DeleteBranchMutation,
  }),
)(DeleteBranchModal);
