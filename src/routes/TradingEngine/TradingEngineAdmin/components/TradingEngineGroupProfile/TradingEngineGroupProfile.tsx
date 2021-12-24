import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { omit } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { parseErrors, withRequests } from 'apollo';
import { MutationResult, MutationOptions, QueryResult } from 'react-apollo';
import { getBrand } from 'config';
import { withNotifications } from 'hoc';
import { Notify, LevelType } from 'types/notify';
import { createValidator } from 'utils/validator';
import ShortLoader from 'components/ShortLoader';
import GroupProfileHeader from './components/GroupProfileHeader';
import GroupCommonForm from './components/GroupCommonForm';
import GroupPermissionsForm from './components/GroupPermissionsForm';
import GroupArchivingForm from './components/GroupArchivingForm';
import GroupMarginsForm from './components/GroupMarginsForm';
import GroupSecuritiesGrid from './components/GroupSecuritiesGrid';
import GroupSymbolsGrid from './components/GroupSymbolsGrid';
import {
  ArchivePeriodDays,
  ArchiveMaxBalance,
  DefaultLeverage,
  GroupSecurity,
  Group,
} from './types';
import GroupQuery from './graphql/GroupQuery';
import CreateGroupMutation from './graphql/CreateGroupMutation';
import EditGroupMutation from './graphql/EditGroupMutation';
import './TradingEngineGroupProfile.scss';

interface Props {
  id?: string,
  notify: Notify,
  editGroup: (options: MutationOptions) => MutationResult<{ editGroup: null }>,
  createGroup: (options: MutationOptions) => MutationResult<{ createGroup: null }>,
  groupQuery: QueryResult<{ tradingEngineAdminGroup: Group }>,
}

const TradingEngineGroupProfile = ({
  notify,
  createGroup,
  editGroup,
  groupQuery,
  history,
  match: { params: { id } },
}: Props & RouteComponentProps<{ id: string }>) => {
  const isEditGroupPage = Boolean(id);

  const { data, loading } = groupQuery || {};
  const editableGroup = data?.tradingEngineAdminGroup;

  const handleCreateGroup = async (group: Group) => {
    try {
      await createGroup({
        variables: {
          args: {
            ...group,
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
        title: I18n.t('TRADING_ENGINE.GROUP_PROFILE.GROUP'),
        message: I18n.t('TRADING_ENGINE.GROUP_PROFILE.NOTIFICATION.CREATE.SUCCESS'),
      });

      history.push('/trading-engine-admin/groups');
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.GROUP_PROFILE.GROUP'),
        message: error.error === 'error.gruop.already.exist'
          ? I18n.t('TRADING_ENGINE.GROUP_PROFILE.NOTIFICATION.CREATE.FAILED_EXIST')
          : I18n.t('TRADING_ENGINE.GROUP_PROFILE.NOTIFICATION.CREATE.FAILED'),
      });
    }
  };

  const handleEditGroup = async (group: Group) => {
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
        title: I18n.t('TRADING_ENGINE.GROUP_PROFILE.GROUP'),
        message: I18n.t('TRADING_ENGINE.GROUP_PROFILE.NOTIFICATION.EDIT.SUCCESS'),
      });

      history.push('/trading-engine-admin/groups');
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.GROUP_PROFILE.GROUP'),
        message: I18n.t('TRADING_ENGINE.GROUP_PROFILE.NOTIFICATION.EDIT.FAILED'),
      });
    }
  };

  return (
    <div className="TradingEngineGroupProfile">
      <Formik
        initialValues={isEditGroupPage
          ? editableGroup
          : {
            enable: true,
            groupName: '',
            description: '',
            currency: getBrand().currencies.base,
            defaultLeverage: DefaultLeverage.LEVERAGE_100,
            useSwap: true,
            hedgeProhibited: false,
            archivePeriodDays: ArchivePeriodDays.DISABLED,
            archiveMaxBalance: ArchiveMaxBalance.MAX_0,
            marginCallLevel: 50,
            stopoutLevel: 30,
            groupSecurities: [],
            groupMargins: [],
          }
        }
        validate={createValidator(
          {
            groupName: ['required'],
            marginCallLevel: ['required', 'numeric', 'min:0', 'max:100'],
            stopoutLevel: ['required', 'numeric', 'min:0', 'max:100'],
          },
          {
            groupName: I18n.t('TRADING_ENGINE.GROUP_PROFILE.COMMON_GROUP_FORM.NAME'),
            marginCallLevel: I18n.t('TRADING_ENGINE.GROUP_PROFILE.MARGINS_GROUP_FORM.MARGIN_CALL_LEVEL'),
            stopoutLevel: I18n.t('TRADING_ENGINE.GROUP_PROFILE.MARGINS_GROUP_FORM.STOP_OUT_LEVEL'),
          },
          false,
        )}
        enableReinitialize
        onSubmit={isEditGroupPage ? handleEditGroup : handleCreateGroup}
      >
        {formikBag => (
          <Form className="TradingEngineGroupProfile__form">
            <GroupProfileHeader
              formik={formikBag}
              isEditGroupPage={isEditGroupPage}
            />
            <Choose>
              <When condition={loading}>
                <ShortLoader className="TradingEngineGroupProfile__loader" />
              </When>
              <Otherwise>
                <GroupCommonForm isEditGroupPage={isEditGroupPage} />
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
    createGroup: CreateGroupMutation,
    editGroup: EditGroupMutation,
    groupQuery: GroupQuery,
  }),
  withNotifications,
)(React.memo(TradingEngineGroupProfile));
