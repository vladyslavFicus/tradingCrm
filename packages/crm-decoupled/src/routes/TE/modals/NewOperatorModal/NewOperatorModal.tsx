import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Utils, parseErrors, useModal, notify, Types } from '@crm/common';
import {
  Button,
  FormikSingleSelectField,
  FormikMultipleSelectField,
  FormikInputField,
} from 'components';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { passwordMaxSize, passwordPattern } from '../../constants';
import { useOperatorAccessDataQuery } from './graphql/__generated__/OperatorAccessDataQuery';
import { useCreateOperatorMutation } from './graphql/__generated__/CreateOperatorMutation';
import './NewOperatorModal.scss';

export type Props = {
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

const validate = Utils.createValidator(
  {
    firstName: ['required', 'string', 'min:2'],
    lastName: ['required', 'string', 'min:2'],
    email: ['required', 'email'],
    password: ['required', `regex:${passwordPattern}`, `max:${passwordMaxSize}`],
    phone: 'min:3',
    role: 'required',
  },
  Utils.translateLabels(attributeLabels),
  false,
  {
    'regex.password': I18n.t('COMMON.OPERATOR_PASSWORD_INVALID'),
  },
);

const NewOperatorModal = (props: Props) => {
  const { onCloseModal, onSuccess } = props;
  const groupsQuery = useOperatorAccessDataQuery();
  const [createOperatorMutation] = useCreateOperatorMutation();
  const navigate = useNavigate();

  const rolesOptions = groupsQuery.data?.tradingEngine.operatorAccessData.writeableRoles || [];
  const accessibleGroupNames = groupsQuery.data?.tradingEngine.operatorAccessData.accessibleGroupNames || [];

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const handleSubmit = async (values: FormValues, helpers: FormikHelpers<any>, existsInCrm = false) => {
    try {
      const result = await createOperatorMutation({ variables: { args: { ...values, existsInCrm } } });
      const uuid = result.data?.tradingEngine.createOperator.uuid;

      if (values.groupNames.length > 0) {
        navigate(`/trading-engine/operators/${uuid}`);
      }

      onSuccess();
      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
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
          level: Types.LevelType.ERROR,
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
                  onAdditionClick={() => setFieldValue('password', Utils.generate())}
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
                  searchable
                  name="role"
                  className="NewOperatorModal__field"
                  label={I18n.t(attributeLabels.role)}
                  placeholder={
                    rolesOptions.length
                      ? I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                      : I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                  }
                  component={FormikSingleSelectField}
                  disabled={isSubmitting || !rolesOptions.length}
                  options={rolesOptions.map(role => ({
                    label: role,
                    value: role,
                  }))}
                />
                <Field
                  searchable
                  multipleLabel
                  name="groupNames"
                  className="NewOperatorModal__wide_field"
                  label={I18n.t(attributeLabels.groups)}
                  placeholder={
                    rolesOptions.length
                      ? I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                      : I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                  }
                  component={FormikMultipleSelectField}
                  disabled={isSubmitting || !rolesOptions.length}
                  options={accessibleGroupNames.map(group => ({
                    label: group,
                    value: group,
                  }))}
                />
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

export default React.memo(NewOperatorModal);
