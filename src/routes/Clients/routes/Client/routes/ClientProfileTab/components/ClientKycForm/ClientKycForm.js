import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { parseErrors, withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import PropTypes from 'constants/propTypes';
import { kycStatusesLabels } from 'constants/kycStatuses';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import UpdateClientKycMutation from './graphql/UpdateClientKycMutation';
import './ClientKycForm.scss';

class ClientKycForm extends PureComponent {
  static propTypes = {
    clientData: PropTypes.profile.isRequired,
    permission: PropTypes.permission.isRequired,
    updateClientKyc: PropTypes.func.isRequired,
  };

  handleSubmit = async ({ kycStatus }, { resetForm }) => {
    const {
      updateClientKyc,
      clientData,
    } = this.props;

    try {
      await updateClientKyc({
        variables: {
          playerUUID: clientData.uuid,
          kycStatus,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.SUCCESS_RESPONSE'),
      });

      resetForm({ values: { kycStatus } });
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  render() {
    const {
      clientData,
      permission: { allows },
    } = this.props;

    const kycStatus = clientData.kyc?.status;

    const isAvailableToUpdate = allows(permissions.USER_PROFILE.KYC_UPDATE);

    return (
      <div className="ClientKycForm">
        <Formik
          initialValues={{ kycStatus }}
          onSubmit={this.handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, dirty }) => (
            <Form>
              <div className="ClientKycForm__header">
                <div className="ClientKycForm__title">
                  {I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE')}
                </div>

                <If condition={dirty && !isSubmitting && isAvailableToUpdate}>
                  <div className="ClientKycForm__actions">
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
                name="kycStatus"
                label={I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.CURRENT_STATUS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                disabled={isSubmitting || !isAvailableToUpdate}
              >
                {Object.keys(kycStatusesLabels).map(status => (
                  <option key={status} value={status}>
                    {I18n.t(kycStatusesLabels[status])}
                  </option>
                ))}
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
    updateClientKyc: UpdateClientKycMutation,
  }),
)(ClientKycForm);
