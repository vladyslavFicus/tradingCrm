import { useCallback } from 'react';
import I18n from 'i18n-js';
import { FormikHelpers } from 'formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { FormValues } from '../types/KYCNote';
import { useKycNoteQuery } from '../graphql/__generated__/KycNoteQuery';
import { useNoteCreateMutation } from '../graphql/__generated__/NoteCreateMutation';
import { useNoteUpdateMutation } from '../graphql/__generated__/NoteUpdateMutation';

type Props = {
  playerUUID: string,
};

const useKYCNote = (props: Props) => {
  const { playerUUID } = props;

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowsUpdateNote = permission.allows(permissions.NOTES.UPDATE_NOTE);

  // ===== Requests ===== //
  const [noteCreateMutation] = useNoteCreateMutation();
  const [noteUpdateMutation] = useNoteUpdateMutation();

  const { data } = useKycNoteQuery({ variables: { playerUUID } });

  const note = data?.profile?.kycNote;
  const targetUUID = data?.profile?.kyc.uuid || '';

  // ===== Handlers ===== //
  const createNote = useCallback(async (content: string) => {
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
  }, [noteCreateMutation, playerUUID, targetUUID]);

  const updateNote = useCallback(async (noteId: string, content: string) => {
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
  }, [noteUpdateMutation]);

  const handleSubmit = useCallback(async ({ content }: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    if (note) {
      await updateNote(note.noteId, content);
    } else {
      await createNote(content);
    }

    formikHelpers.resetForm({ values: { content } });
  }, [createNote, note, updateNote]);

  return {
    isProfile: !!data?.profile,
    note,
    content: note?.content || '',
    allowsUpdateNote,
    handleSubmit,
  };
};

export default useKYCNote;
