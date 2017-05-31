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
  };
  static defaultProps = {
    availableStatusActions: [],
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
      data: bonusCampaignData,
      location,
      params,
      children,
      availableStatusActions,
      onChangeCampaignState,
    } = this.props;

    return (
      <div className="player panel profile-layout">
        <div className="container-fluid">
          <div className="profile-layout-heading">
            <Header
              onChangeCampaignState={onChangeCampaignState}
              availableStatusActions={availableStatusActions}
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

          <div className="row">
            <section className="panel profile-user-content">
              <div className="panel-body">
                <div className="nav-tabs-horizontal">
                  <Tabs
                    items={bonusCampaignTabs}
                    location={location}
                    params={params}
                  />
                  <div className="tab-content padding-vertical-20">
                    {children}
                  </div>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>

    );
  }
}

export default ViewLayout;
