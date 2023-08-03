import { useCallback, useMemo, useState } from 'react';
import { size } from 'lodash';
import parseJson from 'utils/parseJson';
import { Details } from '../types';

type Props = {
  details?: string | null,
  targetUuid: string,
  authorUuid: string,
  authorFullName: string,
}

type UseFeedItem = {
  handleToggleClick: () => void,
  hasInformation: boolean,
  author: string,
  letter: string,
  isOpen: boolean,
  parsedDetails: Details,
};

const useFeedItem = (props: Props): UseFeedItem => {
  const {
    details,
    targetUuid,
    authorUuid,
    authorFullName,
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggleClick = useCallback(() => setIsOpen(prevIsOpen => !prevIsOpen), []);

  const parsedDetails = useMemo(() => (typeof details === 'string' ? parseJson(details) : details as any), [details]);
  const hasInformation = size(parsedDetails) > 0;

  let author = 'system';
  let letter = 's';

  if (authorUuid && authorFullName) {
    author = authorUuid === targetUuid ? 'me' : 'someone';
    letter = authorFullName.split(' ').splice(0, 2).map(([word]) => word).join('');
  }

  return {
    hasInformation,
    author,
    letter,
    isOpen,
    parsedDetails,
    handleToggleClick,
  };
};

export default useFeedItem;
