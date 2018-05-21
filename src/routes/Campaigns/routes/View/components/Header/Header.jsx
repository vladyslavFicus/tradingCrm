import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';
import Uuid from '../../../../../../components/Uuid';
import StatusDropDown from '../../../../components/StatusDropDown';
import { actions, statusActions } from '../../../../../../constants/bonus-campaigns';

class Header extends Component {
  static propTypes = {
    activateMutation: PropTypes.func.isRequired,
    cancelMutation: PropTypes.func.isRequired,
    data: PropTypes.newBonusCampaignEntity.isRequired,
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

  render() {
    const {
      data: {
        name: campaignName,
        uuid,
        creationDate,
        authorUUID,
      },
      data,
    } = this.props;

    const availableStatusActions = data && statusActions[data.state]
      ? statusActions[data.state]
      : [];

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
