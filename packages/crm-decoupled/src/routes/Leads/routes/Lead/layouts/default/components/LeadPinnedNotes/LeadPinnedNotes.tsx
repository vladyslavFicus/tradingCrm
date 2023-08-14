import React from 'react';
import { Constants } from '@crm/common';
import PinnedNotes from 'components/Note/PinnedNotes';
import useLeadPinnedNotes from 'routes/Leads/routes/Lead/hooks/useLeadPinnedNotes';
import './LeadPinnedNotes.scss';

type Props = {
  uuid: string,
};

const LeadPinnedNotes = (props: Props) => {
  const { uuid } = props;

  const {
    allowViewNotes,
  } = useLeadPinnedNotes();

  return (
    <If condition={allowViewNotes}>
      <div className="LeadPinnedNotes">
        <PinnedNotes targetUUID={uuid} targetType={Constants.targetTypes.LEAD} />
      </div>
    </If>
  );
};

export default React.memo(LeadPinnedNotes);
