import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { LevelType, Notify } from 'types';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { FormikInputField, FormikSelectField, FormikCheckbox } from 'components/Formik';
import { Button } from 'components/UI';
import { GroupSecurity } from '../../types';
import { COMMISION_TYPES, COMMISION_LOTS, SPRED_DIFFERANCE, LOT_MIN, LOT_MAX, LOT_STEP } from '../../constants';
import './GropuSecurityCustomizationModal.scss';

interface Props {
  security: GroupSecurity,
  notify: Notify,
  isOpen: boolean,
  onCloseModal: () => void,
  onSuccess: (modifiedSecurities: GroupSecurity) => void,
}

const GropuSecurityCustomizationModal = ({
  security,
  isOpen,
  notify,
  onCloseModal,
  onSuccess,
}: Props) => {
  const handleSubmit = (modifiedSecurities: GroupSecurity) => {
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.TITLE'),
      message: I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.NOTIFICATION.SUCCESS'),
    });
    onSuccess(modifiedSecurities);
    onCloseModal();
  };

  return (
    <Modal
      className="GropuSecurityCustomizationModal"
      toggle={onCloseModal}
      isOpen={isOpen}
      keyboard={false}
    >
      <Formik
        initialValues={security}
        validate={createValidator(
          {
            commissionBase: ['required', 'numeric', 'min:-100000', 'max:100000'],
          },
          {
            commissionBase: I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.STANDART'),
          },
          false,
        )}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.TITLE')}
            </ModalHeader>

            <div className="GropuSecurityCustomizationModal__description">
              {I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.DESCRIPTION')}
            </div>

            <ModalBody>
              <Field
                name="show"
                label={I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.ENABLE')}
                className="GropuSecurityCustomizationModal__field"
                component={FormikCheckbox}
              />

              <div className="GropuSecurityCustomizationModal__fields">
                <Field
                  name="spreadDiff"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.SPRED_DIFFERENCE')}
                  className="GropuSecurityCustomizationModal__field"
                  component={FormikSelectField}
                >
                  {SPRED_DIFFERANCE.map(spred => (
                    <option key={spred} value={spred}>
                      {spred}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="GropuSecurityCustomizationModal__title">
                {I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.LOTS')}
              </div>

              <div className="GropuSecurityCustomizationModal__fields">
                <Field
                  name="lotMin"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.LOT_MIN')}
                  className="GropuSecurityCustomizationModal__field"
                  component={FormikSelectField}
                >
                  {LOT_MIN.map(min => (
                    <option key={min} value={min}>
                      {min}
                    </option>
                  ))}
                </Field>
                <Field
                  name="lotMax"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.LOT_MAX')}
                  className="GropuSecurityCustomizationModal__field"
                  component={FormikSelectField}
                >
                  {LOT_MAX.map(max => (
                    <option key={max} value={max}>
                      {max}
                    </option>
                  ))}
                </Field>
                <Field
                  name="lotStep"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.LOT_STEP')}
                  className="GropuSecurityCustomizationModal__field"
                  component={FormikSelectField}
                >
                  {LOT_STEP.map(step => (
                    <option key={step} value={step}>
                      {step}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="GropuSecurityCustomizationModal__title">
                {I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.COMMISSIONS')}
              </div>

              <div className="GropuSecurityCustomizationModal__fields">
                <Field
                  name="commissionBase"
                  label={I18n.t('TRADING_ENGINE.MODALS.GROUP_COSTOMISATION_SECURITY_MODAL.STANDART')}
                  className="GropuSecurityCustomizationModal__field--small"
                  component={FormikInputField}
                  type="text"
                />
                <Field
                  name="commissionType"
                  className="GropuSecurityCustomizationModal__field--small"
                  component={FormikSelectField}
                >
                  {COMMISION_TYPES.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Field>
                <Field
                  name="commissionLots"
                  className="GropuSecurityCustomizationModal__field--small"
                  component={FormikSelectField}
                >
                  {COMMISION_LOTS.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
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
  withNotifications,
)(React.memo(GropuSecurityCustomizationModal));
