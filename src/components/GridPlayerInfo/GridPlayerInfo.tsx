import React from 'react';
import MiniProfile from 'components/MiniProfile';
import Uuid from 'components/Uuid';
import './GridPlayerInfo.scss';

type Profile = {
  uuid: string,
  fullName: string | null,
  languageCode: string | null,
  firstName?: string,
  lastName?: string,
}

type Props = {
  id?: string,
  profile: Profile | null,
  mainInfoClassName?: string,
}

const GridPlayerInfo = (props: Props) => {
  if (!props.profile) return <>&mdash;</>;

  const {
    id,
    profile,
    mainInfoClassName = 'GridPlayerInfo__text-primary',
  } = props;

  const { uuid, fullName, firstName, lastName, languageCode } = profile;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    window.open(`/clients/${uuid}/profile`, '_blank');
  };

  return (
    <div className="GridPlayerInfo">
      <div className={mainInfoClassName} onClick={handleClick}>
        {fullName || `${firstName} ${lastName}`}
      </div>

      <div
        className="GridPlayerInfo__text-secondary"
        id={`${id ? `${id}-` : ''}players-list-${uuid}-additional`}
      >
        <MiniProfile id={uuid} type="client">
          <Uuid uuid={uuid} />
        </MiniProfile>

        <If condition={!!languageCode}>
          <span> - {languageCode}</span>
        </If>
      </div>
    </div>
  );
};

export default React.memo(GridPlayerInfo);
