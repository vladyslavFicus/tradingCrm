import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Config, Utils, notify, Types, Constants } from '@crm/common';
import { FormikSelectField } from 'components/Formik';
import Modal from 'components/Modal';
import Badge from 'components/Badge';
import { useUpdateLeverageMutation } from './graphql/__generated__/UpdateLeverageMutation';
import './UpdateLeverageModal.scss';

type FormValue = {
 leverage: number,
};

export type Props = {
  login: string | number,
  accountUUID: string,
  accountType?: string,
  name?: string,
  group?: string,
  platformType?: string,
  archived?: boolean,
  leverage?: number,
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
    leverage = 0,
    onCloseModal,
    onSuccess,
    accountUUID,
  } = props;

  const brand = Config.getBrand();

  const [updateLeverageMutation] = useUpdateLeverageMutation();

  const onSubmit = async (values: FormValue) => {
    try {
      await updateLeverageMutation({ variables: { accountUUID, leverage: values.leverage } });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.TITLE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.LEVERAGE_CHANGED'),
      });

      onSuccess();
      onCloseModal();
    } catch {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Formik
      initialValues={{ leverage }}
      onSubmit={onSubmit}
    >
      {({ dirty, isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
          buttonTitle={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
          disabled={!dirty || isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <div className="UpdateLeverageModal__title">
              {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.TRADING_ACCOUNT')}
            </div>

            <Badge
              text={I18n.t(archived ? 'CONSTANTS.ARCHIVED' : Constants.accountTypesLabels[accountType].label)}
              info={accountType === 'DEMO' && !archived}
              success={accountType === 'LIVE' && !archived}
              danger={archived}
            >
              <div className="UpdateLeverageModal__account-name">
                {name}
              </div>
            </Badge>

            <div className="UpdateLeverageModal__account-details">
              {Utils.getPlatformTypeLabel(platformType)} ID - {login}
            </div>

            <div className="UpdateLeverageModal__account-details">
              {group}
            </div>

            <p className="UpdateLeverageModal__message">
              {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.MESSAGE')}
            </p>

            <Field
              name="leverage"
              data-testid="UpdateLeverageModal-leverageSelect"
              label={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
              placeholder={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_LEVERAGE.FORM.CHANGE_LEVERAGE')}
              component={FormikSelectField}
            >
              {brand[platformType.toLowerCase()].leveragesChangingRequest
                .filter((item: number) => leverage !== item)
                .map((value: number) => (
                  <option key={value} value={value}>1:{value}</option>
                ))}
            </Field>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateLeverageModal);
