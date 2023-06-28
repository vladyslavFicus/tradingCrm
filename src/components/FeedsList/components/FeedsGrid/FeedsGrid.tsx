import React, { ReactNode } from 'react';
import { Feed } from '__generated__/types';
import ListView from 'components/ListView/index';
import FeedItem from 'components/FeedItem';
import './FeedsGrid.scss';

type Props = {
  content: Array<Feed>,
  loading: boolean,
  last: boolean,
  onLoadMore: () => void,
};

const FeedsGrid = (props: Props) => {
  const { content, loading, last, onLoadMore } = props;

  return (
    <div className="FeedsGrid">
      <ListView
        content={content}
        loading={loading}
        last={last}
        render={(item: ReactNode) => <FeedItem data={item as Feed} />}
        onLoadMore={onLoadMore}
      />
    </div>
  );
};

export default React.memo(FeedsGrid);
