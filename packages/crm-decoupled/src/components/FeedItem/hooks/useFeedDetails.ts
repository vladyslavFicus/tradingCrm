import { useCallback } from 'react';
import { Detail } from '../types';

const useFeedDetails = () => {
  const formatTypeChangedElements = useCallback((array: Array<Detail>, type: string) => array
    .filter(({ changeType }) => changeType === type)
    .map(({ value }) => ({ value, type })), []);

  const getChangedElements = useCallback((array: Array<Detail>) => [
    ...formatTypeChangedElements(array, 'REMOVED'),
    ...formatTypeChangedElements(array, 'ADDED'),
  ], [formatTypeChangedElements]);

  return {
    getChangedElements,
  };
};

export default useFeedDetails;
