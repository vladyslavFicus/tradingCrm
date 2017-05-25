import React, { Component, PropTypes } from 'react';
import Tabs from '../../../../../components/Tabs';
import { bonusCampaignTabs } from '../../../../../config/menu';
import Header from '../components/Header';
import Information from '../components/Information';

class ViewLayout extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };
  state = {
    informationShown: true,
  };

  handleToggleInformationBlock = () => {
    this.setState({ informationShown: !this.state.informationShown });
  };

  render() {
    const { informationShown } = this.state;
    const {
      data: {
        creationDate,
        campaignName,
        campaignUUID,
        targetType,
        totalSelectedPlayers,
        totalOptInPlayers,
        authorUUID,
        grantedSum,
        grantedTotal,
        currency,
        startDate,
        endDate,
        conversionPrize,
        capping,
        wagerWinMultiplier,
        campaignRatio,
        eventsType,
      },
    } = this.props;

    return (
      <div className="player panel profile-layout">
        <div className="container-fluid">
          <div className="profile-layout-heading">
            <Header
              data={{
                creationDate,
                campaignName,
                campaignUUID,
                targetType,
                authorUUID,
                grantedSum,
                grantedTotal,
                currency,
              }}
            />

            <div className="hide-details-block">
              <div className="hide-details-block_arrow" />
              <div className="hide-details-block_text" onClick={this.handleToggleInformationBlock}>
                {informationShown ? 'Hide details' : 'Show details'}
              </div>
              <div className="hide-details-block_arrow" />
            </div>

            {
              informationShown &&
              <Information
                data={{
                  targetType,
                  totalSelectedPlayers,
                  totalOptInPlayers,
                  startDate,
                  endDate,
                  conversionPrize,
                  currency,
                  capping,
                  wagerWinMultiplier,
                  campaignRatio,
                  eventsType,
                }}
              />
            }
          </div>
        </div>
      </div>

    );
  }
}

export default ViewLayout;
