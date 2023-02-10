import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { parseErrors, withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import PropTypes from 'constants/propTypes';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import UpdateClientTransferMutation from './graphql/UpdateClientTransferMutation';
import './ClientTransferForm.scss';

class ClientTransferForm extends PureComponent {
  static propTypes = {
    clientData: PropTypes.profile.isRequired,
    permission: PropTypes.permission.isRequired,
    updateClientTransfer: PropTypes.func.isRequired,
  };

  handleSubmit = async ({ internalTransfer }, { resetForm }) => {
    const {
      updateClientTransfer,
      clientData,
    } = this.props;

    try {
      await updateClientTransfer({
        variables: {
          playerUUID: clientData.uuid,
          internalTransfer: !!internalTransfer,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });

      resetForm({ values: { internalTransfer } });
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  render() {
    const {
      clientData,
      permission: { allows },
    } = this.props;

    const isAvailableToUpdate = allows(permissions.USER_PROFILE.CHANGE_CONFIGURATION);

    const internalTransfer = Number(clientData.configuration?.internalTransfer) || 0;

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
  withRequests({
    updateClientTransfer: UpdateClientTransferMutation,
  }),
)(ClientTransferForm);
