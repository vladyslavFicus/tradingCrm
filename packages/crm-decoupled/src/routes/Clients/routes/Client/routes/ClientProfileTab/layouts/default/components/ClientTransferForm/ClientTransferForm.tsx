import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Button, FormikSingleSelectField } from 'components';
import { Profile } from '__generated__/types';
import useClientTransferForm from 'routes/Clients/routes/Client/routes/ClientProfileTab/hooks/useClientTransferForm';
import { transferTypes } from 'routes/Clients/routes/Client/routes/ClientProfileTab/constants/clientTransferForm';
import './ClientTransferForm.scss';

type Props = {
  profile: Profile,
};

const ClientTransferForm = (_props: Props) => {
  const {
    internalTransferValue,
    allowUpdateTransfer,
    handleSubmit,
  } = useClientTransferForm(_props);

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
              component={FormikSingleSelectField}
              disabled={isSubmitting || !allowUpdateTransfer}
              options={transferTypes.map(({ value, label }) => ({
                label: I18n.t(label),
                value,
              }))}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(ClientTransferForm);
