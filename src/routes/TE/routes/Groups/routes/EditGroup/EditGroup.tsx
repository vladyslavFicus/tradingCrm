import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { useParams } from 'react-router-dom';
import { omit } from 'lodash';
import { Formik, Form, FormikProps } from 'formik';
import { hasErrorPath } from 'apollo';
import { withNotifications } from 'hoc';
import NotFound from 'routes/NotFound';
import { Notify, LevelType } from 'types/notify';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
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

const EditGroup = ({ notify }: Props) => {
  const { id: groupName } = useParams<{ id: string }>();

  const groupQuery = useGroupQuery({ variables: { groupName } });
  const [editGroup] = useEditGroupMutation();
  const { data, loading, error, refetch } = groupQuery;
  const groupError = hasErrorPath(error, 'tradingEngineGroup');

  if (groupError) {
    return <NotFound />;
  }

  const handleSubmit = async (group: FormValues) => {
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
      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.GROUP.GROUP'),
        message: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.EDIT.FAILED'),
      });
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
)(EditGroup);
