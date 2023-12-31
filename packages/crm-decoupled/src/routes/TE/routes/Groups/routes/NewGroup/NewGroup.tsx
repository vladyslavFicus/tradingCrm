import React from 'react';
import I18n from 'i18n-js';
import { omit } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, FormikProps } from 'formik';
import { Config, Utils, notify, Types, parseErrors } from '@crm/common';
import NewGroupProfileHeader from '../../components/GroupProfileHeaderNew';
import GroupCommonForm from '../../components/GroupCommonForm';
import GroupPermissionsForm from '../../components/GroupPermissionsForm';
import GroupArchivingForm from '../../components/GroupArchivingForm';
import GroupMarginsForm from '../../components/GroupMarginsForm';
import GroupSecuritiesGrid from '../../components/GroupSecuritiesGrid';
import GroupSymbolsGrid from '../../components/GroupSymbolsGrid';
import { ArchiveMaxBalance, DefaultLeverage, FormValues } from '../../types';
import { groupNamePattern } from '../../constants';
import { useCreateGroupMutation } from './graphql/__generated__/CreateGroupMutation';
import './NewGroup.scss';

const validator = Utils.createValidator(
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

const NewGroup = () => {
  const navigate = useNavigate();
  const [createGroup] = useCreateGroupMutation();

  const handleSubmit = async (values: FormValues) => {
    try {
      await createGroup({
        variables: {
          args: {
            ...values,
            // For BE groupSecurities need only security ID
            groupSecurities: values?.groupSecurities?.map(groupSecurity => ({
              ...omit(groupSecurity, 'security'),
              securityId: groupSecurity.security.id,
            })) || [],
            groupSymbols: values?.groupSymbols?.map(groupSymbols => ({
              ...omit(groupSymbols, 'securityId'),
            })) || [],
          },
        },
      });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.GROUP.GROUP'),
        message: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.CREATE.SUCCESS'),
      });

      navigate(`/trading-engine/groups/${values.groupName}`);
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.GROUP.GROUP'),
        message: error.error === 'error.group.already.exists'
          ? I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.CREATE.FAILED_EXIST')
          : I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.CREATE.FAILED'),
      });
    }
  };

  return (
    <div className="NewGroup">
      <Formik
        initialValues={{
          accountCreationAllowed: true,
          groupName: '',
          description: '',
          currency: Config.getBrand().currencies.base,
          defaultLeverage: DefaultLeverage.LEVERAGE_100,
          useSwap: true,
          hedgeProhibited: false,
          archivePeriodDays: 0,
          archiveMaxBalance: ArchiveMaxBalance.MAX_0,
          archivationEnabled: false,
          enabled: true,
          marginCallLevel: 50,
          stopoutLevel: 30,
          groupSecurities: [],
          groupSymbols: [],
        }}
        validate={validator}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formikBag: FormikProps<FormValues>) => (
          <Form>
            <NewGroupProfileHeader formik={formikBag} />
            <GroupCommonForm formik={formikBag} />
            <GroupPermissionsForm formik={formikBag} />
            <GroupArchivingForm formik={formikBag} />
            <GroupMarginsForm formik={formikBag} />
            <GroupSecuritiesGrid formik={formikBag} />
            <GroupSymbolsGrid formik={formikBag} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(NewGroup);
