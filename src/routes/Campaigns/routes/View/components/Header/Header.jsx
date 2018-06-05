import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';
import Uuid from '../../../../../../components/Uuid';
import StatusDropDown from '../../../../components/StatusDropDown';
import { actions, statusActions } from '../../../../../../constants/bonus-campaigns';
import FileUpload from '../../../../../../components/FileUpload';
import { statuses, targetTypes } from '../../../../../../constants/campaigns';
import ActionsDropDown from '../../../../../../components/ActionsDropDown';
import Permissions from '../../../../../../utils/permissions';
import permissions from '../../../../../../config/permissions';

const cloneCampaignPermission = new Permissions([permissions.CAMPAIGNS.CLONE]);

class Header extends Component {
  static propTypes = {
    activateMutation: PropTypes.func.isRequired,
    cancelMutation: PropTypes.func.isRequired,
    uploadPlayersFile: PropTypes.func.isRequired,
    removeAllPlayers: PropTypes.func.isRequired,
    cloneCampaign: PropTypes.func.isRequired,
    data: PropTypes.newBonusCampaignEntity.isRequired,
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  handleChangeCampaignState = async ({ id: campaignUUID, action, reason }) => {
    const {
      activateMutation,
      cancelMutation,
    } = this.props;

    switch (action) {
      case actions.ACTIVATE:
        await activateMutation({
          variables: {
            campaignUUID,
          },
        });
        break;
      case actions.CANCEL:
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

  handleUploadFile = async (errors, file) => {
    const { data: { uuid }, uploadPlayersFile } = this.props;
    const action = await uploadPlayersFile(uuid, file);

    if (action) {
      this.context.addNotification({
        level: action.error ? 'error' : 'success',
        title: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.ADD_PLAYERS'),
        message: `${I18n.t('COMMON.ACTIONS.UPLOADED')} ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    }
  };

  handleRemoveAllPlayers = async () => {
    const { data: { uuid: campaignUUID }, removeAllPlayers } = this.props;
    const response = await removeAllPlayers({ variables: { campaignUUID } });

    if (response) {
      this.context.addNotification({
        level: response.error ? 'error' : 'success',
        title: I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.REMOVE_ALL_PLAYERS.TITLE'),
        message: response.error
          ? I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.REMOVE_ALL_PLAYERS.ERROR')
          : I18n.t('CAMPAIGNS.VIEW.NOTIFICATIONS.REMOVE_ALL_PLAYERS.SUCCESS'),
      });
    }
  };

  render() {
    const {
      data: {
        name: campaignName,
        targetType,
        uuid,
        creationDate,
        authorUUID,
        state,
      },
      cloneCampaign,
      data,
    } = this.props;

    const { permissions: currentPermissions } = this.context;

    const availableStatusActions = data && statusActions[state]
      ? statusActions[state]
      : [];
    const allowUpload = [statuses.DRAFT, statuses.PENDING, statuses.ACTIVE].indexOf(state) !== -1
      && targetType === targetTypes.TARGET_LIST;

    return (
      <Fragment>
        <div className="panel-heading-row">
          <div className="panel-heading-row__info">
            <div className="panel-heading-row__info-title" id="campaign-name">
              {campaignName}
            </div>
            <div className="panel-heading-row__info-ids">
              <span className="short__uuid">
                <Uuid uuid={uuid} uuidPrefix="CA" />
              </span>
            </div>
          </div>
          <div className="col-auto panel-heading-row__actions">
            <If condition={allowUpload}>
              <span>
                <button
                  className="btn btn-sm btn-default-outline margin-right-10"
                  onClick={this.handleRemoveAllPlayers}
                >
                  {I18n.t('CAMPAIGNS.REMOVE_PLAYERS.BUTTON')}
                </button>

                <FileUpload
                  label={I18n.t('CAMPAIGNS.VIEW.BUTTON.ADD_PLAYERS')}
                  allowedTypes={['text/csv', 'application/vnd.ms-excel']}
                  onChosen={this.handleUploadFile}
                  className="btn btn-info-outline"
                />
              </span>
            </If>
            <span className="margin-left-10">
              <ActionsDropDown
                items={[
                  {
                    label: I18n.t('BONUS_CAMPAIGNS.OPTIONS.CLONE_LABEL'),
                    onClick: cloneCampaign,
                    visible: cloneCampaignPermission.check(currentPermissions),
                  },
                ]}
              />
            </span>
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
