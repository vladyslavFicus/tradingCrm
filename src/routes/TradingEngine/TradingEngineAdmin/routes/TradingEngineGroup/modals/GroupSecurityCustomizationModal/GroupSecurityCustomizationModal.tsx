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
import { Button } from 'components/UI';
import {
  GroupSecurity, SpreadDiff, LotMin, LotMax, LotStep,
  GroupCommissionType, GroupCommissionLots,
} from '../../types';
import './GroupSecurityCustomizationModal.scss';

interface Props {
  groupSecurity: GroupSecurity,
  notify: Notify,
  isOpen: boolean,
  onCloseModal: () => void,
  onSuccess: (modifiedSecurity: GroupSecurity) => void,
}

const validate = createValidator(
  {
    commissionBase: ['required', 'numeric', 'min:-100000', 'max:100000'],
  },
  {
    commissionBase: I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.STANDART'),
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
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting }) => (
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
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.SPRED_DIFFERENCE')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikSelectField}
                >
                  {enumToArray(SpreadDiff).map(key => (
                    <option key={SpreadDiff[key]} value={SpreadDiff[key]}>
                      {SpreadDiff[key]}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="GroupSecurityCustomizationModal__title">
                {I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOTS')}
              </div>

              <div className="GroupSecurityCustomizationModal__fields">
                <Field
                  name="lotMin"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_MIN')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikSelectField}
                >
                  {enumToArray(LotMin).map(key => (
                    <option key={LotMin[key]} value={LotMin[key]}>
                      {LotMin[key]}
                    </option>
                  ))}
                </Field>
                <Field
                  name="lotMax"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_MAX')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikSelectField}
                >
                  {enumToArray(LotMax).map(key => (
                    <option key={LotMax[key]} value={LotMax[key]}>
                      {LotMax[key]}
                    </option>
                  ))}
                </Field>
                <Field
                  name="lotStep"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_CUSTOMIZATION_SECURITY_MODAL.LOT_STEP')}
                  className="GroupSecurityCustomizationModal__field"
                  component={FormikSelectField}
                >
                  {enumToArray(LotStep).map(key => (
                    <option key={LotStep[key]} value={LotStep[key]}>
                      {LotStep[key]}
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
                  digitsAfterDot={2}
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
                commonOutline
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>
              <Button
                type="submit"
                disabled={!dirty || isSubmitting}
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
