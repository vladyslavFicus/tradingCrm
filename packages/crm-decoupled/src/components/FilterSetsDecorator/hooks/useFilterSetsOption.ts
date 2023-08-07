import React, { useCallback } from 'react';

type Props = {
  uuid: string,
  favourite: boolean | null | undefined,
  selectFilterSet: ((uuid: string) => void) | undefined,
  updateFavouriteFilterSet: (uuid: string, favourite: boolean) => void,
};

type UseFilterSetsOption = {
  handleOptionClick: () => void,
  handleIconClick: (event: React.MouseEvent<HTMLElement>) => void,
};

const useFilterSetsOption = (props: Props): UseFilterSetsOption => {
  const { uuid, favourite, selectFilterSet, updateFavouriteFilterSet } = props;

  const handleOptionClick = useCallback(() => {
    if (selectFilterSet) {
      selectFilterSet(uuid);
    }
  }, [uuid, selectFilterSet]);

  const handleIconClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    updateFavouriteFilterSet(uuid, !favourite);
  }, [uuid, favourite, updateFavouriteFilterSet]);

  return {
    handleOptionClick,
    handleIconClick,
  };
};

export default useFilterSetsOption;
