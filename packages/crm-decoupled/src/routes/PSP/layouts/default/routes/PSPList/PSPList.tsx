import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import { PaymentSystemProvider } from '__generated__/types';
import { Column, Table } from 'components/Table';
import usePSPList from 'routes/PSP/hooks/usePSPList';
import PSPFilter from './components/PSPFilter';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
import './PSPList.scss';

const PSPList = () => {
  const {
    content,
    refetch,
    loading,
    last,
    totalElements,
    updateFavorites,
    handleFavorite,
    handlePageChanged,
    handleSort,
  } = usePSPList();

  const renderColumnName = useCallback(({ paymentSystem }: PaymentSystemProvider) => (
    <div className="PSPList__cell-name">
      {paymentSystem}
    </div>
  ), []);

  const renderFavorite = useCallback(({ paymentSystem, isFavourite }: PaymentSystemProvider) => (
    <FavoriteStarIcon
      onClick={() => {
        if (updateFavorites) handleFavorite(paymentSystem, isFavourite);
      }}
      className={`
        PSPList__favourite
        ${isFavourite ? 'PSPList__favourite--active' : ''}
        ${!updateFavorites ? 'PSPList__favourite--deactivated' : ''}
      `}
    />
  ), [updateFavorites, handleFavorite]);

  return (
    <div className="PSPList">
      <div className="PSPList__header">
        <strong>{totalElements} </strong>

        {I18n.t('SETTINGS.PSP.HEADLINE')}
      </div>

      <PSPFilter onRefresh={refetch} />

      <Table
        stickyFromTop={125}
        items={content}
        loading={loading}
        onSort={handleSort}
        onMore={handlePageChanged}
        hasMore={!last}
        customClassNameRow="PSPList__table-row"
      >
        <Column
          sortBy="paymentSystem"
          header={I18n.t('SETTINGS.PSP.GRID.PSP')}
          render={renderColumnName}
        />

        <Column
          header={I18n.t('SETTINGS.PSP.GRID.FAVOURITE')}
          render={renderFavorite}
        />
      </Table>
    </div>
  );
};

export default React.memo(PSPList);
