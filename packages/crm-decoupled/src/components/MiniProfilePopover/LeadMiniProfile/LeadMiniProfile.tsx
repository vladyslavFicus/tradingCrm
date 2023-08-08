import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import ShortLoader from 'components/ShortLoader';
import { salesStatuses } from 'constants/salesStatuses'; // salesStatusesColor
import {
  MiniProfile,
  MiniProfileHeader,
  MiniProfileContent,
  MiniProfileContentItem,
} from '../components';
import { useLeadMiniProfileQuery } from './graphql/__generated__/LeadMiniProfileQuery';
import './LeadMiniProfile.scss';

type Props = {
  uuid: string,
};

const LeadMiniProfile = (props: Props) => {
  const { uuid } = props;

  const { data, loading } = useLeadMiniProfileQuery({
    variables: { uuid },
  });

  if (loading) {
    return (
      <div className="LeadMiniProfile__loader">
        <ShortLoader />
      </div>
    );
  }

  const {
    registrationDate,
    language,
    surname,
    country,
    name,
    acquisition,
  } = data?.lead || {};
  const { salesStatus, salesOperator } = acquisition || {};

  return (
    <MiniProfile className="LeadMiniProfile" status="dormant">
      <MiniProfileHeader
        type={I18n.t('MINI_PROFILE.LEADS.LEAD')}
        title={`${name} ${surname}`}
        uuid={uuid}
        uuidDesctiption={language || ''}
      />

      <MiniProfileContent>
        <MiniProfileContentItem
          label={I18n.t('MINI_PROFILE.LEADS.COUNTRY')}
          description={<CountryLabelWithFlag code={country || ''} height="14" languageCode={language || ''} />}
        />

        <MiniProfileContentItem
          label={I18n.t('MINI_PROFILE.LEADS.SALES')}
          heading={I18n.t(Utils.renderLabel(salesStatus || '', salesStatuses))}
          description={salesOperator?.fullName || ''}
        />

        <MiniProfileContentItem
          label={I18n.t('MINI_PROFILE.LEADS.LEAD_CREATED')}
          description={moment.utc(registrationDate).local().fromNow()}
        />
      </MiniProfileContent>
    </MiniProfile>
  );
};

export default React.memo(LeadMiniProfile);
