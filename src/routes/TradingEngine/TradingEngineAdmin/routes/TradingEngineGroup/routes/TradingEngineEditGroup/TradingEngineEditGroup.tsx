import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { omit } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, FormikProps } from 'formik';
import { withRequests } from 'apollo';
import { MutationResult, MutationOptions, QueryResult } from 'react-apollo';
import { withNotifications } from 'hoc';
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
import { GroupSecurity, Group } from '../../types';
import { groupNamePattern } from '../../constants';
import GroupQuery from './graphql/GroupQuery';
import EditGroupMutation from './graphql/EditGroupMutation';
import './TradingEngineEditGroup.scss';

interface Props {
  id: string,
  notify: Notify,
  editGroup: (options: MutationOptions) => MutationResult<{ editGroup: null }>,
  groupQuery: QueryResult<{ tradingEngineAdminGroup: Group }>,
}

const TradingEngineEditGroup = ({
  notify,
  editGroup,
  groupQuery,
  history,
  match: { params: { id } },
}: Props & RouteComponentProps<{ id: string }>) => {
  const { data, loading } = groupQuery || {};

  const handleSubmit = async (group: Group) => {
    try {
      await editGroup({
        variables: {
          args: {
            // Currency and groupName are non-editable fields
            ...omit(group, ['currency']),
            // For BE groupSecurities need only security ID
            groupSecurities: group?.groupSecurities?.map((groupSecurity: GroupSecurity) => ({
              securityId: Number(groupSecurity.security.id),
              ...omit(groupSecurity, 'security'),
            })) || [],
          },
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.GROUP.GROUP'),
        message: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.EDIT.SUCCESS'),
      });

      history.push('/trading-engine-admin/groups');
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.GROUP.GROUP'),
        message: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.EDIT.FAILED'),
      });
    }
  };

  return (
    <div className="TradingEngineEditGroup">
      <Formik
        initialValues={data?.tradingEngineAdminGroup || {}}
        validate={createValidator(
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
        )}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formikBag: FormikProps<Group>) => (
          <Form>
            <GroupProfileHeader
              formik={formikBag}
              isEditGroupPage={Boolean(id)}
            />
            <Choose>
              <When condition={loading}>
                <ShortLoader className="TradingEngineEditGroup__loader" />
              </When>
              <Otherwise>
                <GroupCommonForm isEditGroupPage={Boolean(id)} />
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
  withRouter,
  withRequests({
    editGroup: EditGroupMutation,
    groupQuery: GroupQuery,
  }),
  withNotifications,
)(React.memo(TradingEngineEditGroup));
