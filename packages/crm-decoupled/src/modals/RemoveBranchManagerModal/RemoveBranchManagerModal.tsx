import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikSelectField } from 'components/Formik';
import { createValidator, translateLabels } from 'utils/validator';
import Modal from 'components/Modal';
import { useRemoveBranchManagerMutation } from './graphql/__generated__/removeBranchManagerMutation';
import './RemoveBranchManagerModal.scss';

const attributeLabels = {
  uuid: 'COMMON.OPERATOR',
};

type Operator = {
  uuid: string,
  fullName: string | null,
  operatorStatus: string | null,
};

type Branch = {
  uuid: string,
};

type FormValues = {
  uuid: string,
  fullName?: string,
  operatorStatus?: string,
};

export type Props = {
  operators: Array<Operator>,
  branch: Branch,
  title: string,
  description: string,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const RemoveBranchManagerModal = (props: Props) => {
  const { operators = [], branch, title, description, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [removeBranchManager] = useRemoveBranchManagerMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    try {
      await removeBranchManager({ variables: { branchUuid: branch.uuid, managerUuid: values.uuid } });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.NOTIFICATIONS.SUCCEED.TITLE'),
        message: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.NOTIFICATIONS.SUCCEED.DESC'),
      });
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
    <Formik
      initialValues={{ uuid: '' }}
      validate={createValidator({
        uuid: ['required', 'string'],
      }, translateLabels(attributeLabels), false)}
      onSubmit={handleSubmit}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ isSubmitting, submitForm }) => (
        <Modal
          warning
          onCloseModal={onCloseModal}
          title={title}
          styleButton="danger"
          disabled={isSubmitting}
          buttonTitle={I18n.t('COMMON.BUTTONS.CONFIRM')}
          clickSubmit={submitForm}
        >
          <Form>
            <div className="RemoveBranchManagerModal__description">
              {description}
            </div>

            <Field
              name="uuid"
              className="RemoveBranchManagerModal__select"
              data-testid="RemoveBranchManagerModal-uuidSelect"
              label={I18n.t('COMMON.CHOOSE_OPERATOR')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              component={FormikSelectField}
              disabled={isSubmitting || operators?.length === 0}
              searchable
            >
              {operators?.map(({ uuid, fullName }) => (
                <option key={uuid} value={uuid}>
                  {fullName}
                </option>
              ))}
            </Field>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(RemoveBranchManagerModal);
