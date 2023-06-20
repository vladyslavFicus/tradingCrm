import React from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { Button } from 'components/Buttons';
import FormikTextAreaField from 'components/Formik/FormikTextAreaField';
import { useKycNoteQuery } from './graphql/__generated__/KycNoteQuery';
import { useNoteCreateMutation } from './graphql/__generated__/NoteCreateMutation';
import { useNoteUpdateMutation } from './graphql/__generated__/NoteUpdateMutation';
import './KYCNote.scss';

type FormValues = {
  content: string,
};

type Props = {
  playerUUID: string,
};

const KYCNote = (props: Props) => {
  const { playerUUID } = props;

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowsUpdateNote = permission.allows(permissions.NOTES.UPDATE_NOTE);

  // ===== Requests ===== //
  const [noteCreateMutation] = useNoteCreateMutation();
  const [noteUpdateMutation] = useNoteUpdateMutation();

  const { data, loading } = useKycNoteQuery({ variables: { playerUUID } });

  if (loading || !data?.profile) {
    return null;
  }

  const note = data.profile.kycNote;
  const targetUUID = data.profile.kyc.uuid;

  const createNote = async (content: string) => {
    try {
      await noteCreateMutation({
        variables: {
          targetType: 'KYC',
          targetUUID,
          playerUUID,
          content,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.TITLE'),
        message: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.TITLE'),
        message: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.ERROR'),
      });
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    try {
      await noteUpdateMutation({
        variables: {
          noteId,
          content,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.TITLE'),
        message: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.TITLE'),
        message: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.ERROR'),
      });
    }
  };

  // ===== Handlers ===== //
  const handleSubmit = async ({ content }: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    if (note) {
      await updateNote(note.noteId, content);
    } else {
      await createNote(content);
    }

    formikHelpers.resetForm({ values: { content } });
  };

  return (
    <Formik
      initialValues={{ content: note?.content || '' }}
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
