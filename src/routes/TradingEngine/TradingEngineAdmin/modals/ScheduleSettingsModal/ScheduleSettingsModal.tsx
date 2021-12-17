import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { Button } from 'components/UI';
import { FormikTimeRangeField } from 'components/Formik';
import { DayOfWeek, SessionType } from '../../types';
import './ScheduleSettingsModal.scss';

const validate = createValidator({
  openTime: ['required', 'string'],
  closeTime: ['required', 'string'],
});

interface SymbolSessionWorkingHours {
  openTime: string,
  closeTime: string,
}

interface Props {
  onCloseModal: () => void,
  onSuccess: (values?: Object) => void,
  isOpen: boolean,
  sessionType: SessionType,
  formError: string,
  dayOfWeek: DayOfWeek,
  trade?: SymbolSessionWorkingHours,
  quote?: SymbolSessionWorkingHours,
}

class ScheduleSettingsModal extends PureComponent<Props> {
  onHandleSubmit = async ({
    openTime,
    closeTime,
  }: SymbolSessionWorkingHours,
  { setSubmitting }: FormikHelpers<SymbolSessionWorkingHours>) => {
    const {
      dayOfWeek,
      sessionType,
      onSuccess,
      onCloseModal,
    } = this.props;

    onSuccess({
      dayOfWeek,
      [sessionType]: {
        openTime,
        closeTime,
      },
    });

    onCloseModal();

    setSubmitting(false);
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      dayOfWeek,
      sessionType,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{
            openTime: this.props[sessionType]?.openTime || '00:00',
            closeTime: this.props[sessionType]?.closeTime || '00:00',
          }}
          validate={validate}
          onSubmit={this.onHandleSubmit}
        >
          {(
            {
              dirty,
              isValid,
              isSubmitting,
            },
          ) => (
            <Form className="ScheduleSettingsModal">
              <ModalHeader toggle={onCloseModal}>
                {`${I18n.t(`TRADING_ENGINE.SYMBOL.WEEK.${dayOfWeek}`)}
                ${I18n.t('TRADING_ENGINE.SYMBOL.MODALS.SCHEDULE.TITLE')}`}
              </ModalHeader>
              <ModalBody>
                <p className="ScheduleSettingsModal__message">
                  {I18n.t('TRADING_ENGINE.SYMBOL.MODALS.SCHEDULE.MESSAGE')}
                </p>
                <Field
                  className="ScheduleSettingsModal__timeRange"
                  component={FormikTimeRangeField}
                  fieldsNames={{
                    from: 'openTime',
                    to: 'closeTime',
                  }}
                  fieldsLabels={{
                    from: I18n.t('TRADING_ENGINE.SYMBOL.MODALS.SCHEDULE.LABELS.WORKING_HOURS_FROM'),
                    to: I18n.t('TRADING_ENGINE.SYMBOL.MODALS.SCHEDULE.LABELS.WORKING_HOURS_TO'),
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  commonOutline
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  primary
                  type="submit"
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  {I18n.t('COMMON.BUTTONS.SAVE')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
)(ScheduleSettingsModal);
