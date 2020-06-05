import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import permissions from 'config/permissions';
import { Button } from 'components/UI';
import NotePopover from 'components/NotePopover';
import PromoteLeadModal from 'components/PromoteLeadModal';
import PermissionContent from 'components/PermissionContent';
import Uuid from 'components/Uuid';
import ProfileHeaderPlaceholder from 'components/ProfileHeaderPlaceholder';
import ConvertedBy from '../../../../components/ConvertedBy';
import { leadStatuses, statuses } from '../../../../constants';

class Header extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    modals: PropTypes.shape({
      promoteLeadModal: PropTypes.modalType,
    }).isRequired,
  };

  static defaultProps = {
    data: {},
  };

  handlePromoteLead = () => {
    const {
      modals: { promoteLeadModal },
      data: { uuid },
    } = this.props;

    promoteLeadModal.show({ uuid });
  };

  render() {
    const {
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
    } = this.props;

    return (
      <div>
        <div className="row no-gutters panel-heading-row">
          <ProfileHeaderPlaceholder ready={!loading}>
            <div className="panel-heading-row__info">
              <div className="panel-heading-row__info-title">
                {`${name} ${surname}`}
              </div>
              <span className="panel-heading-row__info-ids">
                {uuid && <Uuid uuid={uuid} uuidPrefix="LE" />} {country && ` - ${country}`}
              </span>
            </div>
          </ProfileHeaderPlaceholder>
          <div className="col-auto panel-heading-row__actions">
            <PermissionContent permissions={permissions.NOTES.ADD_NOTE}>
              <NotePopover
                playerUUID={uuid}
                targetUUID={uuid}
                targetType={targetTypes.LEAD}
              >
                <Button small commonOutline>
                  {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.ADD_NOTE')}
                </Button>
              </NotePopover>
            </PermissionContent>
            <If condition={status && status !== statuses.CONVERTED}>
              <Button
                small
                commonOutline
                className="ml-3"
                onClick={this.handlePromoteLead}
              >
                {I18n.t('LEAD_PROFILE.HEADER.PROMOTE_TO_CLIENT')}
              </Button>
            </If>
          </div>
        </div>
        <div className="layout-quick-overview">
          <div className="header-block header-block_account">
            <div className="dropdown-tab">
              <div className="header-block-title">{I18n.t('COMMON.ACCOUNT_STATUS')}</div>
              <If condition={!loading}>
                <div className={`header-block-middle text-uppercase ${(status) ? leadStatuses[status].color : null}`}>
                  {(status) ? I18n.t(leadStatuses[status].label) : null}
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
          <div className="header-block header-block-inner">
            <div className="header-block-title">{I18n.t('LEAD_PROFILE.HEADER.REGISTERED')}</div>
            <If condition={registrationDate}>
              <div>
                <div className="header-block-middle">
                  {moment.utc(registrationDate).local().fromNow()}
                </div>
                <div className="header-block-small">
                  on {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
                </div>
              </div>
            </If>
          </div>
        </div>
      </div>
    );
  }
}

export default withModals({
  promoteLeadModal: PromoteLeadModal,
})(Header);
