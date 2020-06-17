import React, { PureComponent } from 'react';
import { withRequests } from 'apollo';
import { compose } from 'react-apollo';
import { Field, Form, Formik } from 'formik';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withNotifications } from 'hoc';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import Button from 'components/UI/Button';
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
    notify: PropTypes.func.isRequired,
  };

  createKYCNote = async ({ content }, { resetForm }) => {
    const {
      KYCNoteQuery: {
        data: {
          profile: {
            data: {
              kyc: { uuid },
            },
          },
        },
      },
      createKYCNote,
      playerUUID,
      notify,
    } = this.props;

    const { data: { note: { add: { error } } } } = await createKYCNote({
      variables: {
        targetType: 'KYC',
        targetUUID: uuid,
        playerUUID,
        content,
      },
    });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.TITLE'),
      message: error
        ? I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.ERROR')
        : I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.CREATE.SUCCESS'),
    });

    if (!error) {
      resetForm({ values: { content } });
    }
  };

  editKYCNote = async ({ content }, { resetForm }) => {
    const {
      KYCNoteQuery: {
        data: {
          profile: {
            data: {
              kycNote: {
                noteId,
              },
            },
          },
        },
      },
      updateKYCNote,
      notify,
    } = this.props;

    const { data: { note: { update: { error } } } } = await updateKYCNote({
      variables: {
        noteId,
        content,
      },
    });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.TITLE'),
      message: error
        ? I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.ERROR')
        : I18n.t('FILES.KYC_NOTE.NOTIFICATIONS.UPDATE.SUCCESS'),
    });

    if (!error) {
      resetForm({ values: { content } });
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

    const KYCNoteContent = get(data, 'profile.data.kycNote.content') || '';
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
                common
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
  withNotifications,
  withPermission,
)(KYCNote);
