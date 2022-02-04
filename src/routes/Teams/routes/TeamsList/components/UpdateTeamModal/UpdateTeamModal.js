import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Form, Field, Formik } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import UpdateTeamMutation from './graphql/UpdateTeamMutation';
import './UpdateTeamModal.scss';

const attributeLabels = {
  teamName: 'TEAMS.MODAL.LABELS.TEAM_NAME',
};

class UpdateTeamModal extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    updateTeam: PropTypes.func.isRequired,
  };

  handleUpdateTeam = async (values, { setSubmitting }) => {
    const {
      onCloseModal,
      updateTeam,
      onSuccess,
      notify,
    } = this.props;

    setSubmitting(true);

    try {
      await updateTeam({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TEAMS.UPDATE_MODAL.NOTIFICATIONS.SUCCESS'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('TEAMS.UPDATE_MODAL.NOTIFICATIONS.ERROR'),
      });
    }

    setSubmitting(false);
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      data,
    } = this.props;

    return (
      <Modal className="UpdateTeamModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={data}
          validate={createValidator({
            name: ['required', 'string'],
          }, attributeLabels, false)}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.handleUpdateTeam}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{I18n.t('TEAMS.UPDATE_MODAL.HEADER')}</ModalHeader>
              <ModalBody>
                <Field
                  name="name"
                  label={I18n.t(attributeLabels.name)}
                  placeholder={I18n.t('TEAMS.UPDATE_MODAL.PLACEHOLDERS.TYPE_IN_TEAM_NAME')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  className="UpdateTeamModal__button"
                  commonOutline
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>

                <Button
                  className="UpdateTeamModal__button"
                  primary
                  disabled={isSubmitting}
                  type="submit"
                >
                  {I18n.t('TEAMS.UPDATE_MODAL.UPDATE_BUTTON')}
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
  withRequests({
    updateTeam: UpdateTeamMutation,
  }),
)(UpdateTeamModal);
