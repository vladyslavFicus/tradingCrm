import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import compose from 'compose-function';
import { Field, Form, Formik } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import UpdateTransferAvailabilityMutation from './graphql/UpdateTransferAvailabilityMutation';

class TransferAvailabilityForm extends PureComponent {
  static propTypes = {
    internalTransfer: PropTypes.number.isRequired,
    notify: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    updateTransferAvailability: PropTypes.func.isRequired,
    playerUUID: PropTypes.string.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  handleChangeTransfer = async ({ internalTransfer }, { resetForm }) => {
    const { playerUUID, updateTransferAvailability, notify } = this.props;

    try {
      await updateTransferAvailability({
        variables: {
          playerUUID,
          internalTransfer: !!internalTransfer,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });

      resetForm({ values: { internalTransfer } });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  render() {
    const {
      internalTransfer,
      disabled,
    } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          internalTransfer,
        }}
        onSubmit={this.handleChangeTransfer}
      >
        {({ dirty }) => (
          <Form>
            <div className="col personal-form-heading row margin-bottom-20">
              {I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE')}
            </div>
            <div className="form-row">
              <Field
                name="internalTransfer"
                label={I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.LABEL')}
                disabled={disabled}
                component={FormikSelectField}
                className="col-lg-6"
              >
                <option key={2} value={0}>
                  {I18n.t('COMMON.DISABLED')}
                </option>
                <option key={1} value={1}>
                  {I18n.t('COMMON.ENABLED')}
                </option>
              </Field>
              <If condition={dirty}>
                <div className="col-4 mt-4-profile">
                  <Button
                    type="submit"
                    primary
                  >
                    {I18n.t('COMMON.BUTTONS.SAVE')}
                  </Button>
                </div>
              </If>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    updateTransferAvailability: UpdateTransferAvailabilityMutation,
  }),
)(TransferAvailabilityForm);
