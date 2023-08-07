import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import enumToArray from 'utils/enumToArray';
import { Profile } from '__generated__/types';
import { kycStatuses, kycStatusesLabels } from 'constants/kycStatuses';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components';
import useClientKycForm from 'routes/Clients/routes/Client/routes/ClientProfileTab/hooks/useClientKycForm';
import './ClientKycForm.scss';

type Props = {
  profile: Profile,
};

const ClientKycForm = (_props: Props) => {
  const {
    kycStatusValue,
    handleSubmit,
    allowUpdateKycStatus,
  } = useClientKycForm(_props);

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
