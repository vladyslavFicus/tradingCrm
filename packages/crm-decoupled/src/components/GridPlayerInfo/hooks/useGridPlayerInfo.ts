import React from 'react';

export type Profile = {
  uuid: string,
  fullName?: string | null,
  languageCode?: string | null,
  firstName?: string | null,
  lastName?: string | null,
} | null;

type Props = {
  profile: Profile,
}

const useGridPlayerInfo = (props: Props) => {
  const { profile } = props;
  const { uuid = '' } = profile as Profile || {};

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    window.open(`/clients/${uuid}`, '_blank');
  };

  return { handleClick };
};

export default useGridPlayerInfo;
