import React from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import { Button } from 'components';
import { LoginLock, Profile } from '__generated__/types';
import ActionsDropDown from 'components/ActionsDropDown';
import Uuid from 'components/Uuid';
import NoteAction from 'components/Note/NoteAction';
import useClientHeader from 'routes/Clients/routes/Client/components/hooks/useClientHeader';
import { targetTypes } from 'constants/note';
import './ClientHeader.scss';

type Props = {
  profile: Profile,
};

const ClientHeader = (props: Props) => {
  const {
    profile: {
      age,
      uuid,
      status,
      lastName,
      firstName,
      profileVerified,
    },
  } = props;

  const {
    locks,
    items,
    allowAddNote,
    allowCreateCallback,
    runningReloadAnimation,
    handleOpenAddCallbackModal,
    handleUnlockClientLogin,
    handleReloadClick,
  } = useClientHeader({ uuid, firstName, lastName });

  return (
    <div className="ClientHeader">
      <div className="ClientHeader__topic">
        <div className="ClientHeader__title">
          <span>{`${firstName} ${lastName}`}</span>

          <span>{` (${age || '?'}) `}</span>

          <If condition={profileVerified}>
            <i className="fa fa-check ClientHeader__title-verified" />
          </If>
        </div>

        <If condition={!!uuid}>
          <div className="ClientHeader__uuid">
            <Uuid uuid={uuid} uuidPrefix="PL" />
          </div>
        </If>
      </div>

      <div className="ClientHeader__actions">
        <If condition={allowCreateCallback}>
          <Button
            small
            tertiary
            className="ClientHeader__action"
            data-testid="ClientHeader-addCallbackButton"
            onClick={handleOpenAddCallbackModal}
          >
            {I18n.t('CLIENT_PROFILE.CALLBACKS.ADD_CALLBACK')}
          </Button>
        </If>

        <If condition={Utils.isMaxLoginAttemptReached(locks as LoginLock) && status?.type !== 'BLOCKED'}>
          <Button
            className="ClientHeader__action"
            data-testid="ClientHeader-unlockButton"
            onClick={handleUnlockClientLogin}
            tertiary
            small
          >
            {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.UNLOCK')}
          </Button>
        </If>

        <If condition={allowAddNote}>
          <NoteAction
            playerUUID={uuid}
            targetUUID={uuid}
            targetType={targetTypes.PLAYER}
            placement="bottom-end"
          >
            <Button
              data-testid="ClientHeader-addNoteButton"
              className="ClientHeader__action"
              tertiary
              small
            >
              {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.ADD_NOTE')}
            </Button>
          </NoteAction>
        </If>

        <Button
          data-testid="ClientHeader-refreshButton"
          className="ClientHeader__action"
          onClick={handleReloadClick}
          tertiary
          small
        >
          <i
            className={classNames('fa fa-refresh ClientHeader__icon', {
              'ClientHeader__icon--spin': runningReloadAnimation,
            })}
          />
        </Button>

        <ActionsDropDown
          className="ClientHeader__action"
          classNameMenu="dropdown-over-sticky"
          items={items}
        />
      </div>
    </div>
  );
};

export default React.memo(ClientHeader);
