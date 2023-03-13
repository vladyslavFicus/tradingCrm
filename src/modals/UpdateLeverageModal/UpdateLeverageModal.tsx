import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { getBrand } from 'config';
import { notify, LevelType } from 'providers/NotificationProvider';
import { getPlatformTypeLabel } from 'utils/tradingAccount';
import { accountTypesLabels } from 'constants/accountTypes';
import { Button } from 'components/Buttons';
import Badge from 'components/Badge';
import { FormikSelectField } from 'components/Formik';
import { useUpdateLeverageMutation } from './graphql/__generated__/UpdateLeverageMutation';
import './UpdateLeverageModal.scss';

type FormValue = {
 leverage: string | number,
};

type Props = {
  login: string | number,
  accountUUID: string,
  accountType?: string,
  name?: string,
  group?: string,
  platformType?: string,
  archived?: boolean,
  leverage?: string,
  onCloseModal: () => void,
  onSuccess: () => void,
};

const UpdateLeverageModal = (props: Props) => {
  const {
    login,
    accountType = '',
    name = '',
    group = '',
    archived,
    platformType = '',
    leverage = '',
    onCloseModal,
    onSuccess,
    accountUUID,
  } = props;

  const brand = getBrand();

  const [updateLeverageMutation] = useUpdateLeverageMutation();

  const onSubmit = async ({ leverage: newLeverage }: FormValue) => {
    try {
      await updateLeverageMutation({
        variables: {
          accountUUID,
          leverage: newLeverage as number,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.TITLE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.LEVERAGE_CHANGED'),
      });

      onSuccess();
      onCloseModal();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal className="UpdateLeverageModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{ leverage: '' } as FormValue}
        onSubmit={onSubmit}
      >
        {({ dirty, isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
            </ModalHeader>

            <ModalBody>
              <div className="UpdateLeverageModal__title">
                {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.TRADING_ACCOUNT')}
              </div>

              <Badge
                text={I18n.t(archived ? 'CONSTANTS.ARCHIVED' : accountTypesLabels[accountType].label)}
                info={accountType === 'DEMO' && !archived}
                success={accountType === 'LIVE' && !archived}
                danger={archived}
              >
                <div className="UpdateLeverageModal__account-name">
                  {name}
                </div>
              </Badge>

              <div className="UpdateLeverageModal__account-details">
                {getPlatformTypeLabel(platformType)} ID - {login}
              </div>

              <div className="UpdateLeverageModal__account-details">
                {group}
              </div>

              <p className="UpdateLeverageModal__message">
                {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.MESSAGE')}
              </p>

              <Field
                name="leverage"
                label={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
                placeholder={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
                component={FormikSelectField}
              >
                {brand[platformType.toLowerCase()].leveragesChangingRequest
                  .filter((item: string) => leverage !== item)
                  .map((value: string) => (
                    <option key={value} value={value}>1:{value}</option>
                  ))}
              </Field>
            </ModalBody>

            <ModalFooter>
              <div className="UpdateLeverageModal__buttons">
                <Button
                  className="UpdateLeverageModal__button"
                  onClick={onCloseModal}
                  tertiary
                >
                  {I18n.t('COMMON.CANCEL')}
                </Button>

                <Button
                  className="UpdateLeverageModal__button"
                  disabled={!dirty || isSubmitting}
                  type="submit"
                  primary
                >
                  {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
                </Button>
              </div>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(UpdateLeverageModal);
