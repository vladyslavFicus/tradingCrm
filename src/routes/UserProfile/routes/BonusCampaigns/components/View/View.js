import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../../components/GridView';
import Uuid from '../../../../../../components/Uuid';
import renderLabel from '../../../../../../utils/renderLabel';
import { campaignTypesLabels, targetTypesLabels } from '../../../../../../constants/bonus-campaigns';
import IframeLink from '../../../../../../components/IframeLink';

class View extends Component {
  static propTypes = {
    list: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.bonusCampaignEntity),
    }).isRequired,
    fetchAvailableCampaignList: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  };

  componentDidMount() {
    this.props.fetchAvailableCampaignList(this.props.params.id);
  }

  renderCampaign = data => (
    <div id={`bonus-campaign-${data.campaignUUID}`}>
      <IframeLink
        className="font-weight-700 color-black"
        to={`/bonus-campaigns/view/${data.id}/settings`}
      >
        {data.campaignName}
      </IframeLink>
      <div className="font-size-10">
        {renderLabel(data.targetType, targetTypesLabels)}
      </div>
      <div className="font-size-10">
        <Uuid uuid={data.campaignUUID} uuidPrefix="CA" />
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

  renderAvailable = data => (
    <div>
      <div className="font-weight-700">
        {moment.utc(data.startDate).local().format('DD.MM.YYYY HH:mm')}
      </div>
      <div className="font-size-10">
        {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.DATE_TO', {
          time: moment.utc(data.endDate).local().format('DD.MM.YYYY HH:mm'),
        })}
      </div>
    </div>
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
            name="available"
            header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.AVAILABLE')}
            headerClassName="text-uppercase"
            render={this.renderAvailable}
          />

          <GridColumn
            name="fulfillmentType"
            header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.FULFILLMENT_TYPE')}
            headerClassName="text-uppercase"
            render={this.renderFulfillmentType}
          />
        </GridView>
      </div>
    );
  }
}

export default View;
