import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { omit } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Formik, Form, FormikProps } from 'formik';
import { parseErrors } from 'apollo';
import { getBrand } from 'config';
import { withNotifications } from 'hoc';
import { Notify, LevelType } from 'types/notify';
import { createValidator } from 'utils/validator';
import GroupProfileHeader from '../../components/GroupProfileHeader';
import GroupCommonForm from '../../components/GroupCommonForm';
import GroupPermissionsForm from '../../components/GroupPermissionsForm';
import GroupArchivingForm from '../../components/GroupArchivingForm';
import GroupMarginsForm from '../../components/GroupMarginsForm';
import GroupSecuritiesGrid from '../../components/GroupSecuritiesGrid';
import GroupSymbolsGrid from '../../components/GroupSymbolsGrid';
import { ArchivePeriodDays, ArchiveMaxBalance, DefaultLeverage, FormValues } from '../../types';
import { groupNamePattern } from '../../constants';
import { useCreateGroupMutation } from './graphql/__generated__/CreateGroupMutation';
import './NewGroup.scss';

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

const NewGroup = ({ notify }: Props) => {
  const history = useHistory();
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
            groupMargins: values?.groupMargins?.map(groupMargin => ({
              ...omit(groupMargin, 'securityId'),
            })) || [],
          },
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.GROUP.GROUP'),
        message: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.CREATE.SUCCESS'),
      });

      history.push(`/trading-engine/groups/${values.groupName}`);
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
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
        }}
        validate={validator}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formikBag: FormikProps<FormValues>) => (
          <Form>
            <GroupProfileHeader formik={formikBag} />
            <GroupCommonForm formik={formikBag} />
            <GroupPermissionsForm />
            <GroupArchivingForm />
            <GroupMarginsForm />
            <GroupSecuritiesGrid formik={formikBag} />
            <GroupSymbolsGrid formik={formikBag} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(NewGroup);
