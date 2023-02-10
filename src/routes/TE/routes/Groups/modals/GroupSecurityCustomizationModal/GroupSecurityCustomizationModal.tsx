import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { LevelType, Notify } from 'types/notify';
import { withNotifications } from 'hoc';
import enumToArray from 'utils/enumToArray';
import { createValidator } from 'utils/validator';
import { FormikInputField, FormikSelectField, FormikCheckbox } from 'components/Formik';
import { Button } from 'components/Buttons';
import {
  Commission__Type__Enum as GroupCommissionType,
  Commission__Lots__Enum as GroupCommissionLots,
} from '__generated__/types';
import {
  GroupSecurity, LotMin, LotMax, LotStep,
} from '../../types';
import './GroupSecurityCustomizationModal.scss';

type Props = {
  groupSecurity: GroupSecurity,
  notify: Notify,
  isOpen: boolean,
  onCloseModal: () => void,
  onSuccess: (modifiedSecurity: GroupSecurity) => void,
}

const validate = createValidator(
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
  isOpen,
  notify,
  onCloseModal,
  onSuccess,
}: Props) => {
  const handleSubmit = (modifiedSecurity: GroupSecurity) => {
    notify({
      level: LevelType.SUCCESS,
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
      isOpen={isOpen}
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
                label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.ENABLE')}
                className="GroupSecurityCustomizationModal__field"
                component={FormikCheckbox}
              />

              <div className="GroupSecurityCustomizationModal__fields">
                <Field
                  name="spreadDiff"
                  type="number"
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
                label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.DEFAULT')}
                className="GroupSecurityCustomizationModal__field"
                component={FormikCheckbox}
              />
              <div className="GroupSecurityCustomizationModal__fields">
                <Field
                  name="lotMin"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_MIN')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikSelectField}
                  disabled={values.defaultLots}
                >
                  {enumToArray(LotMin).map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Field>
                <Field
                  name="lotMax"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_MAX')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikSelectField}
                  disabled={values.defaultLots}
                >
                  {enumToArray(LotMax).map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Field>
                <Field
                  name="lotStep"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_STEP')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikSelectField}
                  disabled={values.defaultLots}
                >
                  {enumToArray(LotStep).map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="GroupSecurityCustomizationModal__title">
                {I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.COMMISSIONS')}
              </div>

              <div className="GroupSecurityCustomizationModal__fields">
                <Field
                  name="commissionBase"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.STANDART')}
                  className="GroupSecurityCustomizationModal__field--small"
                  classNameError="GroupSecurityCustomizationModal__field--errorMessage"
                  component={FormikInputField}
                  type="number"
                />
                <Field
                  name="commissionType"
                  className="GroupSecurityCustomizationModal__field--small"
                  component={FormikSelectField}
                >
                  {Object.keys(GroupCommissionType).map(key => (
                    <option key={key} value={key}>
                      {I18n.t(`TRADING_ENGINE.GROUP.${key}`)}
                    </option>
                  ))}
                </Field>
                <Field
                  name="commissionLots"
                  className="GroupSecurityCustomizationModal__field--small"
                  component={FormikSelectField}
                >
                  {Object.keys(GroupCommissionLots).map(key => (
                    <option key={key} value={key}>
                      {I18n.t(`TRADING_ENGINE.GROUP.PER_${key}`)}
                    </option>
                  ))}
                </Field>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>
              <Button
                type="submit"
                disabled={!dirty || isSubmitting || !isValid}
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

export default compose(
  React.memo,
  withNotifications,
)(GroupSecurityCustomizationModal);
