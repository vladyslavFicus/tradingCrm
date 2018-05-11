import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Collapse } from 'reactstrap';
import Header from '../components/Header';
import Information from '../components/Information';
import Settings from '../components/Settings';

class ViewLayout extends Component {
  state = {
    informationShown: true,
  };

  handleToggleInformationBlock = () => {
    this.setState({ informationShown: !this.state.informationShown });
  };

  render() {
    const { informationShown } = this.state;

    return (
      <div className="profile">
        <div className="profile__info">
          <Header />

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
            <Information />
          </Collapse>
        </div>
        <Settings />
      </div>
    );
  }
}

export default ViewLayout;
