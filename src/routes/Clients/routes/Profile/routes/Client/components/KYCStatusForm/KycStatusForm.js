import React, { PureComponent } from 'react';
import compose from 'compose-function';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import { createValidator } from 'utils/validator';
import { withPermission } from 'providers/PermissionsProvider';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { kycStatusesLabels } from 'constants/kycStatuses';
import PropTypes from 'constants/propTypes';
import UpdateKycStatusMutation from './graphql/UpdateKycStatusMutation';

const validator = createValidator({
  kycStatus: `in:${Object.keys(kycStatusesLabels).join()}`,
});

const updateKycStatusPermissions = new Permissions(permissions.USER_PROFILE.KYC_UPDATE);

class KycStatusForm extends PureComponent {
  static propTypes = {
    kycStatus: PropTypes.string.isRequired,
    permission: PropTypes.permission.isRequired,
    notify: PropTypes.func.isRequired,
    updateKycStatus: PropTypes.func.isRequired,
    playerUUID: PropTypes.string.isRequired,
  };

  handleChangeKycStatus = async ({ kycStatus }, { resetForm }) => {
    const { playerUUID, updateKycStatus, notify } = this.props;

    try {
      await updateKycStatus({
        variables: {
          playerUUID,
          kycStatus,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.SUCCESS_RESPONSE'),
      });

      resetForm({ values: { kycStatus } });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  render() {
    const {
      permission: {
        permissions: currentPermissions,
      },
      kycStatus,
    } = this.props;

    const isAvailableToChangeKysStatus = updateKycStatusPermissions.check(currentPermissions);

    return (
      <Formik
        enableReinitialize
        initialValues={{ kycStatus }}
        onSubmit={this.handleChangeKycStatus}
        validate={validator}
      >
        {({ isValid, dirty }) => (
          <Form>
            <div className="col personal-form-heading row margin-bottom-20">
              {I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE')}
            </div>
            <div className="form-row">
              <Field
                name="kycStatus"
                label={I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.CURRENT_STATUS')}
                component={FormikSelectField}
                disabled={!isAvailableToChangeKysStatus}
                className={classNames({
                  'col-lg-7': isAvailableToChangeKysStatus,
                  'col-lg-12': !isAvailableToChangeKysStatus,
                })}
              >
                {Object.entries(kycStatusesLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>
              <If condition={isAvailableToChangeKysStatus && dirty}>
                <div className="col-4 mt-4-profile">
                  <Button
                    type="submit"
                    primary
                    disabled={!isValid}
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
  withPermission,
  withNotifications,
  withRequests({
    updateKycStatus: UpdateKycStatusMutation,
  }),
)(KycStatusForm);
