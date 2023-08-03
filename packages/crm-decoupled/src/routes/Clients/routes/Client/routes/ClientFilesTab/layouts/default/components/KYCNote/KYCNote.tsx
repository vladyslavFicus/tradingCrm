import React from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { Button } from 'components/Buttons';
import FormikTextAreaField from 'components/Formik/FormikTextAreaField';
import useKYCNote from 'routes/Clients/routes/Client/routes/ClientFilesTab/hooks/useKYCNote';
import './KYCNote.scss';

type Props = {
  playerUUID: string,
};

const KYCNote = (_props: Props) => {
  const {
    isProfile,
    note,
    content,
    allowsUpdateNote,
    handleSubmit,
  } = useKYCNote(_props);

  if (isProfile) {
    return null;
  }

  return (
    <Formik
      initialValues={{ content }}
      onSubmit={handleSubmit}
    >
      {({ dirty, handleReset }) => (
        <Form className="KYCNote">
          <div className="KYCNote__note">
            <div className="KYCNote__note-title">
              {I18n.t('FILES.KYC_NOTE.TITLE')}
            </div>

            <Field
              name="content"
              className="KYCNote__note-field"
              data-testid="KYCNote-contentTextArea"
              component={FormikTextAreaField}
              maxLength={1000}
              disabled={!allowsUpdateNote}
            />
          </div>

          <div className="KYCNote__buttons-wrapper">
            <Button
              secondary
              onClick={handleReset}
              disabled={!dirty || !allowsUpdateNote}
              data-testid="KYCNote-cancelButton"
            >
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </Button>

            <Button
              primary
              type="submit"
              disabled={!dirty || !allowsUpdateNote}
              data-testid="KYCNote-updateCreateButton"
            >
              <Choose>
                <When condition={!!note}>
                  {I18n.t('COMMON.BUTTONS.UPDATE')}
                </When>

                <Otherwise>
                  {I18n.t('COMMON.BUTTONS.CREATE')}
                </Otherwise>
              </Choose>
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(KYCNote);
