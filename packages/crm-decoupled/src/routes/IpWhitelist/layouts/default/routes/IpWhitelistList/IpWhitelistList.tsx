import React from 'react';
import useIpWhitelistList from 'routes/IpWhitelist/hooks/useIpWhitelistList';
import IpWhitelistHeader from './components/IpWhitelistHeader';
import IpWhitelistFilter from './components/IpWhitelistGridFilter';
import IpWhitelistGrid from './components/IpWhitelistGrid';

const IpWhitelistList = () => {
  const {
    selected,
    setSelected,
    loading,
    refetch,
    content,
    last,
    totalElements,
    handleFetchMore,
    handleSort,
  } = useIpWhitelistList();

  return (
    <>
      <IpWhitelistHeader
        content={content}
        totalElements={totalElements}
        selected={selected}
        onRefetch={refetch}
      />

      <IpWhitelistFilter onRefetch={refetch} />

      <IpWhitelistGrid
        content={content}
        loading={loading}
        last={last}
        onRefetch={refetch}
        onFetchMore={handleFetchMore}
        onSort={handleSort}
        onSelect={setSelected}
      />
    </>
  );
};

export default React.memo(IpWhitelistList);
