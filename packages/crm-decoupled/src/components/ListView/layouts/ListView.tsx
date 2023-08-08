import React, { Fragment, ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { ShortLoader } from 'components';
import NotFoundContent from 'components/NotFoundContent';

type Props = {
  content: Array<ReactNode>,
  loading: boolean,
  last: boolean,
  render: (item: ReactNode) => ReactNode,
  onLoadMore: () => void,
};

const ListView = (props: Props) => {
  const { content, loading, last, render, onLoadMore } = props;

  if (!loading && !content.length) {
    return <NotFoundContent />;
  }

  return (
    <Choose>
      <When condition={loading}>
        <ShortLoader />
      </When>

      <Otherwise>
        <InfiniteScroll
          loadMore={onLoadMore}
          hasMore={!loading && !last}
          loader={<ShortLoader key="loader" className="Table--loader" />}
        >
          {content.map((item, key) => <Fragment key={key}>{render(item)}</Fragment>)}
        </InfiniteScroll>
      </Otherwise>
    </Choose>
  );
};

export default React.memo(ListView);
