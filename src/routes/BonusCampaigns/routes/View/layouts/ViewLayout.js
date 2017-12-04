import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Collapse } from 'reactstrap';
import Tabs from '../../../../../components/Tabs';
import { bonusCampaignTabs } from '../../../../../config/menu';
import PropTypes from '../../../../../constants/propTypes';
import Header from '../components/Header';
import Information from '../components/Information';
import ConfirmActionModal from '../../../../../components/Modal/ConfirmActionModal';

const REMOVE_PLAYERS = 'remove-players-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class ViewLayout extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    location: PropTypes.object,
    children: PropTypes.node,
    data: PropTypes.bonusCampaignEntity.isRequired,
    availableStatusActions: PropTypes.arrayOf(PropTypes.object),
    onChangeCampaignState: PropTypes.func.isRequired,
    cloneCampaign: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    removeAllPlayers: PropTypes.func.isRequired,
  };
  static defaultProps = {
    availableStatusActions: [],
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    informationShown: true,
    modal: { ...modalInitialState },
  };

  handleOpenModal = (name, params) => {
    this.setState({
      modal: {
        name,
        params,
      },
    });
  };

  handleCloseModal = (cb) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  };

  handleToggleInformationBlock = () => {
    this.setState({ informationShown: !this.state.informationShown });
  };

  handleUploadFile = async (errors, file) => {
    const { params: { id: uuid }, uploadFile } = this.props;
    const action = await uploadFile(uuid, file);

    if (action) {
      this.context.addNotification({
        level: action.error ? 'error' : 'success',
        title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.ADD_PLAYERS'),
        message: `${I18n.t('COMMON.ACTIONS.UPLOADED')} ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    }
  };

  handleCloneCampaign = async (uuid) => {
    const action = await this.props.cloneCampaign(uuid);

    if (action) {
      this.context.addNotification({
        level: action.error ? 'error' : 'success',
        title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.CAMPAIGN_COPIED'),
        message: `${I18n.t('COMMON.NOTIFICATIONS.COPIED')} ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });

      if (!action.error) {
        this.context.router.push(`/bonus-campaigns/view/${action.payload.campaignUUID}/settings`);
      }
    }
  };

  handleRemovePlayersClick = () => {
    const { params: { id: uuid } } = this.props;

    this.handleOpenModal(REMOVE_PLAYERS, { uuid });
  };

  handleRemovePlayers = async () => {
    const { modal: { params: { uuid } } } = this.state;

    const action = await this.props.removeAllPlayers(uuid);
    this.handleCloseModal();

    if (action) {
      this.context.addNotification({
        level: action.error ? 'error' : 'success',
        title: I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.BUTTON'),
        message: action.error ? I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.ERROR_NOTIFICATION') :
          I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.SUCCESS_NOTIFICATION'),
      });
    }
  };

  render() {
    const { informationShown, modal } = this.state;
    const {
      data: bonusCampaignData,
      location,
      params,
      children,
      availableStatusActions,
      onChangeCampaignState,
    } = this.props;

    return (
      <div className="layout layout_not-iframe">
        <div className="layout-info">
          <Header
            onChangeCampaignState={onChangeCampaignState}
            availableStatusActions={availableStatusActions}
            data={bonusCampaignData}
            onUpload={this.handleUploadFile}
            cloneCampaign={this.handleCloneCampaign}
            removeAllPlayers={this.handleRemovePlayersClick}
          />

          <div className="hide-details-block">
            <div className="hide-details-block_divider" />
            <button
              className="hide-details-block_text btn-transparent"
              onClick={this.handleToggleInformationBlock}
            >
              {informationShown ?
                I18n.t('COMMON.DETAILS_COLLAPSE.HIDE') :
                I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')
              }
            </button>
            <div className="hide-details-block_divider" />
          </div>

          <Collapse isOpen={informationShown}>
            <Information data={bonusCampaignData} />
          </Collapse>
        </div>

        <div className="layout-content">
          <div className="nav-tabs-horizontal">
            <Tabs
              items={bonusCampaignTabs}
              location={location}
              params={params}
            />
            {children}
          </div>
        </div>
        {
          modal.name === REMOVE_PLAYERS &&
          <ConfirmActionModal
            onSubmit={this.handleRemovePlayers}
            onClose={this.handleCloseModal}
            modalTitle={I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.BUTTON')}
            actionText={I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.MODAL_TEXT')}
          />
        }
      </div>
    );
  }
}

export default ViewLayout;
