import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import GridView, { GridColumn } from '../../../../../../components/GridView';
import Uuid from '../../../../../../components/Uuid';
import BonusCampaignStatus from '../../../../../../components/BonusCampaignStatus';
import renderLabel from '../../../../../../utils/renderLabel';
import { campaignTypesLabels } from '../../../../../../constants/bonus-campaigns';

class View extends Component {
  static propTypes = {
    list: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.shape({
        campaignType: React.PropTypes.string.isRequired,
        id: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        optIn: React.PropTypes.bool.isRequired,
        state: React.PropTypes.string.isRequired,
        uuid: React.PropTypes.string.isRequired,
      })),
    }).isRequired,
    fetchAvailableCampaignList: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  };

  componentDidMount() {
    this.props.fetchAvailableCampaignList(this.props.params.id);
  }

  renderCampaign = data => (
    <div id={`bonus-campaign-${data.campaignUUID}`}>
      <div className="font-weight-700 color-black">{data.name}</div>
      <div className="font-size-10">
        <Uuid uuid={data.uuid} uuidPrefix="CA" />
      </div>
    </div>
  );

  renderFulfillmentType = data => (
    <div>
      <div className="text-uppercase font-weight-700">
        {renderLabel(data.campaignType, campaignTypesLabels)}
      </div>
      <div className="font-size-10">{data.optIn ? I18n.t('COMMON.OPT_IN') : I18n.t('COMMON.NON_OPT_IN')}</div>
    </div>
  );

  renderStatus = data => (
    <BonusCampaignStatus
      campaign={data}
    />
  );

  render() {
    const { list: { entities } } = this.props;

    return (
      <div className={'tab-pane fade in active profile-tab-container'}>
        <div className="row margin-bottom-20">
          <div className="col-sm-3 col-xs-6">
            <span className="font-size-20">{I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.TITLE')}</span>
          </div>
        </div>

        <GridView
          tableClassName="table table-hovered data-grid-layout"
          headerClassName=""
          dataSource={entities}
          activePage={0}
          totalPages={0}
        >
          <GridColumn
            name="campaign"
            header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.CAMPAIGN')}
            headerClassName="text-uppercase"
            render={this.renderCampaign}
          />

          <GridColumn
            name="fulfillmentType"
            header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.FULFILLMENT_TYPE')}
            headerClassName="text-uppercase"
            render={this.renderFulfillmentType}
          />

          <GridColumn
            name="status"
            header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.STATUS')}
            headerClassName="text-uppercase"
            render={this.renderStatus}
          />
        </GridView>
      </div>
    );
  }
}

export default View;
