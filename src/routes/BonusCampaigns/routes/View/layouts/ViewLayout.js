import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Collapse } from 'reactstrap';
import PropTypes from '../../../../../constants/propTypes';
import Header from '../components/Header';
import Information from '../components/Information';

class ViewLayout extends Component {
  static propTypes = {
    data: PropTypes.bonusCampaignEntity.isRequired,
  };
  state = {
    informationShown: true,
  };

  handleToggleInformationBlock = () => {
    this.setState({ informationShown: !this.state.informationShown });
  };

  render() {
    const { informationShown } = this.state;
    const { data: bonusCampaignData } = this.props;

    return (
      <div className="player panel profile-layout">
        <div className="container-fluid">
          <div className="profile-layout-heading">
            <Header
              data={bonusCampaignData}
            />

            <div className="hide-details-block">
              <div className="hide-details-block_arrow" />
              <button
                className="hide-details-block_text btn-transparent"
                onClick={this.handleToggleInformationBlock}
              >
                {informationShown ?
                  I18n.t('COMMON.DETAILS_COLLAPSE.HIDE') :
                  I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')
                }
              </button>
              <div className="hide-details-block_arrow" />
            </div>

            <Collapse isOpen={informationShown}>
              <Information
                data={bonusCampaignData}
              />
            </Collapse>
          </div>
        </div>
      </div>

    );
  }
}

export default ViewLayout;
