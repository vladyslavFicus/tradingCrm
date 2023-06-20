import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { parseErrors } from 'apollo';
import { Profile } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { transferTypes } from './constants';
import { useUpdateClientTransferMutation } from './graphql/__generated__/UpdateClientTransferMutation';
import './ClientTransferForm.scss';

type FormValues = {
  internalTransfer: boolean,
};

type Props = {
  profile: Profile,
};

const ClientTransferForm = (props: Props) => {
  const { profile } = props;

  const [internalTransferValue, setInternalTransferValue] = useState(!!profile.configuration?.internalTransfer);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateTransfer = permission.allows(permissions.USER_PROFILE.CHANGE_CONFIGURATION);

  // ===== Requests ===== //
  const [updateClientTransferMutation] = useUpdateClientTransferMutation();

  // ===== Handlers ===== //
  const handleSubmit = async ({ internalTransfer }: FormValues) => {
    try {
      await updateClientTransferMutation({ variables: { playerUUID: profile.uuid, internalTransfer } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });

      setInternalTransferValue(internalTransfer);
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <div className="ClientTransferForm">
      <Formik
        initialValues={{ internalTransfer: internalTransferValue }}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <div className="ClientTransferForm__header">
              <div className="ClientTransferForm__title">
                {I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE')}
              </div>

              <If condition={dirty && !isSubmitting && allowUpdateTransfer}>
                <Button
                  small
                  primary
                  type="submit"
                  data-testid="ClientTransferForm-saveChangesButton"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </div>

            <Field
              name="internalTransfer"
              data-testid="ClientTransferForm-internalTransferSelect"
              label={I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              component={FormikSelectField}
              disabled={isSubmitting || !allowUpdateTransfer}
            >
              {transferTypes.map(({ value, label }) => (
                // @ts-ignore TS doesn't approve value as boolean type
                <option key={`transferTypes-${value}`} value={value}>
                  {I18n.t(label)}
                </option>
              ))}
            </Field>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(ClientTransferForm);
