import React, { Fragment, ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ShortPreloader from 'components/ShortLoader';
import NotFoundContent from 'components/NotFoundContent';
import { Feed } from '__generated__/types';

type Props = {
  render: (feed: Feed, key: number) => React.ReactNode,
  dataSource: Array<React.ReactNode>,
  onPageChange: (eventKey: number) => void,
  loading: boolean,
  showNoResults: boolean,
  last?: boolean,
  activePage?: number,
  totalPages?: number,
};

const ListView = (props: Props) => {
  const {
    render,
    dataSource,
    onPageChange,
    totalPages = 0,
    activePage = 0,
    showNoResults,
    last = true,
    loading,
  } = props;

  const hasMore = totalPages && activePage ? totalPages > activePage : !last;

  const handlePageChange = (eventKey: number) => {
    if (typeof onPageChange === 'function' && hasMore) {
      onPageChange(eventKey);
    }
  };

  const renderItem = (feed: Feed, key: number): ReactNode => {
    if (typeof render !== 'function') {
      return null;
    }

    const content = render(feed, key);

    return (
      <Fragment key={key}>
        {content}
      </Fragment>
    );
  };

  const items = dataSource.map((feed, key) => renderItem(feed as Feed, key));

  if (showNoResults) {
    return <NotFoundContent />;
  }

  return (
    <Choose>
      <When condition={loading}>
        <ShortPreloader />
      </When>

      <Otherwise>
        <InfiniteScroll
          loadMore={() => handlePageChange(activePage + 1)}
          hasMore={!loading && hasMore}
          loader={<ShortPreloader className="Table--loader" />}
        >
          {items}
        </InfiniteScroll>
      </Otherwise>
    </Choose>
  );
};

export default React.memo(ListView);
