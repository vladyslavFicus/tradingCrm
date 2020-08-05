import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { FormikSelectField, FormikTextAreaField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import ChangeProfileStatusMutation from './graphql/ChangeProfileStatusMutation';

const attributeLabels = {
  reason: I18n.t('COMMON.REASON'),
  comment: I18n.t('COMMON.COMMENT'),
};

class PlayerStatusModal extends PureComponent {
  static propTypes = {
    changeProfileStatus: PropTypes.func.isRequired,
    playerUUID: PropTypes.string.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    reasons: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
  };

  onSubmit = async (values) => {
    const {
      changeProfileStatus,
      onCloseModal,
      playerUUID,
      action,
      notify,
    } = this.props;

    try {
      await changeProfileStatus({
        variables: {
          status: action,
          playerUUID,
          ...values,
        },
      });

      notify({
        level: 'success',
        message: I18n.t('COMMON.SUCCESS'),
      });

      onCloseModal();
    } catch (e) {
      notify({
        level: 'error',
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  render() {
    const {
      onCloseModal,
      reasons,
      action,
      isOpen,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        className="modal-danger"
        isOpen={isOpen}
      >
        <Formik
          initialValues={{
            reason: '',
            comment: '',
          }}
          onSubmit={this.onSubmit}
          validate={values => createValidator({
            comment: 'string',
            reason: `required|string|in:${Object.keys(reasons).join()}`,
          }, attributeLabels, false)(values)}
        >
          {({ isValid }) => (
            <Form>
              <ModalHeader>
                {I18n.t('PLAYER_PROFILE.PROFILE.STATUS_MODAL.TITLE')}
              </ModalHeader>
              <ModalBody>
                <If condition={reasons}>
                  <Field
                    name="reason"
                    placeholder={I18n.t('common.select.default')}
                    label={attributeLabels.reason}
                    component={FormikSelectField}
                  >
                    {Object.keys(reasons).map(key => (
                      <option key={key} value={key}>
                        {I18n.t(renderLabel(key, reasons))}
                      </option>
                    ))}
                  </Field>
                </If>
                <Field
                  name="comment"
                  placeholder={`${I18n.t('COMMON.COMMENT')}...`}
                  label={attributeLabels.comment}
                  component={FormikTextAreaField}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  commonOutline
                  className="mr-auto"
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  type="submit"
                  danger
                  disabled={!isValid}
                >
                  {action}
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
    changeProfileStatus: ChangeProfileStatusMutation,
  }),
)(PlayerStatusModal);
