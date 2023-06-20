import React, { useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import { FormikSelectField } from 'components/Formik';
import { createValidator, translateLabels } from 'utils/validator';
import { HierarchyBranchUser } from '__generated__/types';
import { useBranchUsersQuery } from './graphql/__generated__/BranchUsersQuery';
import { useAddBranchManagerMutation } from './graphql/__generated__/AddBranchManagerMutation';
import './AddBranchManagerModal.scss';

const attributeLabels = {
  operatorUuid: 'COMMON.OPERATOR',
};

type FormValues = {
  operatorUuid: string,
};

type Branch= {
  uuid: string,
  branchType: string,
  name: string,
};

export type Props = {
  title: string,
  description: string,
  branch: Branch,
  managers: Array<string | null>,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const AddBranchManagerModal = (props: Props) => {
  const {
    title,
    description,
    managers = [],
    branch: {
      uuid: branchUuid,
      name: branchName,
      branchType,
    },
    onSuccess,
    onCloseModal,
  } = props;

  const { data, loading } = useBranchUsersQuery({
    variables: { branchUuid },
    fetchPolicy: 'network-only',
  });
  const branchUsers = data?.branchUsers || [];

  const [addBranchManagerMutation] = useAddBranchManagerMutation();

  const operators = useMemo(() => (branchUsers as Array<HierarchyBranchUser>)
    .filter(({ uuid, operator }) => operator?.operatorStatus === 'ACTIVE' && !managers?.includes(uuid))
    .sort((a, b) => `${a.operator?.firstName} ${a.operator?.lastName}`
      .localeCompare(`${b.operator?.firstName} ${b.operator?.lastName}`)), [branchUsers]);

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setSubmitting(false);

    try {
      await addBranchManagerMutation({ variables: { branchUuid, ...values } });

      const { operatorUuid } = values;

      const selectedOperator = operators?.filter(({ uuid }) => uuid === operatorUuid)[0];
      const operatorName = selectedOperator?.operator?.fullName;

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.NOTIFICATION.SUCCEED.TITLE'),
        message: I18n.t(
          'MODALS.ADD_BRANCH_MANAGER_MODAL.NOTIFICATION.SUCCEED.DESC',
          { operatorName, branchType: I18n.t(`COMMON.${branchType}`), branchName },
        ),
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
      isOpen
      toggle={onCloseModal}
    >
      <Formik
        initialValues={{ operatorUuid: '' } as FormValues}
        validate={createValidator({
          operatorUuid: ['required', 'string'],
        }, translateLabels(attributeLabels), false)}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>{title}</ModalHeader>

            <ModalBody>
              <If condition={!!description}>
                <div className="AddBranchManagerModal__description">
                  {description}
                </div>
              </If>

              <If condition={!operators.length && !loading}>
                <div className="AddBranchManagerModal__warning">
                  {I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.NO_OPERATORS_WARNING')}
                </div>
              </If>

              <Field
                name="operatorUuid"
                className="AddBranchManagerModal__select"
                data-testid="AddBranchManagerModal-operatorUuidSelect"
                label={I18n.t('COMMON.CHOOSE_OPERATOR')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                disabled={loading || isSubmitting || !operators.length}
                searchable
              >
                {operators.map(({ uuid, operator }: HierarchyBranchUser) => (
                  <option key={uuid} value={uuid} disabled={operator?.operatorStatus !== 'ACTIVE'}>
                    {operator?.fullName}
                  </option>
                ))}
              </Field>
            </ModalBody>

            <ModalFooter>
              <Button
                data-testid="AddBranchManagerModal-cancelButton"
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                data-testid="AddBranchManagerModal-confirmButton"
                type="submit"
                disabled={isSubmitting}
                primary
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

export default React.memo(AddBranchManagerModal);
