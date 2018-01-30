import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from 'prop-types';
import Uuid from '../../../../../components/Uuid';
import { targetTypes } from '../../../../../constants/bonus-campaigns';

class LinkedCampaign extends Component {
  static propTypes = {
    targetType: PropTypes.string,
    linkedCampaign: PropTypes.shape({
      campaignName: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
      authorUUID: PropTypes.string.isRequired,
    }),
    linkedCampaignUUID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    remove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    linkedCampaign: null,
    linkedCampaignUUID: '',
    targetType: '',
  };

  render() {
    const {
      targetType,
      linkedCampaignUUID,
      linkedCampaign,
      remove,
    } = this.props;

    if (targetType !== targetTypes.LINKED_CAMPAIGN) {
      return null;
    }

    if (!linkedCampaignUUID) {
      return (
        <div className="linked-campaign-empty">
          {I18n.t('BONUS_CAMPAIGNS.SETTINGS.NO_SELECTED_LINKED_CAMPAIGN')}
        </div>
      );
    }

    if (!linkedCampaign) {
      return <i className="fa fa-refresh fa-spin" />;
    }

    return (
      <div className="linked-campaign-container">
        <div className="linked-campaign-label">
          {linkedCampaign.campaignName}
        </div>
        <div>
          {moment.utc(linkedCampaign.startDate).local().format('DD.MM.YYYY HH:mm')} {' - '}
          {moment.utc(linkedCampaign.endDate).local().format('DD.MM.YYYY HH:mm')}
        </div>
        <div>
          <Uuid uuid={linkedCampaign.uuid} uuidPrefix="CA" />
        </div>
        <div>
          {I18n.t('COMMON.AUTHOR_BY')}
          <Uuid uuid={linkedCampaign.authorUUID} uuidPrefix="OP" />
        </div>
        <button
          type="button"
          onClick={remove}
          className="btn-transparent linked-campaign-remove"
        >
          &times;
        </button>
      </div>
    );
  }
}

export default LinkedCampaign;
