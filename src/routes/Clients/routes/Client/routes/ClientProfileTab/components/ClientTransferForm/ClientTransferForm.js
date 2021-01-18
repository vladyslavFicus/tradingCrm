import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import { parseErrors, withRequests } from 'apollo';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import UpdateClientTransferMutation from './graphql/UpdateClientTransferMutation';
import './ClientTransferForm.scss';

class ClientTransferForm extends PureComponent {
  static propTypes = {
    clientData: PropTypes.profile.isRequired,
    permission: PropTypes.permission.isRequired,
    updateClientTransfer: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleSubmit = async ({ internalTransfer }, { resetForm }) => {
    const {
      updateClientTransfer,
      clientData,
      notify,
    } = this.props;

    try {
      await updateClientTransfer({
        variables: {
          playerUUID: clientData.uuid,
          internalTransfer: !!internalTransfer,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });

      resetForm({ values: { internalTransfer } });
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  render() {
    const {
      clientData,
      permission: { permissions: currentPermissions },
    } = this.props;

    const isAvailableToUpdate = new Permissions(permissions.USER_PROFILE.CHANGE_CONFIGURATION)
      .check(currentPermissions);

    const internalTransfer = Number(clientData.configuration?.internalTransfer);

    return (
      <div className="ClientTransferForm">
        <Formik
          initialValues={{ internalTransfer }}
          onSubmit={this.handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, dirty }) => (
            <Form>
              <div className="ClientTransferForm__header">
                <div className="ClientTransferForm__title">
                  {I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE')}
                </div>

                <If condition={dirty && !isSubmitting && isAvailableToUpdate}>
                  <div className="ClientTransferForm__actions">
                    <Button
                      small
                      primary
                      type="submit"
                    >
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </Button>
                  </div>
                </If>
              </div>

              <Field
                name="internalTransfer"
                label={I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                disabled={isSubmitting || !isAvailableToUpdate}
              >
                <option key={1} value={0}>
                  {I18n.t('COMMON.DISABLED')}
                </option>
                <option key={2} value={1}>
                  {I18n.t('COMMON.ENABLED')}
                </option>
              </Field>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withNotifications,
  withRequests({
    updateClientTransfer: UpdateClientTransferMutation,
  }),
)(ClientTransferForm);
