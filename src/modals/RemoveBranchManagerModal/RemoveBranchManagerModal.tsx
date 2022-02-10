import React from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { parseErrors } from 'apollo';
import { ModalHeader, ModalBody, ModalFooter, Modal } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { withNotifications } from 'hoc';
import { LevelType, Notify } from 'types';
import { Button } from 'components/UI';
import { FormikSelectField } from 'components/Formik';
import { createValidator, translateLabels } from 'utils/validator';
import { useRemoveBranchManagerMutation } from './graphql/__generated__/removeBranchManagerMutation';
import './RemoveBranchManagerModal.scss';

const attributeLabels = {
  uuid: 'COMMON.OPERATOR',
};

type Operator = {
  uuid: string,
  fullName?: string,
  operatorStatus?: string,
}
type Branch = {
  uuid: string,
}

type Props = {
  operators: [Operator],
  isOpen: boolean,
  onCloseModal: () => void,
  title: string,
  description: string,
  notify: Notify,
  branch: Branch,
  onSuccess: () => void,
}

const RemoveBranchManagerModal = (props: Props) => {
  const { isOpen, onCloseModal, title, description, operators = [] } = props;
  const [removeBranchManager] = useRemoveBranchManagerMutation();

  const handleSubmit = ({ uuid: managerUuid }: Operator) => {
    const {
      notify,
      onSuccess,
      branch: {
        uuid: branchUuid,
      },
    } = props;

    try {
      removeBranchManager({ variables: { branchUuid, managerUuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.NOTIFICATIONS.SUCCEED.TITLE'),
        message: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.NOTIFICATIONS.SUCCEED.DESC'),
      });

      onCloseModal();
      onSuccess();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.NOTIFICATION.FAILED.TITLE'),
        message: error.error === 'error.branch.manager.addition'
          ? I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.NOTIFICATION.FAILED.ADDITION_FAILED')
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onCloseModal}
    >
      <Formik
        initialValues={{ uuid: '' }}
        validate={createValidator({
          uuid: ['required', 'string'],
        }, translateLabels(attributeLabels), false)}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader className="RemoveBranchManagerModal__header" toggle={onCloseModal}>{title}</ModalHeader>
            <ModalBody>
              <div className="RemoveBranchManagerModal__description">
                {description}
              </div>
              <Field
                name="uuid"
                className="RemoveBranchManagerModal__select"
                label={I18n.t('COMMON.CHOOSE_OPERATOR')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                disabled={isSubmitting || operators.length === 0}
                searchable
              >
                {operators.map(({ uuid, fullName }) => (
                  <option key={uuid} value={uuid}>
                    {fullName}
                  </option>
                ))}
              </Field>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={onCloseModal}
                commonOutline
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                danger
              >
                {I18n.t('COMMON.BUTTONS.CONFIRM')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default compose(
  React.memo,
  withNotifications,
  withRouter,
)(RemoveBranchManagerModal);
