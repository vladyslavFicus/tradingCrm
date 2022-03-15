import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { useParams } from 'react-router-dom';
import { omit } from 'lodash';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { hasErrorPath, parseErrors } from 'apollo';
import { withNotifications, withModals } from 'hoc';
import NotFound from 'routes/NotFound';
import { Modal } from 'types';
import { Notify, LevelType } from 'types/notify';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import GroupProfileHeader from '../../components/GroupProfileHeader';
import GroupCommonForm from '../../components/GroupCommonForm';
import GroupPermissionsForm from '../../components/GroupPermissionsForm';
import GroupArchivingForm from '../../components/GroupArchivingForm';
import GroupMarginsForm from '../../components/GroupMarginsForm';
import GroupSecuritiesGrid from '../../components/GroupSecuritiesGrid';
import GroupSymbolsGrid from '../../components/GroupSymbolsGrid';
import { groupNamePattern } from '../../constants';
import { FormValues } from '../../types';
import { useEditGroupMutation } from './graphql/__generated__/EditGroupMutation';
import { useGroupQuery } from './graphql/__generated__/GroupQuery';
import './EditGroup.scss';

interface Props {
  notify: Notify,
  modals: {
    confirmationModal: Modal,
  },
}

const validator = createValidator(
  {
    groupName: ['required', `regex:${groupNamePattern}`],
    marginCallLevel: ['required', 'numeric', 'min:0', 'max:100'],
    stopoutLevel: ['required', 'numeric', 'min:0', 'max:100'],
  },
  {
    groupName: I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.NAME'),
    marginCallLevel: I18n.t('TRADING_ENGINE.GROUP.MARGINS_GROUP_FORM.MARGIN_CALL_LEVEL'),
    stopoutLevel: I18n.t('TRADING_ENGINE.GROUP.MARGINS_GROUP_FORM.STOP_OUT_LEVEL'),
  },
  false,
  {
    'regex.groupName': I18n.t('TRADING_ENGINE.GROUP.INVALID_NAME'),
  },
);

const EditGroup = (props: Props) => {
  const { notify, modals: { confirmationModal } } = props;

  const { id: groupName } = useParams<{ id: string }>();

  const groupQuery = useGroupQuery({ variables: { groupName } });
  const [editGroup] = useEditGroupMutation();
  const { data, loading, error, refetch } = groupQuery;
  const groupError = hasErrorPath(error, 'tradingEngineGroup');

  if (groupError) {
    return <NotFound />;
  }

  const handleSubmit = async (group: FormValues, formik: FormikHelpers<FormValues>, force = false) => {
    try {
      await editGroup({
        variables: {
          args: {
            // Currency and groupName are non-editable fields
            ...omit(group, ['currency']),
            // For BE groupSecurities need only security ID
            groupSecurities: group?.groupSecurities?.map(groupSecurity => ({
              ...omit(groupSecurity, 'security'),
              securityId: groupSecurity.security.id,
            })) || [],
            groupMargins: group?.groupMargins?.map(groupMargin => ({
              ...omit(groupMargin, 'securityId'),
            })) || [],
            force,
          },
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.GROUP.GROUP'),
        message: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.EDIT.SUCCESS'),
      });

      refetch();
    } catch (e) {
      const errors = parseErrors(e);

      const securities = Object.keys(errors.errorParameters);

      // Open confirmation modal to confirm force closing orders
      if (errors.error === 'error.group-security.has.opened.orders') {
        confirmationModal.show({
          actionText: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.EDIT.FAILED_ORDERS_EXIST', {
            securities: securities.join(', '),
            count: securities.length,
          }),
          submitButtonLabel: I18n.t('COMMON.YES'),
          cancelButtonLabel: I18n.t('COMMON.NO'),
          onSubmit: () => handleSubmit(group, formik, true),
          onCancel: formik.resetForm,
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('TRADING_ENGINE.GROUP.GROUP'),
          message: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.EDIT.FAILED'),
        });
      }
    }
  };

  return (
    <div className="EditGroup">
      <Formik
        initialValues={data?.tradingEngine.group || ({} as FormValues)}
        validate={validator}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formikBag: FormikProps<FormValues>) => (
          <Form>
            <GroupProfileHeader formik={formikBag} />
            <Choose>
              <When condition={loading && !data?.tradingEngine.group}>
                <ShortLoader className="EditGroup__loader" />
              </When>
              <Otherwise>
                <GroupCommonForm formik={formikBag} />
                <GroupPermissionsForm />
                <GroupArchivingForm />
                <GroupMarginsForm />
                <GroupSecuritiesGrid formik={formikBag} />
                <GroupSymbolsGrid formik={formikBag} />
              </Otherwise>
            </Choose>
          </Form>
        )}
      </Formik>
    </div>
  );
};


export default compose(
  React.memo,
  withNotifications,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(EditGroup);
