import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { statuses } from 'constants/leads';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import Uuid from 'components/Uuid';
import PropTypes from 'constants/propTypes';
import PopoverButton from 'components/PopoverButton';
import ProfileHeaderPlaceholder from 'components/ProfileHeaderPlaceholder';
import { leadStatuses } from '../../../../constants';
import ConvertedBy from '../../../../components/ConvertedBy';

const Header = ({
  data: {
    uuid,
    name,
    surname,
    country,
    registrationDate,
    status,
    statusChangedDate,
    convertedByOperatorUuid,
    convertedToClientUuid,
  },
  loading,
  onPromoteLeadClick,
  onAddNoteClick,
}) => (
  <div>
    <div className="row no-gutters panel-heading-row">
      <ProfileHeaderPlaceholder ready={!loading}>
        <div className="panel-heading-row__info">
          <div className="panel-heading-row__info-title">
            {`${name} ${surname}`}
          </div>
          <span className="panel-heading-row__info-ids">
            {!!uuid && <Uuid uuid={uuid} uuidPrefix="LE" />} {country && ` - ${country}`}
          </span>
        </div>
      </ProfileHeaderPlaceholder>
      <div className="col-auto panel-heading-row__actions">
        <PermissionContent permissions={permissions.NOTES.ADD_NOTE}>
          <PopoverButton
            id="header-add-note-button"
            className="btn btn-sm btn-default-outline"
            onClick={onAddNoteClick}
          >
            {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.ADD_NOTE')}
          </PopoverButton>
        </PermissionContent>
        <If condition={status && status !== statuses.CONVERTED}>
          <PopoverButton
            id="lead-promote-to-client"
            className="btn btn-sm btn-default-outline ml-3"
            onClick={onPromoteLeadClick}
            disabled={loading}
          >
            {I18n.t('LEAD_PROFILE.HEADER.PROMOTE_TO_CLIENT')}
          </PopoverButton>
        </If>
      </div>
    </div>
    <div className="layout-quick-overview">
      <div className="header-block header-block_account">
        <div className="dropdown-tab">
          <div className="header-block-title">{I18n.t('COMMON.ACCOUNT_STATUS')}</div>
          <If condition={!loading}>
            <div className={`header-block-middle text-uppercase ${leadStatuses[status].color}`}>
              {I18n.t(leadStatuses[status].label)}
            </div>
            <If condition={statusChangedDate}>
              <div className="header-block-small">
                {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangedDate).local().format('DD.MM.YYYY') })}
              </div>
            </If>
            <ConvertedBy
              convertedToClientUuid={convertedToClientUuid}
              convertedByOperatorUuid={convertedByOperatorUuid}
            />
          </If>
        </div>
      </div>
      <div className="header-block">
        <div className="header-block-title">{I18n.t('LEAD_PROFILE.HEADER.REGISTERED')}</div>
        {
          registrationDate
          && (
            <div>
              <div className="header-block-middle">
                {moment.utc(registrationDate).local().fromNow()}
              </div>
              <div className="header-block-small">
              on {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
              </div>
            </div>
          )
        }
      </div>
    </div>
  </div>
);

Header.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  onPromoteLeadClick: PropTypes.func.isRequired,
  onAddNoteClick: PropTypes.func.isRequired,
};

Header.defaultProps = {
  data: {},
};

export default Header;
