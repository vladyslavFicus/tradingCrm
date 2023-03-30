import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { useHistory } from 'react-router-dom';
import compose from 'compose-function';
import { generate } from 'utils/password';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { useModal } from 'providers/ModalProvider';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { Notify, LevelType } from 'types/notify';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { passwordMaxSize, passwordPattern } from '../../constants';
import { useOperatorAccessDataQuery } from './graphql/__generated__/OperatorAccessDataQuery';
import { useCreateOperatorMutation } from './graphql/__generated__/CreateOperatorMutation';
import './NewOperatorModal.scss';

type Props = {
  notify: Notify,
  onCloseModal: () => void,
  onSuccess: () => void,
}

type FormValues = {
  firstName: string,
  lastName: string,
  password: string,
  role: string,
  email: string,
  phone: string,
  groupNames: string[],
}

const attributeLabels = {
  firstName: 'COMMON.FIRST_NAME',
  lastName: 'COMMON.LAST_NAME',
  email: 'COMMON.EMAIL',
  phone: 'COMMON.PHONE',
  role: 'COMMON.ROLE',
  password: 'COMMON.PASSWORD',
  groups: 'TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.GROUPS',
};

const validate = createValidator(
  {
    firstName: ['required', 'string', 'min:2'],
    lastName: ['required', 'string', 'min:2'],
    email: ['required', 'email'],
    password: ['required', `regex:${passwordPattern}`, `max:${passwordMaxSize}`],
    phone: 'min:3',
    role: 'required',
  },
  translateLabels(attributeLabels),
  false,
  {
    'regex.password': I18n.t('COMMON.OPERATOR_PASSWORD_INVALID'),
  },
);

const NewOperatorModal = (props: Props) => {
  const { onCloseModal, onSuccess, notify } = props;
  const groupsQuery = useOperatorAccessDataQuery();
  const [createOperatorMutation] = useCreateOperatorMutation();
  const history = useHistory();

  const rolesOptions = groupsQuery.data?.tradingEngine.operatorAccessData.writeableRoles || [];
  const accessibleGroupNames = groupsQuery.data?.tradingEngine.operatorAccessData.accessibleGroupNames || [];

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const handleSubmit = async (values: FormValues, helpers: FormikHelpers<any>, existsInCrm = false) => {
    try {
      const result = await createOperatorMutation({ variables: { args: { ...values, existsInCrm } } });
      const uuid = result.data?.tradingEngine.createOperator.uuid;

      if (values.groupNames.length > 0) {
        history.push(`/trading-engine/operators/${uuid}/profile`);
      }

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.TITLE'),
        message: I18n.t('TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.NOTIFICATION.SUCCESS'),
      });

      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.external-api.error.validation.email.exists') {
        confirmActionModal.show({
          onSubmit: () => handleSubmit(values, helpers, true),
          modalTitle: I18n.t('TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.CONFIRMATION.TITLE'),
          actionText: I18n.t('TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.CONFIRMATION.DESCRIPTION'),
          submitButtonLabel: I18n.t('COMMON.OK'),
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.TITLE'),
          message: error.error === 'error.operator.already.exists'
            ? I18n.t('TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.NOTIFICATION.FAILED_EXIST')
            : I18n.t('TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.NOTIFICATION.FAILED'),
        });
      }
    }
  };

  return (
    <Modal className="NewOperatorModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          password: '',
          role: '',
          email: '',
          phone: '',
          groupNames: [],
        }}
        validate={validate}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.TITLE')}
            </ModalHeader>

            <Form>
              <ModalBody>
                <Field
                  name="firstName"
                  className="NewOperatorModal__field"
                  label={I18n.t(attributeLabels.firstName)}
                  placeholder={I18n.t(attributeLabels.firstName)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="lastName"
                  className="NewOperatorModal__field"
                  label={I18n.t(attributeLabels.lastName)}
                  placeholder={I18n.t(attributeLabels.lastName)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="email"
                  className="NewOperatorModal__field"
                  label={I18n.t(attributeLabels.email)}
                  placeholder={I18n.t(attributeLabels.email)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="password"
                  className="NewOperatorModal__field"
                  label={I18n.t(attributeLabels.password)}
                  placeholder={I18n.t(attributeLabels.password)}
                  addition={<span className="icon-generate-password" />}
                  onAdditionClick={() => setFieldValue('password', generate())}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="phone"
                  className="NewOperatorModal__field"
                  label={I18n.t(attributeLabels.phone)}
                  placeholder={I18n.t(attributeLabels.phone)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="role"
                  className="NewOperatorModal__field"
                  label={I18n.t(attributeLabels.role)}
                  placeholder={
                    rolesOptions.length
                      ? I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                      : I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                  }
                  component={FormikSelectField}
                  disabled={isSubmitting || !rolesOptions.length}
                  searchable
                >
                  {rolesOptions.map(role => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Field>
                <Field
                  name="groupNames"
                  className="NewOperatorModal__wide_field"
                  label={I18n.t(attributeLabels.groups)}
                  placeholder={
                    rolesOptions.length
                      ? I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                      : I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                  }
                  component={FormikSelectField}
                  disabled={isSubmitting || !rolesOptions.length}
                  searchable
                  multiple
                  multipleLabel
                >
                  {accessibleGroupNames.map(group => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </Field>
              </ModalBody>
              <ModalFooter>
                <If condition={!values.groupNames?.length}>
                  <div className="NewOperatorModal__note">
                    <b>{I18n.t('TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.NOTE')}</b>
                    {': '}
                    {I18n.t('TRADING_ENGINE.MODALS.NEW_OPERATOR_MODAL.NOTE_MESSAGE')}
                  </div>
                </If>
                <div className="NewOperatorModal__buttons">
                  <Button
                    onClick={onCloseModal}
                    className="NewOperatorModal__button"
                    tertiary
                  >
                    {I18n.t('COMMON.BUTTONS.CANCEL')}
                  </Button>

                  <Button
                    className="NewOperatorModal__button"
                    primary
                    disabled={isSubmitting}
                    type="submit"
                  >
                    <Choose>
                      <When condition={!values.groupNames?.length}>
                        {I18n.t('COMMON.BUTTONS.CREATE')}
                      </When>
                      <Otherwise>
                        {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
                      </Otherwise>
                    </Choose>
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(NewOperatorModal);
