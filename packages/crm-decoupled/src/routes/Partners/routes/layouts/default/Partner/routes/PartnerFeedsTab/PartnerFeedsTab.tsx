import React from 'react';
import { useParams } from 'react-router-dom';
import FeedsList from 'components/FeedsList';

const PartnerFeedsTab = () => {
  const targetUuid = useParams().id as string;

  return <FeedsList targetUUID={targetUuid} />;
};

export default React.memo(PartnerFeedsTab);
