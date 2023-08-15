import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { Utils, notify, Types } from '@crm/common';
import { Button, FormikSingleSelectField, FormikInputField, FormikCheckbox } from 'components';
import {
  Commission__Type__Enum as GroupCommissionType,
  Commission__Lots__Enum as GroupCommissionLots,
} from '__generated__/types';
import {
  GroupSecurity, LotMin, LotMax, LotStep,
} from '../../types';
import './GroupSecurityCustomizationModal.scss';

export type Props = {
  groupSecurity: GroupSecurity,
  onCloseModal: () => void,
  onSuccess: (modifiedSecurity: GroupSecurity) => void,
}

const validate = Utils.createValidator(
  {
    spreadDiff: ['required', 'integer', 'min:0', 'max:100000'],
    commissionBase: ['required', 'numeric', 'min:-100000', 'max:100000'],
    lotMin: ['lessOrSame:lotMax'],
    lotStep: ['lessOrSame:lotMin'],
    lotMax: ['greaterOrSame:lotMin'],
  },
  {
    spreadDiff: I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.SPREAD_DIFFERENCE'),
    commissionBase: I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.STANDART'),
    lotMin: I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_MIN'),
    lotStep: I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_STEP'),
    lotMax: I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_MAX'),
  },
  false,
);

const GroupSecurityCustomizationModal = ({
  groupSecurity,
  onCloseModal,
  onSuccess,
}: Props) => {
  const handleSubmit = (modifiedSecurity: GroupSecurity) => {
    notify({
      level: Types.LevelType.SUCCESS,
      title: I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.TITLE'),
      message: I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.NOTIFICATION.SUCCESS'),
    });
    onSuccess(modifiedSecurity);
    onCloseModal();
  };

  return (
    <Modal
      className="GroupSecurityCustomizationModal"
      toggle={onCloseModal}
    >
      <Formik
        initialValues={groupSecurity}
        validate={validate}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, isValid, values }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.TITLE')}
            </ModalHeader>

            <div className="GroupSecurityCustomizationModal__description">
              {I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.DESCRIPTION')}
            </div>

            <ModalBody>
              <Field
                name="show"
                data-testid="GroupSecurityCustomizationModal-showCheckbox"
                label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.ENABLE')}
                className="GroupSecurityCustomizationModal__field"
                component={FormikCheckbox}
              />

              <div className="GroupSecurityCustomizationModal__fields">
                <Field
                  name="spreadDiff"
                  type="number"
                  data-testid="GroupSecurityCustomizationModal-spreadDiffInput"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.SPREAD_DIFFERENCE')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikInputField}
                />
              </div>

              <div className="GroupSecurityCustomizationModal__title">
                {I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOTS')}
              </div>

              <Field
                name="defaultLots"
                data-testid="GroupSecurityCustomizationModal-defaultLotsCheckbox"
                label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.DEFAULT')}
                className="GroupSecurityCustomizationModal__field"
                component={FormikCheckbox}
              />
              <div className="GroupSecurityCustomizationModal__fields">
                <Field
                  name="lotMin"
                  data-testid="GroupSecurityCustomizationModal-lotMinSelect"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_MIN')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikSingleSelectField}
                  disabled={values.defaultLots}
                  options={Utils.enumToArray(LotMin).map(value => ({
                    label: value,
                    value,
                  }))}
                />
                <Field
                  name="lotMax"
                  data-testid="GroupSecurityCustomizationModal-lotMaxSelect"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_MAX')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikSingleSelectField}
                  disabled={values.defaultLots}
                  options={Utils.enumToArray(LotMax).map(value => ({
                    label: value,
                    value,
                  }))}
                />
                <Field
                  name="lotStep"
                  data-testid="GroupSecurityCustomizationModal-lotStepSelect"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_STEP')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikSingleSelectField}
                  disabled={values.defaultLots}
                  options={Utils.enumToArray(LotStep).map(value => ({
                    label: value,
                    value,
                  }))}
                />
              </div>

              <div className="GroupSecurityCustomizationModal__title">
                {I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.COMMISSIONS')}
              </div>

              <div className="GroupSecurityCustomizationModal__fields">
                <Field
                  name="commissionBase"
                  data-testid="GroupSecurityCustomizationModal-commissionBaseInput"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.STANDART')}
                  className="GroupSecurityCustomizationModal__field--small"
                  classNameError="GroupSecurityCustomizationModal__field--errorMessage"
                  component={FormikInputField}
                  type="number"
                />
                <Field
                  name="commissionType"
                  data-testid="GroupSecurityCustomizationModal-commissionTypeSelect"
                  className="GroupSecurityCustomizationModal__field--small"
                  component={FormikSingleSelectField}
                  options={Object.keys(GroupCommissionType).map(key => ({
                    label: I18n.t(`TRADING_ENGINE.GROUP.${key}`),
                    value: key,
                  }))}
                />
                <Field
                  name="commissionLots"
                  data-testid="GroupSecurityCustomizationModal-commissionLotsSelect"
                  className="GroupSecurityCustomizationModal__field--small"
                  component={FormikSingleSelectField}
                  options={Object.keys(GroupCommissionLots).map(key => ({
                    label: I18n.t(`TRADING_ENGINE.GROUP.PER_${key}`),
                    value: key,
                  }))}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                data-testid="GroupSecurityCustomizationModal-cancelButton"
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>
              <Button
                type="submit"
                disabled={!dirty || isSubmitting || !isValid}
                data-testid="GroupSecurityCustomizationModal-saveButton"
                primary
              >
                {I18n.t('COMMON.SAVE')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(GroupSecurityCustomizationModal);
