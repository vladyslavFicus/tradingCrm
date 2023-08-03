import React from 'react';
import { Partner } from '__generated__/types';
import PartnerPersonalInfoForm from './components/PartnerPersonalInfoForm';
import PartnerScheduleGrid from './components/PartnerSchedule';
import './PartnerProfileTab.scss';

type Props = {
  partner: Partner,
  onRefetch: () => void,
};

const PartnerProfileTab = (props: Props) => {
  const { partner, onRefetch } = props;

  return (
    <div className="PartnerProfileTab">
      <PartnerPersonalInfoForm partner={partner} onRefetch={onRefetch} />

      <PartnerScheduleGrid partner={partner} onRefetch={onRefetch} />
    </div>
  );
};

export default PartnerProfileTab;
