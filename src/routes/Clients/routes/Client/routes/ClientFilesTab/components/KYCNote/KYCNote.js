import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Field, Form, Formik } from 'formik';
import { withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import { Button } from 'components/Buttons';
import FormikTextAreaField from 'components/Formik/FormikTextAreaField';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import {
  KYCNoteCreateMutation,
  KYCNoteUpdateMutation,
  KYCNoteQuery,
} from './graphql';
import './KYCNote.scss';

const updateNotePermissions = new Permissions(permissions.NOTES.UPDATE_NOTE);

class KYCNote extends PureComponent {
  static propTypes = {
    permission: PropTypes.permission.isRequired,
    createKYCNote: PropTypes.func.isRequired,
    updateKYCNote: PropTypes.func.isRequired,
    playerUUID: PropTypes.string.isRequired,
    KYCNoteQuery: PropTypes.any.isRequired,
  };

  createKYCNote = async ({ content }, { resetForm }) => {
    const {
      KYCNoteQuery: {
        data: {
          profile: {
            kyc: { uuid },
          },
        },
      },
      createKYCNote,
      playerUUID,
    } = this.props;

    try {
      await createKYCNote({
        variables: {
          targetType: 'KYC',
          targetUUID: uuid,
          playerUUID,
          content,
          pinned: false,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.TITLE'),
        message: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.SUCCESS'),
      });

      resetForm({ values: { content } });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.TITLE'),
        message: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.ERROR'),
      });
    }
  };

  editKYCNote = async ({ content }, { resetForm }) => {
    const {
      KYCNoteQuery: {
        data: {
          profile: {
            kycNote: {
              noteId,
            },
          },
        },
      },
      updateKYCNote,
    } = this.props;

    try {
      await updateKYCNote({
        variables: {
          noteId,
          content,
          pinned: false,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.TITLE'),
        message: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.SUCCESS'),
      });

      resetForm({ values: { content } });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.TITLE'),
        message: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.ERROR'),
      });
    }
  };

  render() {
    const {
      KYCNoteQuery: { data, loading },
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    if (loading) {
      return null;
    }

    const KYCNoteContent = data?.profile?.kycNote?.content || '';
    const updateAllowed = updateNotePermissions.check(currentPermissions);
    const isFormDisabled = !!(KYCNoteContent && !updateAllowed);

    return (
      <Formik
        initialValues={{
          content: KYCNoteContent,
        }}
        onSubmit={KYCNoteContent ? this.editKYCNote : this.createKYCNote}
      >
        {({ dirty, handleReset }) => (
          <Form className="KYCNote">
            <div className="KYCNote__note">
              <div className="KYCNote__note-title">{I18n.t('FILES.KYC_NOTE.TITLE')}</div>
              <Field
                name="content"
                className="KYCNote__note-field"
                component={FormikTextAreaField}
                maxLength={1000}
                disabled={isFormDisabled}
              />
            </div>
            <div className="KYCNote__buttons-wrapper">
              <Button
                secondary
                onClick={handleReset}
                disabled={!dirty || isFormDisabled}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>
              <Button
                primary
                type="submit"
                disabled={!dirty || isFormDisabled}
              >
                <Choose>
                  <When condition={KYCNoteContent}>
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
  }
}

export default compose(
  withRequests({
    KYCNoteQuery,
    createKYCNote: KYCNoteCreateMutation,
    updateKYCNote: KYCNoteUpdateMutation,
  }),
  withPermission,
)(KYCNote);
