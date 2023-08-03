import React from 'react';
import MiniProfilePopover from 'components/MiniProfilePopover';
import Uuid from 'components/Uuid';
import useGridPlayerInfo, { Profile } from '../hooks/useGridPlayerInfo';
import './GridPlayerInfo.scss';

type Props = {
  id?: string,
  profile: Profile,
  mainInfoClassName?: string,
}

const GridPlayerInfo = (props: Props) => {
  if (!props.profile) return <>&mdash;</>;

  const {
    id,
    profile,
    mainInfoClassName = 'GridPlayerInfo__text-primary',
  } = props;

  const { uuid = '', fullName, firstName, lastName, languageCode } = profile as Profile || {};

  const { handleClick } = useGridPlayerInfo({ profile });

  return (
    <div className="GridPlayerInfo">
      <div className={mainInfoClassName} onClick={handleClick}>
        {fullName || `${firstName} ${lastName}`}
      </div>

      <div
        className="GridPlayerInfo__text-secondary"
        id={`${id ? `${id}-` : ''}players-list-${uuid}-additional`}
      >
        <MiniProfilePopover uuid={uuid} type="client">
          <Uuid uuid={uuid} />
        </MiniProfilePopover>

        <If condition={!!languageCode}>
          <span> - {languageCode}</span>
        </If>
      </div>
    </div>
  );
};

export default React.memo(GridPlayerInfo);
