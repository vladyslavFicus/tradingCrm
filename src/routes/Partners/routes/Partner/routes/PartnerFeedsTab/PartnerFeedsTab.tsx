import React from 'react';
import { useParams } from 'react-router-dom';
import FeedsList from 'components/FeedsList';

const PartnerFeedsTab = () => {
  const { id: targetUuid } = useParams<{ id: string }>();

  return <FeedsList targetUUID={targetUuid} />;
};

export default React.memo(PartnerFeedsTab);
