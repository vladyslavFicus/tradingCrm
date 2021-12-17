import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form } from 'formik';
import { createValidator } from 'utils/validator';
import GroupProfileHeader from './components/GroupProfileHeader';
import GroupCommonForm from './components/GroupCommonForm';
import GroupPermissionsForm from './components/GroupPermissionsForm';
import GroupArchivingForm from './components/GroupArchivingForm';
import GroupMarginsForm from './components/GroupMarginsForm';
import GroupSecuritiesGrid from './components/GroupSecuritiesGrid';
import GroupSymbolsGrid from './components/GroupSymbolsGrid';
import {
  ArchivePeriod,
  ArchiveMaxBalance,
  Currency,
  DefaultLeverage,
} from './types';
import './TradingEngineGroupProfile.scss';

const TradingEngineGroupProfile = () => {
  const handleSubmit = () => { };

  return (
    <div className="TradingEngineGroupProfile">
      <GroupProfileHeader />

      <Formik
        enableReinitialize
        initialValues={{
          enable: true,
          groupName: '', // non-editable field
          description: '',
          currency: Currency.USD, // non-editable field
          defaultLeverage: DefaultLeverage.LEVERAGE_100,
          useSwap: true,
          hedgeProhibited: false,
          archivePeriod: ArchivePeriod.DISABLED,
          archiveMaxBalance: ArchiveMaxBalance.MAX_0,
          marginCallLevel: 50,
          stopoutLevel: 30,
          groupSecurities: [],
          groupSymbols: [],
        }}
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
        onSubmit={handleSubmit}
      >
        {formikBag => (
          <Form className="TradingEngineGroupProfile__form">
            <GroupCommonForm />
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

export default React.memo(TradingEngineGroupProfile);
