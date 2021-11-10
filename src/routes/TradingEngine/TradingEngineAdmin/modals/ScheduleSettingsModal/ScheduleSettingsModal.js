import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { createValidator } from 'utils/validator';
import { Button } from 'components/UI';
import { FormikTimeRangeField } from 'components/Formik';
import './ScheduleSettingsModal.scss';

const validate = createValidator({
  workingHoursFrom: ['required', 'string', 'validTimeRange:workingHoursTo'],
  workingHoursTo: ['required', 'string'],
});

class ScheduleSettingsModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    day: PropTypes.string.isRequired,
    formError: PropTypes.string,
    workingHoursFrom: PropTypes.string,
    workingHoursTo: PropTypes.string,
  };

  static defaultProps = {
    workingHoursFrom: '',
    workingHoursTo: '',
    formError: '',
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      day,
      formError,
      workingHoursFrom,
      workingHoursTo,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{
            workingHoursFrom: workingHoursFrom || '00:00',
            workingHoursTo: workingHoursTo || '00:00',
          }}
          validate={validate}
          onSubmit={this.onHandleSubmit}
        >
          {(
            {
              errors,
              dirty,
              isValid,
              isSubmitting,
            },
          ) => (
            <Form className="ScheduleSettingsModal">
              <ModalHeader toggle={onCloseModal}>
                {`${I18n.t(`TRADING_ENGINE.NEW_SYMBOL.WEEK.${day}`)}
                ${I18n.t('TRADING_ENGINE.NEW_SYMBOL.MODALS.SCHEDULE.TITLE')}`}
              </ModalHeader>
              <ModalBody>
                <p className="ScheduleSettingsModal__message">
                  {I18n.t('TRADING_ENGINE.NEW_SYMBOL.MODALS.SCHEDULE.MESSAGE')}
                </p>
                <If condition={formError || (errors && errors.submit)}>
                  <div className="ScheduleSettingsModal__message-error">
                    {formError || errors.submit}
                  </div>
                </If>
                <Field
                  component={FormikTimeRangeField}
                  fieldsNames={{
                    from: 'workingHoursFrom',
                    to: 'workingHoursTo',
                  }}
                  fieldsLabels={{
                    from: I18n.t('TRADING_ENGINE.NEW_SYMBOL.MODALS.SCHEDULE.LABELS.WORKING_HOURS_FROM'),
                    to: I18n.t('TRADING_ENGINE.NEW_SYMBOL.MODALS.SCHEDULE.LABELS.WORKING_HOURS_TO'),
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
                  {I18n.t('COMMON.SAVE_CHANGES')}
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
