import React from 'react';
import usePartnersList from 'routes/Partners/routes/hooks/usePartnersList';
import PartnersHeader from './components/PartnersHeader/PartnersHeader';
import PartnersGridFilter from './components/PartnersGridFilter';
import PartnersGrid from './components/PartnersGrid';
import './PartnersList.scss';

const PartnersList = () => {
  const {
    totalElements,
    selectedUuids,
    selected,
    selectAll,
    content,
    loading,
    last,
    handleRefetch,
    handleFetchMore,
    handleSort,
    handleSelect,
  } = usePartnersList();

  return (
    <div className="PartnersList">
      <PartnersHeader
        totalElements={totalElements}
        selected={selected}
        onRefetch={handleRefetch}
        uuids={selectedUuids}
        selectAll={selectAll}
      />

      <PartnersGridFilter onRefetch={handleRefetch} />

      <PartnersGrid
        content={content}
        loading={loading}
        totalElements={totalElements}
        last={last}
        onFetchMore={handleFetchMore}
        onSort={handleSort}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default React.memo(PartnersList);
