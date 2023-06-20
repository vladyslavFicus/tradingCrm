import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { parseErrors } from 'apollo';
import enumToArray from 'utils/enumToArray';
import { Profile } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { kycStatuses, kycStatusesLabels } from 'constants/kycStatuses';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { useUpdateClientKycMutation } from './graphql/__generated__/UpdateClientKycMutation';
import './ClientKycForm.scss';

type FormValues = {
  kycStatus: string,
};

type Props = {
  profile: Profile,
};

const ClientKycForm = (props: Props) => {
  const { profile } = props;

  const [kycStatusValue, setKycStatusValue] = useState(profile.kyc?.status || '');

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateKycStatus = permission.allows(permissions.USER_PROFILE.KYC_UPDATE);

  // ===== Requests ===== //
  const [updateClientKycMutation] = useUpdateClientKycMutation();

  // ===== Handlers ===== //
  const handleSubmit = async ({ kycStatus }: FormValues) => {
    try {
      await updateClientKycMutation({ variables: { playerUUID: profile.uuid, kycStatus } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.SUCCESS_RESPONSE'),
      });

      setKycStatusValue(kycStatus);
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <div className="ClientKycForm">
      <Formik
        initialValues={{ kycStatus: kycStatusValue }}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <div className="ClientKycForm__header">
              <div className="ClientKycForm__title">
                {I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE')}
              </div>

              <If condition={dirty && !isSubmitting && allowUpdateKycStatus}>
                <Button
                  small
                  primary
                  type="submit"
                  data-testid="ClientKycForm-saveChangesButton"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </div>

            <Field
              name="kycStatus"
              data-testid="ClientKycForm-kycStatusSelect"
              label={I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.CURRENT_STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              component={FormikSelectField}
              disabled={isSubmitting || !allowUpdateKycStatus}
            >
              {enumToArray(kycStatuses).map(status => (
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
};

export default React.memo(ClientKycForm);
