import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';
import Uuid from '../../../../../../components/Uuid';
import StatusDropDown from '../../../../components/StatusDropDown';
import { actions as campaignActions, statusActions } from '../../../../../../constants/bonus-campaigns';
import { statuses, targetTypes } from '../../../../../../constants/campaigns';
import ActionsDropDown from '../../../../../../components/ActionsDropDown';
import Permissions from '../../../../../../utils/permissions';
import permissions from '../../../../../../config/permissions';
import UploadPlayersButton from './UploadPlayersButton';
import { actions as uploadPlayersActions } from './UploadPlayersButton/constants';

const cloneCampaignPermission = new Permissions([permissions.CAMPAIGNS.CLONE]);
const uploadPlayersPermission = new Permissions([permissions.CAMPAIGNS.UPLOAD_PLAYERS]);
const resetPlayersPermission = new Permissions([permissions.CAMPAIGNS.UPLOAD_RESET_PLAYERS]);
const softResetPlayersPermission = new Permissions([permissions.CAMPAIGNS.UPLOAD_SOFT_RESET_PLAYERS]);

class Header extends Component {
  static propTypes = {
    activateMutation: PropTypes.func.isRequired,
    cancelMutation: PropTypes.func.isRequired,
    removeAllPlayers: PropTypes.func.isRequired,
    cloneCampaign: PropTypes.func.isRequired,
    data: PropTypes.newBonusCampaignEntity.isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  get isAllowPlayersUpload() {
    const { data: { targetType, state } } = this.props;

    return [statuses.DRAFT, statuses.PENDING, statuses.ACTIVE].indexOf(state) !== -1
      && targetType === targetTypes.TARGET_LIST;
  }

  get isAllowPlayersReset() {
    return this.props.data.state === statuses.ACTIVE;
  }

  get availableStatusActions() {
    const { data: { state }, data } = this.props;

    return data && statusActions[state] ? statusActions[state] : [];
  }

  get availableUploadActions() {
    const { isAllowPlayersUpload, isAllowPlayersReset } = this;

    const actions = [];

    if (isAllowPlayersUpload && uploadPlayersPermission) {
      actions.push(uploadPlayersActions.UPLOAD_PLAYERS);
    }

    if (isAllowPlayersReset) {
      if (resetPlayersPermission) {
        actions.push(uploadPlayersActions.RESET_PLAYERS);
      }
      if (softResetPlayersPermission) {
        actions.push(uploadPlayersActions.SOFT_RESET_PLAYERS);
      }
    }

    return actions;
  }

  handleChangeCampaignState = async ({ id: campaignUUID, action, reason }) => {
    const {
      activateMutation,
      cancelMutation,
    } = this.props;

    switch (action) {
      case campaignActions.ACTIVATE:
        await activateMutation({
          variables: {
            campaignUUID,
          },
        });
        break;
      case campaignActions.CANCEL:
        await cancelMutation({
          variables: {
            campaignUUID,
            reason,
          },
        });
        break;
      default:
        break;
    }
  };

  handleRemoveAllPlayers = async () => {
    const {
      modals: { confirmActionModal },
      data: { uuid: campaignUUID },
      removeAllPlayers,
      notify,
    } = this.props;

    const response = await removeAllPlayers({ variables: { campaignUUID } });

    if (response) {
      confirmActionModal.hide();

      notify({
        level: response.error ? 'error' : 'success',
        title: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.REMOVE_ALL_PLAYERS.TITLE'),
        message: response.error
          ? I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.REMOVE_ALL_PLAYERS.ERROR')
          : I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.REMOVE_ALL_PLAYERS.SUCCESS'),
      });
    }
  };

  handleRemoveAllPlayersClick = () => {
    const { modals: { confirmActionModal } } = this.props;

    confirmActionModal.show({
      onSubmit: this.handleRemoveAllPlayers,
      modalTitle: I18n.t('CAMPAIGNS.REMOVE_PLAYERS.BUTTON'),
      actionText: I18n.t('CAMPAIGNS.REMOVE_PLAYERS.MODAL_TEXT'),
    });
  };

  render() {
    const {
      data: {
        name: campaignName,
        uuid,
        creationDate,
        authorUUID,
      },
      cloneCampaign,
      data,
    } = this.props;

    const {
      isAllowPlayersUpload,
      availableUploadActions,
      availableStatusActions,
    } = this;

    const { permissions: currentPermissions } = this.context;

    return (
      <Fragment>
        <div className="panel-heading-row">
          <div className="panel-heading-row__info">
            <div className="panel-heading-row__info-title" id="campaign-name">
              {campaignName}
            </div>
            <div className="panel-heading-row__info-ids">
              <Uuid uuid={uuid} uuidPrefix="CA" />
            </div>
          </div>
          <div className="panel-heading-row__actions">
            <If condition={isAllowPlayersUpload}>
              <button
                type="button"
                className="btn btn-default-outline btn-sm mr-2"
                onClick={this.handleRemoveAllPlayersClick}
              >
                {I18n.t('CAMPAIGNS.REMOVE_PLAYERS.BUTTON')}
              </button>
            </If>
            <UploadPlayersButton
              actions={availableUploadActions}
              campaignUuid={uuid}
              className="mx-2"
            />
            <ActionsDropDown
              items={[
                {
                  label: I18n.t('BONUS_CAMPAIGNS.OPTIONS.CLONE_LABEL'),
                  onClick: cloneCampaign,
                  visible: cloneCampaignPermission.check(currentPermissions),
                },
              ]}
            />
          </div>
        </div>
        <div className="layout-quick-overview">
          <div className="header-block header-block_account">
            <StatusDropDown
              onChange={this.handleChangeCampaignState}
              campaign={data}
              availableStatusActions={availableStatusActions}
            />
          </div>
          <div className="header-block">
            <div className="header-block-title">
              {I18n.t('CAMPAIGNS.VIEW.DETAILS.LABEL.CREATED')}
            </div>
            <div className="header-block-middle">
              {moment.utc(creationDate).local().fromNow()}
            </div>
            <div className="header-block-small">
              {I18n.t('COMMON.DATE_ON', {
                date: moment.utc(creationDate).local().format('DD.MM.YYYY'),
              })}
            </div>
            {
              authorUUID &&
              <div className="header-block-small">
                {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={authorUUID} />
              </div>
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Header;
