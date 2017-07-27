import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Collapse } from 'reactstrap';
import Tabs from '../../../../../components/Tabs';
import { bonusCampaignTabs } from '../../../../../config/menu';
import PropTypes from '../../../../../constants/propTypes';
import Header from '../components/Header';
import Information from '../components/Information';

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
    uploadFile: PropTypes.func.isRequired,
  };
  static defaultProps = {
    availableStatusActions: [],
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = {
    informationShown: true,
  };

  handleToggleInformationBlock = () => {
    this.setState({ informationShown: !this.state.informationShown });
  };

  handleUploadFile = async (errors, file) => {
    const { params, uploadFile } = this.props;
    const action = await uploadFile(params.id, file);

    if (action) {
      this.context.addNotification({
        level: action.error ? 'error' : 'success',
        title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.ADD_PLAYERS'),
        message: `${I18n.t('COMMON.ACTIONS.UPLOADED')} ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    }
  };

  render() {
    const { informationShown } = this.state;
    const {
      data: bonusCampaignData,
      location,
      params,
      children,
      availableStatusActions,
      onChangeCampaignState,
    } = this.props;

    return (
      <div className="player panel profile-layout">
        <div className="profile-layout-heading">
          <Header
            onChangeCampaignState={onChangeCampaignState}
            availableStatusActions={availableStatusActions}
            data={bonusCampaignData}
            onUpload={this.handleUploadFile}
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
            <Information
              data={bonusCampaignData}
            />
          </Collapse>
        </div>

        <div className="panel profile-user-content">
          <div className="panel-body">
            <div className="nav-tabs-horizontal">
              <Tabs
                items={bonusCampaignTabs}
                location={location}
                params={params}
              />
              <div className="padding-vertical-20">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default ViewLayout;
